import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Sparkles, Zap, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { callOpenAI, executeActions, AIAction } from "@/services/aiAgent";
import { useAIContext } from "@/contexts/AIContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  actions?: AIAction[];
  actionResults?: string[];
}

export const AIChatbot = () => {
  const navigate = useNavigate();
  const aiContext = useAIContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm **QELV** (Queue Entertainment Liaison Virtual assistant) - your agentic cinema companion! 🎬\n\nI don't just answer questions—I take action! Try:\n• \"Show me action movies\"\n• \"Take me to Inside Out 2\"\n• \"Find the next screening at SM Makati\"\n• \"Book 2 VIP seats for the 8PM show\"\n\nI'll navigate the app for you! 🚀"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call OpenAI with function calling
      const { response, actions } = await callOpenAI(
        [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        aiContext
      );

      // Execute actions if any
      let actionResults: string[] = [];
      if (actions.length > 0) {
        actionResults = await executeActions(
          actions,
          navigate,
          aiContext,
          {} // We'll add setters when needed
        );
        
        // Show action feedback
        toast.success(`Action: ${actions[0].type}`, {
          description: actionResults[0],
          icon: <Zap className="w-4 h-4" />
        });
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        actions,
        actionResults
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("AI error:", error);
      
      if (error.message?.includes("API key not configured")) {
        toast.error("AI Not Configured", {
          description: "Please add VITE_GEMINI_API_KEY to your .env file"
        });
      } else if (error.message?.includes("429")) {
        toast.error("Rate limit exceeded. Please try again in a moment.");
      } else {
        toast.error("Failed to process request. Please try again.");
      }
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble processing that request. Please make sure the AI service is configured correctly."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-glow bg-primary hover:bg-primary-hover z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-card bg-card border-border z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border gradient-cinema">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-display font-bold">QELV AI Assistant</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="hover:bg-background/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                </div>
                
                {/* Show actions taken */}
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.actions.map((action, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs capitalize">{action.type.replace(/_/g, ' ')}</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="bg-background border-border"
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
                className="bg-primary hover:bg-primary-hover"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

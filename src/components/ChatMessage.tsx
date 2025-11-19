import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

const ChatMessage = ({ role, content, image }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 animate-fade-in p-4 rounded-lg",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-xl border",
          isUser
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-glass-bg border-glass-border text-foreground"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
        {image && (
          <img 
            src={image} 
            alt="Generated content" 
            className="mt-3 rounded-lg max-w-full h-auto"
          />
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-accent-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

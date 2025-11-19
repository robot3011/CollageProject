import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import VoiceButton from "./VoiceButton";
import ImageGenerationButton from "./ImageGenerationButton";
import { useVoice } from "@/hooks/useVoice";

interface ChatInputProps {
  onSend: (message: string) => void;
  onGenerateImage: () => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, onGenerateImage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { isListening, startListening, stopListening } = useVoice();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setMessage(transcript);
      });
    }
  };

  const handleGenerateImage = () => {
    if (message.trim()) {
      onGenerateImage();
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="backdrop-blur-xl bg-glass-bg border border-glass-border rounded-2xl p-2 flex gap-2 items-end">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Nexus anything..."
          disabled={disabled || isListening}
          className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
        />
        <div className="flex gap-2">
          <VoiceButton 
            isListening={isListening} 
            onToggle={handleVoiceToggle}
            disabled={disabled}
          />
          <ImageGenerationButton 
            onGenerate={handleGenerateImage}
            disabled={disabled || !message.trim()}
          />
          <Button
            type="submit"
            disabled={disabled || !message.trim()}
            size="icon"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex-shrink-0 h-10 w-10"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;

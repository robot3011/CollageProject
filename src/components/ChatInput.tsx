import { useState, useEffect } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import ImageGenerationButton from "./ImageGenerationButton";
import { useSpeechToText } from "@/hooks/useSpeechToText";

interface ChatInputProps {
  onSend: (message: string) => void;
  onGenerateImage: () => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, onGenerateImage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useSpeechToText();

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      clearTranscript();
      if (isListening) {
        stopListening();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      startListening();
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
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening..." : "Ask Nexus anything..."}
            disabled={disabled}
            className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
          />
          {isListening && (
            <div className="absolute bottom-2 left-2 text-xs text-destructive font-medium animate-pulse">
              Listening...
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleMicToggle}
            disabled={disabled}
            size="icon"
            variant={isListening ? "destructive" : "secondary"}
            className="rounded-xl flex-shrink-0 h-10 w-10"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
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

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
      <div className="backdrop-blur-xl bg-glass-bg border border-glass-border rounded-2xl p-3 flex gap-3 items-center">
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "🎤 Listening..." : "💬 Ask Nexus anything..."}
            disabled={disabled}
            className="min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground py-3"
          />
          {isListening && (
            <div className="absolute bottom-3 left-2 text-xs text-primary font-medium animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Listening...
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            onClick={handleMicToggle}
            disabled={disabled}
            size="icon"
            variant={isListening ? "destructive" : "secondary"}
            className="rounded-xl flex-shrink-0 h-11 w-11 transition-all hover:scale-105"
            title={isListening ? "Stop listening" : "Start voice input"}
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex-shrink-0 h-11 w-11 transition-all hover:scale-105"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;

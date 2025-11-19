import { Mic, MicOff } from "lucide-react";
import { Button } from "./ui/button";

interface VoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const VoiceButton = ({ isListening, onToggle, disabled }: VoiceButtonProps) => {
  return (
    <Button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      size="icon"
      variant={isListening ? "destructive" : "secondary"}
      className="rounded-xl flex-shrink-0 h-10 w-10"
    >
      {isListening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </Button>
  );
};

export default VoiceButton;
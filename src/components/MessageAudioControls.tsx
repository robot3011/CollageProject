import { Play, Pause, Square } from "lucide-react";
import { Button } from "./ui/button";
import { useMessageAudio } from "@/hooks/useMessageAudio";

interface MessageAudioControlsProps {
  content: string;
}

const MessageAudioControls = ({ content }: MessageAudioControlsProps) => {
  const { isPlaying, isPaused, play, pause, stop } = useMessageAudio(content);

  return (
    <div className="flex items-center gap-1 mt-2">
      {!isPlaying && !isPaused && (
        <Button
          variant="ghost"
          size="sm"
          onClick={play}
          className="h-7 w-7 p-0"
          title="Play"
        >
          <Play className="h-3 w-3" />
        </Button>
      )}
      {isPlaying && (
        <Button
          variant="ghost"
          size="sm"
          onClick={pause}
          className="h-7 w-7 p-0"
          title="Pause"
        >
          <Pause className="h-3 w-3" />
        </Button>
      )}
      {isPaused && (
        <Button
          variant="ghost"
          size="sm"
          onClick={play}
          className="h-7 w-7 p-0"
          title="Resume"
        >
          <Play className="h-3 w-3" />
        </Button>
      )}
      {(isPlaying || isPaused) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={stop}
          className="h-7 w-7 p-0"
          title="Stop"
        >
          <Square className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default MessageAudioControls;

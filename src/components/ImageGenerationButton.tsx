import { ImagePlus } from "lucide-react";
import { Button } from "./ui/button";

interface ImageGenerationButtonProps {
  onGenerate: () => void;
  disabled?: boolean;
}

const ImageGenerationButton = ({ onGenerate, disabled }: ImageGenerationButtonProps) => {
  return (
    <Button
      type="button"
      onClick={onGenerate}
      disabled={disabled}
      size="icon"
      variant="secondary"
      className="rounded-xl flex-shrink-0 h-10 w-10"
    >
      <ImagePlus className="w-5 h-5" />
    </Button>
  );
};

export default ImageGenerationButton;
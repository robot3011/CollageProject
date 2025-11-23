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
      className="rounded-xl flex-shrink-0 h-11 w-11 transition-all hover:scale-105"
      title="Generate image"
    >
      <ImagePlus className="w-5 h-5" />
    </Button>
  );
};

export default ImageGenerationButton;
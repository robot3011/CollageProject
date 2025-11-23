import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export const useSpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();
  const isManualStop = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        setRecognition(recognitionInstance);
      } else {
        console.warn("Speech recognition not supported");
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    setIsListening(true);
    setTranscript("");
    isManualStop.current = false;
    
    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + " ";
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      setTranscript((prev) => {
        const cleaned = prev.replace(/\s+$/, "");
        return cleaned + " " + finalTranscript + interimTranscript;
      });
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (!isManualStop.current) {
        setIsListening(false);
        toast({
          title: "Voice Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
      }
    };

    recognition.onend = () => {
      if (!isManualStop.current) {
        setIsListening(false);
      }
    };

    recognition.start();
  }, [recognition, toast]);

  const stopListening = useCallback(() => {
    if (recognition) {
      isManualStop.current = true;
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
  };
};

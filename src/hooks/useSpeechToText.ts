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
      let finalText = "";
      
      // Get all final results
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + " ";
        }
      }
      
      // Get the latest interim result
      if (event.results.length > 0) {
        const lastResult = event.results[event.results.length - 1];
        if (!lastResult.isFinal) {
          finalText += lastResult[0].transcript;
        }
      }

      setTranscript(finalText.trim());
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (!isManualStop.current) {
        setIsListening(false);
        
        let errorMessage = "Failed to recognize speech. Please try again.";
        
        if (event.error === 'network') {
          errorMessage = "Network error. Check your internet connection and try again.";
        } else if (event.error === 'not-allowed') {
          errorMessage = "Microphone access denied. Please allow microphone permissions.";
        } else if (event.error === 'no-speech') {
          errorMessage = "No speech detected. Please try speaking again.";
        }
        
        toast({
          title: "Voice Error",
          description: errorMessage,
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

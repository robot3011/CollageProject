import { useState, useCallback } from "react";
import { useToast } from "./use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  image?: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(
    async (content: string, generateImage = false) => {
      const userMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Handle image generation separately
        if (generateImage) {
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              },
              body: JSON.stringify({
                messages: [...messages, userMessage],
                generateImage: true,
              }),
            }
          );

          if (!response.ok) throw new Error("Failed to generate image");

          const data = await response.json();
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.content, image: data.image },
          ]);
          return;
        }

        // Regular chat
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              messages: [...messages, userMessage],
            }),
          }
        );

        if (!response.ok) {
          if (response.status === 429) {
            toast({
              title: "Rate Limit Exceeded",
              description: "Too many requests. Please wait a moment and try again.",
              variant: "destructive",
            });
            return;
          }
          if (response.status === 402) {
            toast({
              title: "Credits Depleted",
              description: "Please add credits to your workspace to continue.",
              variant: "destructive",
            });
            return;
          }
          throw new Error("Failed to get response");
        }

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";
        let buffer = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (let line of lines) {
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantMessage += delta;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Parse error:", e);
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, toast]
  );

  const generateImage = useCallback(
    async (prompt: string) => {
      await sendMessage(prompt, true);
    },
    [sendMessage]
  );

  return { messages, sendMessage, generateImage, isLoading };
};

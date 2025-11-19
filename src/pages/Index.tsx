import { useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useVoice } from "@/hooks/useVoice";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const { messages, sendMessage, generateImage, isLoading } = useChat();
  const { speak } = useVoice();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" && !isLoading) {
      speak(lastMessage.content);
    }
  }, [messages, isLoading, speak]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-4xl mx-auto px-4 py-8 flex flex-col flex-1">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <HeroSection />
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  role={message.role} 
                  content={message.content}
                  image={message.image}
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-4 p-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <div className="mt-6">
          <ChatInput 
            onSend={sendMessage} 
            onGenerateImage={() => {
              const lastMessage = messages[messages.length - 1];
              if (lastMessage?.role === "user") {
                generateImage(lastMessage.content);
              }
            }}
            disabled={isLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;

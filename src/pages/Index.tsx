import { useEffect, useRef, useState } from "react";
import HeroSection from "@/components/HeroSection";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Header from "@/components/Header";
import { useChat } from "@/hooks/useChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { useVisitorAnalytics } from "@/hooks/useVisitorAnalytics";

const Index = () => {
  const { messages, sendMessage, generateImage, isLoading } = useChat();
  const { trackVisit } = useVisitorAnalytics();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visitor_session_id");
    if (!hasVisited) {
      setShowWelcomeDialog(true);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNameSubmit = async (name: string) => {
    await trackVisit(name);
    setShowWelcomeDialog(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <WelcomeDialog open={showWelcomeDialog} onSubmit={handleNameSubmit} />
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8 flex flex-col flex-1 pt-20">
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

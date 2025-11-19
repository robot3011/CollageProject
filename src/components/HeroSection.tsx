import { Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-glass-bg border border-glass-border">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">AI-Powered Assistant</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
          Build something with
        </span>
        <br />
        <span className="text-foreground">Nexus</span>
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        Your intelligent AI assistant that checks multiple resources to provide
        comprehensive, accurate answers to help you build anything.
      </p>

      <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Multi-source research</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Real-time responses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Intelligent assistance</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

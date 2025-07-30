"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import { SettingsDropdown } from "@/components/settings-dropdown";

interface PromptBarProps {
  onGenerate?: (type: "image" | "video", prompt: string) => void;
}

export function PromptBar({ onGenerate }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<"text" | "idea">("text");
  const [subject, setSubject] = useState("");
  const [scene, setScene] = useState("");
  const [vibe, setVibe] = useState("");

  const subjects = ["Wizard", "Robot", "Explorer", "Alien", "Pirate", "Dragon"];
  const scenes = [
    "futuristic city",
    "enchanted forest",
    "space station",
    "underwater realm",
    "desert landscape",
    "cyberpunk alley",
  ];
  const vibes = [
    "ethereal",
    "dark",
    "whimsical",
    "serene",
    "retro",
    "vibrant",
  ];

  const ideaPrompt = `${subject}${subject && scene ? ` in ${scene}` : scene}${
    (subject || scene) && vibe ? ", " : ""}${vibe}`.trim();

  const randomFrom = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const handleShuffle = () => {
    setSubject(randomFrom(subjects));
    setScene(randomFrom(scenes));
    setVibe(randomFrom(vibes));
  };

  const handleGenerate = (type: "image" | "video", customPrompt?: string) => {
    const finalPrompt = (customPrompt ?? prompt).trim();
    if (!finalPrompt) return;
    
    setIsGenerating(true);
    
    // Call the parent handler to add new generation
    if (onGenerate) {
      onGenerate(type, finalPrompt);
    }
    
    // Clear the prompt
    setPrompt("");
    
    // Reset generating state
    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mode === "text" && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate("image"); // Default to image on Enter
    }
  };

  return (
    <div className="w-full py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4">
          {/* Mode selector */}
          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant={mode === "text" ? "default" : "outline"}
              onClick={() => setMode("text")}
            >
              Text
            </Button>
            <Button
              size="sm"
              variant={mode === "idea" ? "default" : "outline"}
              onClick={() => setMode("idea")}
            >
              Idea
            </Button>
          </div>

          {/* Main prompt input */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* OpenJourney Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/openjourney-logo.svg"
                alt="OpenJourney"
                width={140}
                height={30}
                className="h-6 sm:h-8 w-auto dark:invert"
              />
            </div>
            
            <div className="relative flex-1 w-full">
              {mode === "text" ? (
                <Input
                  placeholder="Describe your clip..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pr-2 sm:pr-44 h-12 text-base bg-card border-input"
                  disabled={isGenerating}
                />
              ) : (
                <Input
                  placeholder="Compose your idea..."
                  value={ideaPrompt}
                  readOnly
                  className="pr-2 sm:pr-44 h-12 text-base bg-card border-input"
                />
              )}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex gap-2">
                {mode === "text" ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerate("image")}
                      disabled={!prompt.trim() || isGenerating}
                      className="h-8"
                    >
                      <ImageIcon className="w-4 h-4 mr-1" />
                      Image
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleGenerate("video")}
                      disabled={!prompt.trim() || isGenerating}
                      className="h-8"
                    >
                      <VideoIcon className="w-4 h-4 mr-1" />
                      Video
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleShuffle}
                      className="h-8"
                    >
                      Shuffle
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleGenerate("image", ideaPrompt)}
                      className="h-8"
                    >
                      Visualize
                    </Button>
                  </>
                )}
                <SettingsDropdown />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {mode === "idea" && (
              <motion.div
                key="idea-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 overflow-hidden"
              >
                <Input
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-10"
                />
                <Input
                  placeholder="Scene"
                  value={scene}
                  onChange={(e) => setScene(e.target.value)}
                  className="h-10"
                />
                <Input
                  placeholder="Vibe"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  className="h-10"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile buttons row */}
          <div className="flex sm:hidden gap-3 justify-center">
            {mode === "text" ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleGenerate("image")}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 h-10"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Image
                </Button>
                <Button
                  onClick={() => handleGenerate("video")}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex-1 h-10"
                >
                  <VideoIcon className="w-4 h-4 mr-2" />
                  Video
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleShuffle}
                  className="flex-1 h-10"
                >
                  Shuffle
                </Button>
                <Button
                  onClick={() => handleGenerate("image", ideaPrompt)}
                  className="flex-1 h-10"
                >
                  Visualize
                </Button>
              </>
            )}
            <SettingsDropdown />
          </div>


        </div>
      </div>
    </div>
  );
} 
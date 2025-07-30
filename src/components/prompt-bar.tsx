"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageIcon, VideoIcon, Shuffle } from "lucide-react";
import Image from "next/image";
import { SettingsDropdown } from "@/components/settings-dropdown";
import { AnimatePresence, motion } from "framer-motion";

interface PromptBarProps {
  onGenerate?: (type: "image" | "video", prompt: string) => void;
}

export function PromptBar({ onGenerate }: PromptBarProps) {
  const [mode, setMode] = useState<"text" | "idea">("text");
  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("");
  const [scene, setScene] = useState("");
  const [vibe, setVibe] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const subjects = [
    "wizard",
    "astronaut",
    "robot",
    "samurai",
  ];
  const scenes = [
    "futuristic city",
    "enchanted forest",
    "distant planet",
    "ancient ruins",
  ];
  const vibes = ["ethereal", "moody", "vibrant", "dreamy"];

  const ideaSummary = [subject, scene, vibe]
    .filter(Boolean)
    .join(", ");

  const shuffleIdea = () => {
    setSubject(subjects[Math.floor(Math.random() * subjects.length)]);
    setScene(scenes[Math.floor(Math.random() * scenes.length)]);
    setVibe(vibes[Math.floor(Math.random() * vibes.length)]);
  };

  const handleGenerate = (type: "image" | "video") => {
    const finalPrompt =
      mode === "text" ? prompt.trim() : ideaSummary.trim();
    if (!finalPrompt) return;

    setIsGenerating(true);

    // Call the parent handler to add new generation
    if (onGenerate) {
      onGenerate(type, finalPrompt);
    }

    // Clear the prompt/idea fields
    if (mode === "text") {
      setPrompt("");
    } else {
      setSubject("");
      setScene("");
      setVibe("");
    }
    
    // Reset generating state
    setTimeout(() => {
      setIsGenerating(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mode !== "text") return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate("image"); // Default to image on Enter
    }
  };

  return (
    <div className="w-full py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center gap-2">
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
              <Input
                placeholder={
                  mode === "text"
                    ? "Describe your clip..."
                    : "Your idea summary..."
                }
                value={mode === "text" ? prompt : ideaSummary}
                readOnly={mode === "idea"}
                onChange={
                  mode === "text" ? (e) => setPrompt(e.target.value) : undefined
                }
                onKeyDown={handleKeyDown}
                className="pr-2 sm:pr-44 h-12 text-base bg-card border-input"
                disabled={isGenerating}
              />
              {mode === "text" ? (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex gap-2">
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
                  <SettingsDropdown />
                </div>
              ) : (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleGenerate("image")}
                    disabled={!ideaSummary.trim() || isGenerating}
                    className="h-8"
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Visualize
                  </Button>
                  <SettingsDropdown />
                </div>
              )}
            </div>
          </div>

          {/* Mobile buttons row */}
          {mode === "text" ? (
            <div className="flex sm:hidden gap-3 justify-center">
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
              <SettingsDropdown />
            </div>
          ) : (
            <div className="flex sm:hidden gap-3 justify-center">
              <Button
                onClick={() => handleGenerate("image")}
                disabled={!ideaSummary.trim() || isGenerating}
                className="flex-1 h-10"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Visualize
              </Button>
              <SettingsDropdown />
            </div>
          )}

          <AnimatePresence initial={false}>
            {mode === "idea" && (
              <motion.div
                key="idea-fields"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden flex flex-col gap-2"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Scene"
                    value={scene}
                    onChange={(e) => setScene(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Vibe"
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shuffleIdea}
                    className="h-8"
                  >
                    <Shuffle className="w-4 h-4 mr-1" />
                    Shuffle
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>


        </div>
      </div>
    </div>
  );
} 
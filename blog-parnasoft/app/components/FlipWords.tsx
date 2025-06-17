import React, { useCallback, useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export const FlipWords: React.FC<FlipWordsProps> = ({
  words,
  duration = 3000,
  className,
}) => {
  const [currentWord, setCurrentWord] = useState<string>(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const measureRef = useRef<HTMLDivElement>(null);

  // Measure the width of the longest word on mount
  useEffect(() => {
    if (measureRef.current) {
      let maxWordWidth = 0;
      words.forEach(word => {
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.fontSize = 'inherit';
        tempSpan.style.fontFamily = 'inherit';
        tempSpan.style.fontWeight = 'inherit';
        tempSpan.className = 'text-4xl sm:text-5xl lg:text-6xl font-bold text-[#00d8e8]';
        tempSpan.textContent = word;
        document.body.appendChild(tempSpan);
        const width = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);
        maxWordWidth = Math.max(maxWordWidth, width);
      });
      setMaxWidth(maxWordWidth);
    }
  }, [words]);

  const startAnimation = useCallback(() => {
    const nextWord = words[(words.indexOf(currentWord) + 1) % words.length];
    setCurrentWord(nextWord);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(startAnimation, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation]);

  return (
    <div 
      ref={measureRef}
      className="relative inline-block"
      style={{ width: maxWidth > 0 ? `${maxWidth}px` : 'auto', minWidth: '200px' }}
    >
      <AnimatePresence
        mode="sync"
        onExitComplete={() => {
          setIsAnimating(false);
        }}
      >
        <motion.div
          key={currentWord}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          exit={{ opacity: 0, filter: "blur(8px)", position: "absolute" }}
          className={`z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2 ${
            className || ""
          }`}
        >
          {currentWord.split(" ").map((word, wordIndex) => (
            <motion.span
              key={word + wordIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: wordIndex * 0.3,
                duration: 0.4,
              }}
              className="inline-block whitespace-nowrap"
            >
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  key={word + letterIndex}
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: wordIndex * 0.3 + letterIndex * 0.05,
                    duration: 0.3,
                  }}
                  className="inline-block text-[#00d8e8] text-align-start"
                >
                  {letter}
                </motion.span>
              ))}
              <span className="inline-block">&nbsp;</span>
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Demo component
export default function FlipWordsDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-8">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1e3a4b]">
          EXPLORE OUR
        </h1>
        <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold text-[#00d8e8]">
          <FlipWords words={["INSIGHTS", "ARTICLES", "STORIES"]} duration={1400} />
        </h1>
      </div>
    </div>
  );
}
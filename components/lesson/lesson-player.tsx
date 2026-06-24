"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Volume2, ChevronDown, ChevronUp, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import Confetti from "react-confetti";

type LessonItem = {
  id: number;
  itemId: string;
  lessonId: number;
  type: string;
  en: string;
  zh: string;
  py: string;
  accepted: unknown; // JSON field from database
  audio: string | null;
  order: number;
  createdAt: Date | null;
};

type Lesson = {
  id: number;
  lessonId: string;
  titleEn: string;
  titleZh: string | null;
  descriptionEn: string;
  cover: string | null;
  tag: string;
  order: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  items: LessonItem[];
};

interface LessonPlayerProps {
  lesson: Lesson;
  userId: string;
}

export function LessonPlayer({ lesson, userId }: LessonPlayerProps) {
  // Track progress and save to database
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [showDescription, setShowDescription] = useState(false);
  const [hasPlayedAuto, setHasPlayedAuto] = useState(false);
  const [autoPlayCount, setAutoPlayCount] = useState(0);
  const [correctPlayCount, setCorrectPlayCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [startTime] = useState<Date>(new Date());
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const [playTyping] = useSound("/audio/typing.mp3", { volume: 0.3 });
  const [playCorrect] = useSound("/audio/correct.mp3", { volume: 0.5 });
  const [playError] = useSound("/audio/error.mp3", { volume: 0.5 });

  const currentItem = lesson.items[currentItemIndex];
  const isLastItem = currentItemIndex === lesson.items.length - 1;
  const isLessonComplete = completedItems.size === lesson.items.length;
  const progress = Math.round((completedItems.size / lesson.items.length) * 100);

  // Auto-play audio when item changes
  useEffect(() => {
    if (currentItem?.audio && autoPlayCount < 2) {
      const timer = setTimeout(() => {
        const audio = new Audio(currentItem.audio!);
        audio.play().catch(() => {});
        setAutoPlayCount(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentItemIndex, autoPlayCount, currentItem?.audio]);

  // Show confetti when lesson is completed
  useEffect(() => {
    if (isLessonComplete) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isLessonComplete]);

  const playAudio = useCallback(() => {
    if (currentItem?.audio) {
      if (hasPlayedAuto && !isCorrect) {
        setHasPlayedAuto(true);
      }
      if (isCorrect && correctPlayCount < 2) {
        setCorrectPlayCount(prev => prev + 1);
      }
      const audio = new Audio(currentItem.audio);
      audio.play().catch(() => {});
    }
  }, [currentItem?.audio, hasPlayedAuto, isCorrect, correctPlayCount]);

  // Save progress to database with specific completed count
  const saveProgressWithCount = async (completedCount: number) => {
    try {
      const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
      const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);

      console.log('Saving progress:', {
        completedItems: completedCount,
        totalItems: lesson.items.length,
        isCompleted: completedCount >= lesson.items.length
      });

      await fetch('/api/lesson-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          lessonId: lesson.id,
          completedItems: completedCount,
          totalItems: lesson.items.length,
          accuracy,
          timeSpent
        })
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };



  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Play typing sound for letter keys and space
      if ((event.key >= 'a' && event.key <= 'z') || (event.key >= 'A' && event.key <= 'Z') || event.key === ' ') {
        playTyping();
      }
      // Ctrl + P to play audio
      if (event.ctrlKey && event.key === 'p') {
        event.preventDefault();
        playAudio();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [playTyping, playAudio]);

  const normalizeInput = (input: string) => {
    return input.toLowerCase().replace(/[0-9]/g, '').replace(/\s+/g, ' ').trim();
  };

  const checkAnswer = async () => {
    if (!currentItem) return;

    const normalizedInput = normalizeInput(userInput);
    const acceptedAnswers = currentItem.accepted as string[];
    const isAnswerCorrect = acceptedAnswers.some(
      (accepted: string) => normalizeInput(accepted) === normalizedInput
    );

    setTotalAttempts(prev => prev + 1);
    if (isAnswerCorrect) {
      setCorrectAttempts(prev => prev + 1);
    }

    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);

    if (isAnswerCorrect) {
      playCorrect();
      const newCompleted = new Set([...completedItems, currentItemIndex]);
      setCompletedItems(newCompleted);
      
      // If this is the last item, ensure we mark it as completely finished
      const completedCount = newCompleted.size;
      const isThisTheLastItem = currentItemIndex === lesson.items.length - 1;
      
      console.log('Answer correct:', {
        currentItemIndex,
        completedCount,
        totalItems: lesson.items.length,
        isLastItem: isThisTheLastItem,
        willBeCompleted: completedCount >= lesson.items.length
      });
      
      // Save progress with the updated count
      await saveProgressWithCount(completedCount);
    } else {
      playError();
      // Clear input for incorrect answers so user can try again
      setTimeout(() => {
        setUserInput("");
        setIsCorrect(null);
        setShowAnswer(false);
        inputRef.current?.focus();
      }, 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || showAnswer) return;
    checkAnswer();
  };

  const nextItem = async () => {
    if (isLastItem) {
      // For the last item, we need to make sure we count it as completed
      // The current item should already be in completedItems from checkAnswer
      const finalCompletedCount = Math.max(completedItems.size, currentItemIndex + 1);
      console.log('Final lesson completion:', {
        completedItems: finalCompletedCount,
        totalItems: lesson.items.length,
        currentIndex: currentItemIndex,
        completedItemsSize: completedItems.size,
        isLastItem: true
      });
      await saveProgressWithCount(finalCompletedCount);
      return;
    }
    
    setCurrentItemIndex(prev => prev + 1);
    setUserInput("");
    setIsCorrect(null);
    setShowAnswer(false);
    setHasPlayedAuto(false);
    setAutoPlayCount(0);
    setCorrectPlayCount(0);
    
    // Focus input for next item
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showAnswer && isCorrect) { // Only proceed if answer is correct and shown
        nextItem();
      } else if (!showAnswer) { // Only submit if answer is not shown
        handleSubmit(e);
      }
    }
  };

  if (isLessonComplete) {
    return <LessonComplete lesson={lesson} showConfetti={showConfetti} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/courses">
                <X className="w-4 h-4 mr-2" />
                Exit
              </Link>
            </Button>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
            <div>
              <Badge className="mb-1">{lesson.tag}</Badge>
              <h1 className="font-bold text-lg">{lesson.titleEn}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentItemIndex + 1} / {lesson.items.length}
            </div>
            <div className="w-32">
              <Progress value={progress} />
            </div>
            <div className="text-sm font-medium">{progress}%</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Course Description */}
        <AnimatePresence>
          {showDescription && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{lesson.descriptionEn}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDescription(!showDescription)}
            className="text-gray-500 dark:text-gray-400"
          >
            Course Info
            {showDescription ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </Button>
        </div>

        {/* Main Practice Area */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="text-center space-y-8">
              {/* English Prompt */}
              <div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                  {currentItem?.en}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={playAudio}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    Listen
                  </Button>
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="max-w-md mx-auto">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type the Pinyin..."
                    className={cn(
                      "text-center !text-3xl py-8 border-0 border-b-2 rounded-none bg-transparent focus:ring-0 focus:border-orange-500",
                      isCorrect === false && "border-red-500 text-red-600 dark:text-red-400",
                      isCorrect === true && "border-green-500 text-green-600 dark:text-green-400",
                      isCorrect === null && "border-gray-300 dark:border-gray-600"
                    )}
                    disabled={false}
                    autoFocus
                  />
                </div>

                {!showAnswer && (
                  <Button type="submit" size="lg" disabled={!userInput.trim()}>
                    Check Answer
                  </Button>
                )}
              </form>

              {/* Answer Display */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                        {currentItem?.zh}
                      </div>
                      <div className="text-xl text-gray-600 dark:text-gray-400">
                        {currentItem?.py}
                      </div>
                      {!isCorrect && (
                        <div className="mt-4 text-sm text-red-600 dark:text-red-400">
                          Correct answer: {(currentItem.accepted as string[])[0]}
                        </div>
                      )}
                    </div>

                    {isCorrect && ( // Only show Next button if correct
                      <Button size="lg" onClick={nextItem}>
                        {isLastItem ? "Complete Lesson" : "Next Word"}
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                <span>Ctrl+P: Play audio</span>
              </div>
              <div>Enter: Submit/Next</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LessonComplete({ lesson, showConfetti }: { lesson: Lesson; showConfetti: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center relative">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
      )}
      <Card className="max-w-lg mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold">Great job!</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            You&apos;ve mastered {lesson.items.length} new words in {lesson.titleEn}!
          </p>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{lesson.items.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Words Learned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">100%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Accuracy</div>
            </div>
          </div>

          <Button asChild size="lg" className="w-full">
            <Link href="/dashboard/courses">Back to Course List</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 
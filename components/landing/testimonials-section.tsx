"use client";

import { motion } from "framer-motion";
import { Keyboard, Sparkles, Headphones, BarChart3, Award, Repeat } from "lucide-react";

export function TestimonialsSection() {
  const highlights = [
    {
      icon: Keyboard,
      title: "Pinyin-First Typing Practice",
      content: "Build muscle memory for Chinese input through structured, progressively harder typing drills."
    },
    {
      icon: Sparkles,
      title: "Gamified Lessons",
      content: "Earn points and track streaks as you move through interactive lessons designed to keep practice consistent."
    },
    {
      icon: Headphones,
      title: "Audio Pronunciation Feedback",
      content: "Hear native pronunciation alongside every character and word to help you connect sound with input."
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      content: "See your typing speed and accuracy improve over time with detailed lesson-by-lesson stats."
    },
    {
      icon: Repeat,
      title: "Spaced Repetition",
      content: "Review previously learned characters at the right intervals so they stick in long-term memory."
    },
    {
      icon: Award,
      title: "Exam-Oriented Drills",
      content: "Practice the kind of digital input speed and accuracy that computer-based Chinese exams require."
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Built for{" "}
            <span className="text-orange-500">Real Progress</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Every lesson is designed to move you closer to fluent, confident Chinese typing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl relative hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white mb-4">
                <item.icon className="w-6 h-6" />
              </div>

              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h4>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 
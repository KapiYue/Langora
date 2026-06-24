"use client";

import { motion } from "framer-motion";
import { Keyboard, Volume2, Trophy, Clock, BookOpen, Zap } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Keyboard,
      title: "Interactive Typing Practice",
      description: "Real-time typing practice with instant feedback and auto-correction",
      color: "blue"
    },
    {
      icon: Volume2,
      title: "Audio Pronunciation",
      description: "Listen to native pronunciation for every word and phrase",
      color: "green"
    },
    {
      icon: Trophy,
      title: "Gamified Learning",
      description: "Earn points, unlock achievements, and track your progress",
      color: "orange"
    },
    {
      icon: Clock,
      title: "Adaptive Pacing",
      description: "Learn at your own pace with personalized lesson timing",
      color: "purple"
    },
    {
      icon: BookOpen,
      title: "Structured Curriculum",
      description: "From basic greetings to complex conversations, step by step",
      color: "pink"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get immediate corrections and hints to improve quickly",
      color: "yellow"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
      purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
      yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Powerful Features for{" "}
            <span className="text-orange-500">Effective Learning</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to master Chinese typing, from beginner to advanced level.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${getColorClasses(feature.color)}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 
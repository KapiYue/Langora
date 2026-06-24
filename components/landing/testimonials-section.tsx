"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Exchange Student in Beijing",
      avatar: "SC",
      rating: 5,
      content: "This platform revolutionized my Chinese learning. I went from struggling with basic characters to typing full sentences in just 3 months!"
    },
    {
      name: "Michael Rodriguez",
      role: "Business Professional",
      avatar: "MR",
      rating: 5,
      content: "The gamified approach kept me motivated. I actually look forward to my daily typing practice sessions now!"
    },
    {
      name: "Emma Thompson",
      role: "HSK Exam Candidate",
      avatar: "ET",
      rating: 5,
      content: "Perfect preparation for digital Chinese exams. The typing speed I gained here directly helped in my HSK computer-based test."
    },
    {
      name: "David Kim",
      role: "Language Enthusiast",
      avatar: "DK",
      rating: 5,
      content: "The structured lessons and instant feedback make learning efficient. I've tried many apps, but this one actually works."
    },
    {
      name: "Lisa Wang",
      role: "Graduate Student",
      avatar: "LW",
      rating: 5,
      content: "As someone who grew up speaking Chinese but couldn't type, this platform filled a crucial gap in my digital literacy."
    },
    {
      name: "James Wilson",
      role: "Tech Worker",
      avatar: "JW",
      rating: 5,
      content: "Clean interface, great progression system. The audio pronunciation feature is incredibly helpful for getting tones right."
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
            Loved by{" "}
            <span className="text-orange-500">Learners Worldwide</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of successful learners who have mastered Chinese typing with our platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl relative hover:shadow-lg transition-shadow duration-300"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-orange-200 dark:text-orange-800" />
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            <span className="font-semibold">4.9/5 rating</span>
            <span className="text-orange-600 dark:text-orange-400">from 1,200+ reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
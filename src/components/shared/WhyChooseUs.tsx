'use client'

import { useState } from 'react'
import { ChevronDown, Target, Users, Clock, BookOpen, Shield, Headphones } from 'lucide-react'

const REASONS = [
  {
    icon: Target,
    title: 'Personalized Help',
    description: 'Every student gets a customized counselling plan based on their rank, category, and preferences. We don\'t believe in one-size-fits-all.',
  },
  {
    icon: Users,
    title: 'Expert Counselors',
    description: 'Our team consists of 50+ experienced counsellors who have guided thousands of students to their dream colleges.',
  },
  {
    icon: Clock,
    title: '24x7 Support',
    description: 'Round-the-clock support via WhatsApp, call, and video sessions. We\'re always available when you need us.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Resources',
    description: 'Access to blog articles, video guides, college predictors, and rank analysis tools to make informed decisions.',
  },
  {
    icon: Shield,
    title: 'Proven Track Record',
    description: '17,000+ students guided successfully. Our predictions have helped students get into top medical and engineering colleges.',
  },
  {
    icon: Headphones,
    title: 'Hindi & English',
    description: 'Guidance available in both Hindi and English. We understand every student and parent, regardless of language preference.',
  },
]

export function WhyChooseUs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-white py-8 px-3 sm:py-12 sm:px-4 lg:py-14">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-[#062963] mb-2 sm:mb-4 leading-tight px-1">
          Why 17000+ Students Trust Us
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-4 sm:mb-6 text-xs sm:text-sm lg:text-base leading-snug px-1">
          NEET Counselling is your one-stop guide for college admissions — made for every student, in every corner of India.
        </p>

        {/* Mobile: Accordion */}
        <div className="space-y-2 sm:space-y-4 sm:hidden text-left">
          {REASONS.map((reason, index) => (
            <div key={reason.title} className="glass-card p-3 bg-[#F8F8F8]">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex justify-between items-center gap-2 w-full font-semibold text-sm leading-snug text-[#062963]"
              >
                <span className="flex items-center gap-2">
                  <reason.icon className="w-5 h-5 text-[#062963]" />
                  {reason.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === index && (
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  {reason.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-5 lg:gap-6 text-left">
          {REASONS.map((reason) => (
            <div key={reason.title} className="glass-card p-4 shadow-sm bg-[#F8F8F8]">
              <reason.icon className="w-8 h-8 mb-3 text-[#062963]" />
              <h3 className="font-semibold text-[#062963] text-sm sm:text-lg mb-2">{reason.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface ContactFormProps {
  contactEmail?: string | null
  phone?: string | null
  address?: string | null
}

export function ContactForm({ contactEmail, phone, address }: ContactFormProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div>
        <h2 className="text-2xl font-bold text-[#062963]">Send us a message</h2>
        <p className="mt-2 text-sm text-gray-500">
          Fill out the form below and we&apos;ll get back to you as soon as possible.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#062963]">Name</Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
              className="border-gray-300 focus-visible:ring-[#062963]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#062963]">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="border-gray-300 focus-visible:ring-[#062963]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-[#062963]">Subject</Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Subject"
              className="border-gray-300 focus-visible:ring-[#062963]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-[#062963]">Message</Label>
            <textarea
              id="message"
              rows={5}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#062963] md:text-sm"
              placeholder="Your message"
            />
          </div>
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-[#FBAC1A] hover:bg-[#e09b18] text-[#062963] font-semibold"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
          {status === 'success' && (
            <p className="text-sm text-green-600 font-medium">Message sent successfully!</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-600 font-medium">Failed to send message. Please try again.</p>
          )}
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#062963]">Contact Information</h2>
        <p className="mt-2 text-sm text-gray-500">
          Reach out through any of the channels below.
        </p>
        <div className="mt-6 space-y-6">
          {contactEmail && (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#062963]/10 text-[#062963]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#062963]">Email</h3>
                <a href={`mailto:${contactEmail}`} className="text-sm text-gray-600 hover:text-[#062963] transition-colors">{contactEmail}</a>
              </div>
            </div>
          )}
          {phone && (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#062963]/10 text-[#062963]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#062963]">Phone</h3>
                <a href={`tel:${phone}`} className="text-sm text-gray-600 hover:text-[#062963] transition-colors">{phone}</a>
              </div>
            </div>
          )}
          {address && (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#062963]/10 text-[#062963]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#062963]">Address</h3>
                <p className="text-sm text-gray-600">{address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

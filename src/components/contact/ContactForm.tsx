'use client'

import React, { useState, useCallback } from 'react'
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
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }, [name, email, subject, message])

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div>
        <h2 className="text-2xl font-bold text-primary-navy">Send us a message</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill out the form below and we&apos;ll get back to you as soon as possible.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-primary-navy">Name</Label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary-navy">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-primary-navy">Subject</Label>
            <Input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-primary-navy">Message</Label>
            <textarea
              id="message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
              placeholder="Your message"
            />
          </div>
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-button-gold hover:bg-button-gold-hover text-primary-navy font-semibold"
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
            <p className="text-sm text-destructive font-medium">Failed to send message. Please try again.</p>
          )}
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-primary-navy">Contact Information</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reach out through any of the channels below.
        </p>
        <div className="mt-6 space-y-6">
          {contactEmail && (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-navy/10 text-primary-navy">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-primary-navy">Email</h3>
                <a href={`mailto:${contactEmail}`} className="text-sm text-muted-foreground hover:text-primary-navy transition-colors">{contactEmail}</a>
              </div>
            </div>
          )}
          {phone && (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-navy/10 text-primary-navy">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-primary-navy">Phone</h3>
                <a href={`tel:${phone}`} className="text-sm text-muted-foreground hover:text-primary-navy transition-colors">{phone}</a>
              </div>
            </div>
          )}
          {address && (
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-navy/10 text-primary-navy">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-primary-navy">Address</h3>
                <p className="text-sm text-muted-foreground">{address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

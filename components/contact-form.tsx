'use client';

/**
 * Contact Form Component
 * 
 * Glassmorphism contact form with neon border animations and smooth submission
 * Requirements: 11.1, 11.2, 11.3, 11.4
 */

import { useState, useRef } from 'react';
import { useToast } from '@/lib/contexts/toast-context';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { showToast } = useToast();

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be 100 characters or less';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (formData.email.length > 255) {
        newErrors.email = 'Email must be 255 characters or less';
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.length > 2000) {
      newErrors.message = 'Message must be 2000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      // Success animation
      setIsSuccess(true);
      
      // Show success toast
      showToast('success', 'Message sent successfully! We\'ll get back to you soon.');

      // Reset form after animation
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          message: '',
        });
        setIsSuccess(false);
        onSuccess?.();
      }, 2000);

    } catch (error) {
      showToast(
        'error',
        error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Glassmorphism container */}
      <div className="relative backdrop-blur-xl bg-white/10 dark:bg-black/10 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
        
        {/* Form content */}
        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className={`relative z-10 p-8 space-y-6 transition-all duration-700 ${
            isSuccess ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Name field */}
          <div className="space-y-2">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-zinc-900 dark:text-white"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-zinc-300/50 dark:border-zinc-600/50'
                } bg-white/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)]`}
                placeholder="Your name"
                maxLength={100}
                disabled={isSubmitting}
              />
              {/* Neon border animation on focus */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm animate-pulse" />
              </div>
            </div>
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400 animate-fade-in">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-zinc-900 dark:text-white"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-zinc-300/50 dark:border-zinc-600/50'
                } bg-white/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)]`}
                placeholder="your.email@example.com"
                maxLength={255}
                disabled={isSubmitting}
              />
              {/* Neon border animation on focus */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm animate-pulse" />
              </div>
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400 animate-fade-in">
                {errors.email}
              </p>
            )}
          </div>

          {/* Message field */}
          <div className="space-y-2">
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-zinc-900 dark:text-white"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.message
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-zinc-300/50 dark:border-zinc-600/50'
                } bg-white/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)] resize-none`}
                placeholder="Tell us about your project or inquiry..."
                maxLength={2000}
                disabled={isSubmitting}
              />
              {/* Neon border animation on focus */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm animate-pulse" />
              </div>
            </div>
            {errors.message && (
              <p className="text-sm text-red-600 dark:text-red-400 animate-fade-in">
                {errors.message}
              </p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {formData.message.length}/2000 characters
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Button text */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Success animation overlay */}
        {isSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl z-20 animate-fade-in">
            <div className="text-center space-y-4 animate-scale-in">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  We'll get back to you soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Contact Page
 * 
 * Public contact page with animated contact form
 * Requirements: 11.1, 11.2, 11.3
 */

import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Have a project in mind? Let's talk about how we can work together.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            We typically respond within 24-48 hours
          </p>
        </div>
      </div>
    </div>
  );
}

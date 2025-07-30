'use client';
import React, { useState } from 'react';
import CopyLink from '../ui/links/CopyLink';
import SpotlightButton from '../ui/button/SpotlightButton';
import { SiLinkedin } from 'react-icons/si';

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubject('');
    setMessage('');
  };

  return (
    <section className="h-screen bg-neutral-900 overflow-hidden font-metropolis  px-44.5 flex flex-col pt-20 pb-4">
      {/* Main Content */}
      <div className="flex flex-1 flex-col w-full justify-center pb-8 max-w-3xl">
        {/* First Row - Title and Subtitle */}
        <div className="mb-8 flex items-center gap-8">
          <h1 className="text-pf-3xl md:text-6xl font-light text-neutral-100 mb-2">
            Contact me.
          </h1>
        </div>

        {/* Second Row - Form */}
        <div className="w-full">
          <h2 className="text-pf-lg font-semibold text-neutral-100 mb-4">
            Send me an email:
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject Input */}
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-3 bg-transparent border-2 border-neutral-300 placeholder:font-metropolis text-pf-base rounded-lg text-white placeholder-gray-300 focus:outline-none transition-colors"
            />

            {/* Message Textarea */}
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-3 bg-transparent text-pf-base border-2 border-neutral-300 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-gray-300 transition-colors resize-none"
            />
            <div className="flex gap-6 items-center">
              {/* Send Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative px-8 py-3 bg-white border-2 hover:cursor-pointer border-white text-black font-semibold rounded-lg overflow-hidden disabled:opacity-70"
              >
                {/* Background that slides down from top */}
                <div className="absolute inset-0 bg-black transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>

                <span
                  className={`relative z-10 transition-all duration-300 ${
                    isSubmitting ? 'scale-0' : 'scale-100'
                  } group-hover:text-white`}
                >
                  Send
                </span>
                {isSubmitting && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-5 h-5 border-2 border-black group-hover:border-white border-t-transparent rounded-full animate-spin transition-colors duration-300"></div>
                  </div>
                )}
              </button>
              {/* Email Button */}
              <CopyLink
                text="- linardsliepenieks@gmail.com"
                copyValue="linardsliepenieks@gmail.com"
              />
              <SpotlightButton
                icon={{
                  type: 'react-icons',
                  component: SiLinkedin,
                }}
                text="LinkedIn"
                size="md"
                hideText={true}
                onClick={() =>
                  window.open('https://www.linkedin.com/in/linards-liepenieks')
                }
              />
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full flex justify-center">
        <div className="text-neutral-500 font-light text-pf-xs">
          Copyright 2025 © Liepenieks
        </div>
      </footer>
    </section>
  );
};

export default ContactSection;

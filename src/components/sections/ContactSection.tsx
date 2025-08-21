'use client';
import React, { useState, useEffect } from 'react';
import CopyLink from '../ui/links/CopyLink';
import SpotlightButton from '../ui/button/SpotlightButton';
import { SiLinkedin } from 'react-icons/si';

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isXlScreen, setIsXlScreen] = useState(false);

  // Hook to detect xl breakpoint
  useEffect(() => {
    const checkScreenSize = () => {
      setIsXlScreen(window.innerWidth >= 1280); // xl breakpoint is 1280px
    };

    // Check initial size
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    <section className="flex flex-col w-full h-full bg-neutral-900 font-metropolis   mx-auto max-w-[3200px]">
      {/* Title Section */}
      <div className="mt-16 mx-8  lg:mx-16 mb-14 text-neutral-100  lg:mt-24 xl:mb-12">
        <div className="flex items-start gap-1 mt-8 flex-col lg:flex-row lg:gap-4 xl:mb-8 xl:mt-4 xl:mx-12">
          <h2 className="text-pf-2xl font-light font-metropolis md:text-pf-3xl xl:text-pf-4xl">
            Contact me!
          </h2>
          <div className="text-pf-sm font-light tracking-wider md:hidden">
            <CopyLink
              text="linardsliepenieks@gmail.com"
              copyValue="linardsliepenieks@gmail.com"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full px-8 pr-12 lg:px-16 xl:px-28">
        {/* First Row - Title and Subtitle */}

        {/* Second Row - Form */}
        <div className="w-full">
          <h2 className="text-pf-lg  font-medium text-neutral-100 mb-2 tracking-wide lg:text-pf-lg xl:text-pf-2xl xl:font-normal">
            Send <span className="hidden md:inline">me</span> an email:
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-2 md:space-y-4 max-w-xl xl:max-w-2xl"
          >
            {/* Subject Input */}
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-2 bg-transparent border-2 border-neutral-300 placeholder:font-metropolis text-pf-sm rounded-lg lg:text-pf-base text-neutral-100 placeholder-neutral-300 focus:outline-none transition-colors"
            />

            {/* Message Textarea */}
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-3 bg-transparent text-pf-sm border-2 border-neutral-300 rounded-lg text-white placeholder-gray-300 lg:text-pf-base focus:outline-none focus:border-neutral-300 transition-colors resize-none"
            />
            <div className="flex gap-6 items-center">
              {/* Send Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative px-4 py-2.5 bg-white border-2 hover:cursor-pointer border-white text-black font-semibold rounded-lg overflow-hidden disabled:opacity-70"
              >
                {/* Background that slides down from top */}
                <div className="absolute inset-0 bg-black transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>

                <span
                  className={`relative z-10 transition-all duration-300 text-pf-sm xl:text-pf-base ${
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
              <div className="hidden md:block text-pf-base xl:text-pf-lg">
                <CopyLink
                  text="- linardsliepenieks@gmail.com"
                  copyValue="linardsliepenieks@gmail.com"
                />
              </div>
              <SpotlightButton
                icon={{
                  type: 'react-icons',
                  component: SiLinkedin,
                }}
                text="LinkedIn"
                size={isXlScreen ? 'md' : 'sm'}
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
      <footer className="w-full flex justify-center absolute bottom-4">
        <div className="text-neutral-500 font-light text-pf-xs">
          Copyright 2025 © Liepenieks
        </div>
      </footer>
    </section>
  );
};

export default ContactSection;

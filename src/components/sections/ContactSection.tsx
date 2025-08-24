'use client';
import React, { useState, useEffect } from 'react';
import CopyLink from '../ui/links/CopyLink';
import SpotlightButton from '../ui/button/SpotlightButton';
import { SiLinkedin } from 'react-icons/si';
import ContactForm from '../forms/ContactForm';

const ContactSection = () => {
  const [isXlScreen, setIsXlScreen] = useState(false);

  // EmailJS configuration from environment variables
  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  // Hook to detect xl breakpoint
  useEffect(() => {
    const checkScreenSize = () => {
      setIsXlScreen(window.innerWidth >= 1280);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Handlers for form submission
  const handleFormSuccess = () => {
    console.log('Email sent successfully from ContactSection');
    // You can add additional success handling here if needed
  };

  const handleFormError = (error: Error) => {
    console.error('Email failed from ContactSection:', error);
    // You can add additional error handling here if needed
  };

  return (
    <section className="flex relative flex-col w-full h-full bg-neutral-900 font-metropolis mx-auto max-w-[3200px]">
      {/* Title Section */}
      <div className="mt-12 mx-8 lg:mx-16 mb-12 text-neutral-100 lg:mt-24 xl:mb-12">
        <div className="flex items-start gap-1 mt-8 flex-col lg:flex-row lg:gap-4 xl:mb-8 xl:mt-4 xl:mx-12">
          <h2 className="text-pf-2xl font-light font-metropolis md:text-pf-3xl xl:text-pf-4xl">
            Contact me!
          </h2>
          <div className="text-pf-base font-light tracking-wider md:hidden">
            <CopyLink
              text="linardsliepenieks@gmail.com"
              copyValue="linardsliepenieks@gmail.com"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full px-8 pr-12 lg:px-16 xl:px-28">
        {/* Contact Form with Action Buttons */}
        <ContactForm
          serviceId={EMAILJS_SERVICE_ID}
          templateId={EMAILJS_TEMPLATE_ID}
          publicKey={EMAILJS_PUBLIC_KEY}
          onSuccess={handleFormSuccess}
          onError={handleFormError}
          actionButtons={
            <>
              {/* Email Link */}
              <div className="hidden md:block text-pf-base xl:text-pf-lg">
                <CopyLink
                  text="- linardsliepenieks@gmail.com"
                  copyValue="linardsliepenieks@gmail.com"
                />
              </div>

              {/* LinkedIn Button */}
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
            </>
          }
        />
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

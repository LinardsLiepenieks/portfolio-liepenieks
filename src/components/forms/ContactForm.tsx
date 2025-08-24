// components/contact/ContactForm.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';

// Types
export interface FormData {
  email: string;
  subject: string;
  message: string;
}

export type SubmitStatus = 'idle' | 'success' | 'error';

interface UseEmailFormProps {
  serviceId: string;
  templateId: string;
  publicKey: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Custom hook for email form functionality
const useEmailForm = ({
  serviceId,
  templateId,
  publicKey,
  onSuccess,
  onError,
}: UseEmailFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');

  // Handle form field changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Validate environment variables
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration missing');
      }

      // Prepare template parameters
      const templateParams = {
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
      };

      // Send email via EmailJS
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log('Email sent successfully:', response.status, response.text);

      // Success - clear form and show success state
      setSubmitStatus('success');
      setFormData({
        email: '',
        subject: '',
        message: '',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
      onError?.(
        error instanceof Error ? error : new Error('Unknown error occurred')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      email: '',
      subject: '',
      message: '',
    });
    setSubmitStatus('idle');
  };

  return {
    formData,
    isSubmitting,
    submitStatus,
    handleInputChange,
    handleSubmit,
    resetForm,
    setSubmitStatus,
  };
};

// Component Props
interface ContactFormProps {
  serviceId: string;
  templateId: string;
  publicKey: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  actionButtons?: React.ReactNode;
}

const ContactForm: React.FC<ContactFormProps> = ({
  serviceId,
  templateId,
  publicKey,
  onSuccess,
  onError,
  actionButtons,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const {
    formData,
    isSubmitting,
    submitStatus,
    handleInputChange,
    handleSubmit,
    setSubmitStatus,
  } = useEmailForm({
    serviceId,
    templateId,
    publicKey,
    onSuccess: () => {
      onSuccess?.();
      // Show overlay first
      setShowSuccessOverlay(true);

      // Trigger animations after a brief delay to ensure DOM is ready
      setTimeout(() => {
        setIsSuccessVisible(true);
      }, 50);

      // Start hiding animation
      setTimeout(() => {
        setIsSuccessVisible(false);
      }, 2000);

      // Remove overlay after fade out completes
      setTimeout(() => {
        setShowSuccessOverlay(false);
        setSubmitStatus('idle');
      }, 3000);
    },
    onError,
  });

  // Prevent page scrolling when interacting with textarea (only if textarea has content)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleTextareaWheel = (e: WheelEvent) => {
      if (textarea.value.trim().length > 0) {
        e.stopPropagation();
      }
    };

    let isTouchingTextarea = false;

    const handleTextareaTouchStart = (e: TouchEvent) => {
      isTouchingTextarea = true;
    };

    const handleTextareaTouchMove = (e: TouchEvent) => {
      if (!isTouchingTextarea) return;
      if (textarea.value.trim().length > 0) {
        e.stopPropagation();
      }
    };

    const handleTextareaTouchEnd = () => {
      isTouchingTextarea = false;
    };

    const handleTextareaTouchCancel = () => {
      isTouchingTextarea = false;
    };

    textarea.addEventListener('wheel', handleTextareaWheel, { passive: false });
    textarea.addEventListener('touchstart', handleTextareaTouchStart, {
      passive: true,
    });
    textarea.addEventListener('touchmove', handleTextareaTouchMove, {
      passive: false,
    });
    textarea.addEventListener('touchend', handleTextareaTouchEnd, {
      passive: true,
    });
    textarea.addEventListener('touchcancel', handleTextareaTouchCancel, {
      passive: true,
    });

    return () => {
      textarea.removeEventListener('wheel', handleTextareaWheel);
      textarea.removeEventListener('touchstart', handleTextareaTouchStart);
      textarea.removeEventListener('touchmove', handleTextareaTouchMove);
      textarea.removeEventListener('touchend', handleTextareaTouchEnd);
      textarea.removeEventListener('touchcancel', handleTextareaTouchCancel);
    };
  }, []);

  // Get submit button text based on state
  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Send'; // Keep the text for spacing
    if (submitStatus === 'error') return 'Retry';
    return 'Send';
  };

  // Get submit button styling based on state
  const getSubmitButtonClass = () => {
    const baseClass =
      'group relative px-4 py-2.5 border-2 hover:cursor-pointer font-semibold rounded-lg overflow-hidden disabled:opacity-70 transition-all duration-300';

    if (submitStatus === 'error') {
      return `${baseClass} bg-red-500 border-red-500 text-white`;
    }
    return `${baseClass} bg-white border-white text-black`;
  };

  return (
    <>
      <div className="w-full">
        <h2 className="text-pf-lg font-medium text-neutral-100 mb-4 sm:mb-2 tracking-wide lg:text-pf-lg xl:text-pf-2xl xl:font-normal">
          Send <span className="hidden md:inline">me</span> an email:
        </h2>

        {/* Error Message Only */}
        {submitStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">
              ❌ Failed to send message. Please try again or email me directly.
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-2 md:space-y-4 max-w-xl xl:max-w-2xl"
        >
          {/* Email and Subject Inputs */}
          <div className="sm:flex-row gap-2 flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 mb-2 bg-transparent border-b-1 sm:border-2 sm:mb-0 sm:py-2 sm:rounded-lg border-neutral-300 placeholder:font-metropolis text-pf-sm lg:text-pf-base text-neutral-100 placeholder-neutral-300 focus:outline-none focus:border-neutral-200 transition-colors disabled:opacity-50"
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-transparent border-2 border-neutral-300 placeholder:font-metropolis text-pf-sm rounded-lg lg:text-pf-base text-neutral-100 placeholder-neutral-300 focus:outline-none focus:border-neutral-200 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Message Textarea */}
          <textarea
            ref={textareaRef}
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={6}
            disabled={isSubmitting}
            className="w-full px-4 py-3 scrollbar-dark bg-transparent text-pf-sm border-2 border-neutral-300 rounded-lg text-white placeholder-gray-300 lg:text-pf-base focus:outline-none focus:border-neutral-200 transition-colors resize-none disabled:opacity-50"
          />

          {/* Submit Button Row */}
          <div className="flex gap-6 items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={getSubmitButtonClass()}
            >
              {/* Background animation for normal state */}
              {submitStatus === 'idle' && (
                <div className="absolute inset-0 bg-black transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              )}

              <span
                className={`relative z-10 transition-all duration-300 text-pf-sm xl:text-pf-base ${
                  isSubmitting ? 'opacity-0' : 'opacity-100'
                } ${submitStatus === 'idle' ? 'group-hover:text-white' : ''}`}
              >
                {getSubmitButtonText()}
              </span>

              {/* Loading spinner */}
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>

            {/* Action Buttons */}
            {actionButtons}
          </div>
        </form>
      </div>

      {/* Success Overlay - Always mounted, controlled by isSuccessVisible */}
      {showSuccessOverlay && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-1000 ease-out ${
            isSuccessVisible
              ? 'bg-black/50 backdrop-blur-sm opacity-100 visible'
              : 'bg-black/0 backdrop-blur-none opacity-0 invisible'
          }`}
        >
          <div className="px-8 max-w-xl lg:max-w-2xl xl:max-w-4xl lg:bottom-4 w-full relative bottom-8 flex flex-col items-start">
            {/* First text with 100ms delay */}
            <div
              className={`text-emerald-600 text-pf-base md:text-pf-xl font-normal mb-2 text-left transition-all duration-400 ease-out lg:text-pf-2xl xl:text-pf-3xl ${
                isSuccessVisible
                  ? 'opacity-100 translate-y-0 delay-100'
                  : 'opacity-0 -translate-y-8'
              }`}
            >
              Message sent!
            </div>
            {/* Second text with 200ms delay */}
            <div
              className={`text-emerald-600 text-pf-lg md:text-pf-2xl font-normal text-left transition-all duration-400 ease-out lg:text-pf-3xl xl:text-pf-4xl ${
                isSuccessVisible
                  ? 'opacity-100 translate-y-0 delay-200'
                  : 'opacity-0 -translate-y-8'
              }`}
            >
              Talk to you soon!
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactForm;

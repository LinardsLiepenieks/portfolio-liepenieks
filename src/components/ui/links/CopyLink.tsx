import React, { useState } from 'react';

interface CopyLinkProps {
  text: string;
  copyValue: string;
  className?: string;
}

const CopyLink: React.FC<CopyLinkProps> = ({
  text,
  copyValue,
  className = '',
}) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(copyValue);
      } else {
        // Fallback method for older browsers or non-HTTPS
        const textArea = document.createElement('textarea');
        textArea.value = copyValue;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Still show the notification even if copy failed
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <span
        onClick={handleCopy}
        className={`antialiased text-neutral-100 font cursor-pointer font-metropolis hover-underline ${className}`}
      >
        {text}
      </span>

      {/* Copied notification - positioned below the element */}
      {showCopied && (
        <div className="antialiased absolute right-0 font-medium italic text-neutral-400 text-pf-sm animate-fade-in-out font-metropolis">
          Copied to clipboard
        </div>
      )}

      <style jsx>{`
        .hover-underline {
          position: relative;
        }

        .hover-underline::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0;
          height: 0.5px;
          background-color: #bcbcbcff;
          transition: width 0.3s ease-out;
          transform-origin: right;
        }

        .hover-underline:hover::after {
          width: 100%;
        }

        .animate-fade-in-out {
          animation: fadeInOut 2s ease-out forwards;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          15% {
            opacity: 1;
            transform: translateY(0px);
          }
          70% {
            opacity: 1;
            transform: translateY(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default CopyLink;

'use client';

import React, { useState, useEffect } from 'react';
import CosmicBallBackground from '../backgrounds/CosmicBallBackground';
import HoverFollowCard from '../ui/labels/HoverFollowCard';

interface HeroSectionProps {
  onNavigate?: (sectionIndex: number) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [currentTime, setCurrentTime] = useState<string>('--:--');
  const [isOnline, setIsOnline] = useState<boolean>(false);

  // Always start with default position to avoid hydration mismatch
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 80 });

  useEffect(() => {
    const updateBallPosition = () => {
      if (window.innerWidth >= 1280) {
        // xl breakpoint (1280px)
        setBallPosition({ x: 68, y: 42 });
      } else {
        setBallPosition({ x: 50, y: 80 });
      }
    };

    // Set correct position after mount
    updateBallPosition();

    // Listen for window resize
    window.addEventListener('resize', updateBallPosition);

    return () => {
      window.removeEventListener('resize', updateBallPosition);
    };
  }, []);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch(
          'https://worldtimeapi.org/api/timezone/Europe/Helsinki'
        );
        const data = await response.json();

        if (data.datetime) {
          const date = new Date(data.datetime);
          const timeString = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          setCurrentTime(timeString);

          // Check if current time is between 08:00 and 19:00
          const currentHour = date.getHours();
          setIsOnline(currentHour >= 8 && currentHour < 19);
        }
      } catch (error) {
        console.error('Failed to fetch time:', error);
        // Fallback to browser time in Helsinki timezone
        const fallbackDate = new Date();
        const fallbackTime = fallbackDate.toLocaleTimeString('en-US', {
          timeZone: 'Europe/Helsinki',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        setCurrentTime(fallbackTime);

        // Get Helsinki time for online status check
        const helsinkiTime = new Date(
          fallbackDate.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' })
        );
        const currentHour = helsinkiTime.getHours();
        setIsOnline(currentHour >= 8 && currentHour < 19);
      }
    };

    // Fetch time immediately
    fetchTime();

    // Update time every minute
    const interval = setInterval(fetchTime, 60000);

    return () => clearInterval(interval);
  }, []);

  // Handle navigation for the contact link (index 2 for contact in typical nav structure)
  const handleContactNavigation = (event: React.MouseEvent) => {
    // Prevent default link behavior for smooth scroll navigation
    event.preventDefault();

    // If onNavigate callback is provided, use scroll navigation
    if (onNavigate) {
      onNavigate(2); // Contact is typically index 2 (Start=0, About=1, Contact=2)
    } else {
      // Fallback to regular navigation if no callback provided
      window.location.href = '/contact';
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-900 font-metropolis   flex justify-center">
      {/* Background container for elements */}
      <div className="absolute -z-0 flex items-center justify-center w-full h-full">
        <CosmicBallBackground
          key={`${ballPosition.x}-${ballPosition.y}`}
          ballPosition={ballPosition}
        />
      </div>

      {/* Main Content Container */}
      <div className=" relative z-20  w-full px-8 lg:px-20 xl:px-32  h-full flex flex-col justify-between pt-16 max-w-[3200px]">
        <div className=" ">
          <div className=" flex flex-col gap-1 items-start pt-14">
            <HoverFollowCard
              maxMove={40}
              sensitivity={0.1}
              moveSpeed={1}
              returnSpeed={1.2}
            >
              <h1 className="text-pf-xl md:text-pf-2xl lg:text-pf-3xl xl:text-pf-5xl  bg-neutral-900 px-4 text-neutral-200">
                Linards
              </h1>
            </HoverFollowCard>
            <HoverFollowCard
              maxMove={40}
              sensitivity={0.1}
              moveSpeed={1}
              returnSpeed={1.2}
            >
              <h1 className="text-pf-xl md:text-pf-2xl lg:text-pf-3xl xl:text-pf-5xl bg-neutral-900 px-4 text-neutral-200">
                Liepenieks
              </h1>
            </HoverFollowCard>
          </div>
          <div className="flex flex-col gap-1 items-start  mt-4">
            <HoverFollowCard
              maxMove={40}
              sensitivity={0.1}
              moveSpeed={1}
              returnSpeed={1.2}
            >
              <h2 className="text-pf-base lg:text-pf-lg xl:text-pf-xl bg-neutral-900 px-4 text-neutral-200 ">
                Software engineer
              </h2>
            </HoverFollowCard>
            <HoverFollowCard
              maxMove={40}
              sensitivity={0.1}
              moveSpeed={1}
              returnSpeed={1.2}
            >
              <h2 className="text-pf-base lg:text-pf-lg xl:text-pf-xl bg-neutral-900 px-4 text-neutral-200">
                &
              </h2>
            </HoverFollowCard>
            <HoverFollowCard
              maxMove={40}
              sensitivity={0.1}
              moveSpeed={1}
              returnSpeed={1.2}
            >
              <h2 className="text-pf-base lg:text-pf-lg xl:text-pf-xl bg-neutral-900 px-4 text-neutral-200">
                Educator
              </h2>
            </HoverFollowCard>
          </div>
        </div>
        <div className="w-full mb-16 lg:mb-28 xl:mb-40 invisible sm:visible">
          <div className="font-metropolis text-pf-base  xl:text-pf-lg flex flex-col text-right gap-1 xl:pr-8">
            <h3 className="font-medium">Location: Finland, Turku 🇫🇮</h3>
            <span className="font-medium">Local time: {currentTime}</span>
            <div className="flex justify-end">
              <a
                href={onNavigate ? '#contact' : '/contact'}
                onClick={handleContactNavigation}
                className={`
                  relative   font-semibold text-pf-sm xl:text-pf-base font-metropolis
                  transition-all duration-200 ease-in-out
                  hover:cursor-pointer group
                  ${isOnline ? 'text-emerald-400' : 'text-red-400'}
                `}
              >
                {isOnline ? 'Currently online' : 'Back at 08:00'}
                {/* Underline that appears on hover */}
                <span
                  className={`
                    absolute bottom-0 h-px transition-all duration-300 ease-out
                    left-1/2 w-0 group-hover:w-[calc(100%)] group-hover:left-0
                    ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}
                  `}
                ></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

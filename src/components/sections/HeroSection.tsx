'use client';

import React from 'react';
import ThreeJSLogo from '../ThreeJSLogo';
import MovingLinesBackground from '../MovingLinesBackground';
import HoverFollowCard from '../ui/labels/HoverFollowCard';
import { usePathname } from 'next/navigation';

const HeroSection = () => {
  const pathname = usePathname();

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[linear-gradient(135deg,#7F0C0C_0%,#A40000_49%,#761B1B_100%)] flex justify-center ">
      {/* Background container for elements */}
      <div className="absolute inset-0 flex items-center justify-center py-16 w-full h-full">
        <MovingLinesBackground
          lineCount={25}
          opacity={0.2}
          className="z-0 w-full h-full"
        />

        {/* LOGO */}
        <div className="h-full relative top-0 md:top-8 flex items-center justify-center md:opacity-40 z-10">
          <ThreeJSLogo
            sizes={{
              sm: 360, // Small on mobile
              md: 800, // Medium on tablet
              lg: 800, // Large on desktop
              xl: 800, // Extra large on big screens
            }}
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex flex-col pt-16 sm:pt-32 w-full  items-center justify-center  ">
        <div className="px-4  lg:px-12  sm:mx-12 flex flex-col flex-1   gap-10 w-full max-w-[2000px]  3xl:justify-center  ">
          <div className=" w-full  flex-1 pb-32 h-full md:gap-8 sm:flex sm:flex-col  justify-center">
            <div className="sm:flex sm:pt-16 lg:pt-0  flex flex-col lg:flex-row  ">
              {/* Left Side */}
              <div className="flex flex-col lg:px-14  justify-center ">
                <ul className="flex flex-col gap-2 sm:gap-6 font-metropolis text-pf-xl sm:text-pf-3xl lg:text-pf-5xl sm:flex-row lg:flex-col font-medium mt-6 md:mt-16 sm:m-0  ">
                  <li>
                    <HoverFollowCard
                      maxMove={4}
                      sensitivity={0.035}
                      moveSpeed={0.35}
                    >
                      <span className="bg-neutral-900 text-stone-100 px-2 py-2 drop-shadow-sharp-card">
                        Linards
                      </span>
                    </HoverFollowCard>
                  </li>
                  <li>
                    <HoverFollowCard
                      maxMove={4}
                      sensitivity={0.035}
                      moveSpeed={0.35}
                    >
                      <span className="bg-neutral-900 text-stone-100 px-2 py-2 drop-shadow-sharp-card">
                        Liepenieks
                      </span>
                    </HoverFollowCard>
                  </li>
                </ul>
              </div>

              {/* Right Side */}
              <div className="flex flex-1 flex-col justify-center sm:px-0  relative pt-2 lg:top-24  ">
                <ul className="flex md:flex-col lg:text-right text-neutral-100 italic gap-1 lg:gap-2 text-pf-xs md:text-pf-xl sm:text-pf-lg lg:text-pf-3xl">
                  <li className="font-metropolis font-medium  ">
                    <span className="md:px-2 py-2 sm:drop-shadow-sharp-card">
                      Developer.
                    </span>
                  </li>
                  <li className="font-metropolis font-medium  ">
                    <span className="md:px-2 py-2 sm:drop-shadow-sharp-card">
                      Entrepreneur.
                    </span>
                  </li>
                  <li className="font-metropolis font-medium  ">
                    <span className="md:px-2 py-2 sm:drop-shadow-sharp-card  ">
                      Technology educator.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full flex justify-between lg:items-center flex-col h-full sm:h-auto  gap-4 sm:flex-col sm:pb-4 md:gap-8 md:px-4 lg:flex-row ">
              <ul className="flex flex-col gap-2 sm:text-pf-lg lg:text-pf-xl text-pf-base text-stone-200 flex-1 justify-end lg:px-16">
                <li className="font-metropolis">Location: Finland, Turku</li>
                <li className="font-metropolis">Local time: 00:00</li>
                <li className="font-metropolis my-1">
                  <span className="px-4 py-2 bg-neutral-900 text-stone-100 font-medium drop-shadow-sharp-card cursor-pointer hover:bg-neutral-800 hover:scale-105 transition-all duration-300 border-l-2 border-emerald-500">
                    Currently online
                  </span>
                </li>
              </ul>
              <HoverFollowCard
                maxMove={5}
                sensitivity={0.04}
                moveSpeed={0.4}
                className="max-w-[640px]   p-3 bg-neutral-900 text-stone-100 drop-shadow-sharp-card -mx-4 md:mx-0 lg:m-4"
              >
                <span className="text-pf-base font-metropolis text-pf-sm sm:text-pf-lg">
                  Finding beauty in elegant solutions and solving real world
                  problems - tech should{' '}
                  <span className="underline italic">be effortless</span>.
                </span>
              </HoverFollowCard>
            </div>
          </div>
        </div>
        {/* Black Bottom Row */}
        <div className="h-16 bg-neutral-900 w-full flex-shrink-0">
          {/* You can add content here if needed */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

'use client';

import React from 'react';
import ThreeJSLogo from '../ThreeJSLogo';
import MovingLinesBackground from '../MovingLinesBackground';
import HoverFollowCard from '../ui/labels/HoverFollowCard';
import { usePathname } from 'next/navigation';

const HeroSection = () => {
  const pathname = usePathname();

  return (
    <section className="relative h-screen bg-red-600 overflow-hidden bg-[linear-gradient(135deg,#7F0C0C_0%,#A40000_49%,#761B1B_100%)] flex justify-center">
      {/* Background container for elements */}
      <div className="absolute inset-0 flex items-center justify-center py-16">
        <MovingLinesBackground
          lineCount={25}
          opacity={0.2}
          className="z-0 w-full h-full"
        />

        {/* LOGO */}
        <div className="h-4/5 w-full flex justify-center items-center aspect-square opacity-90">
          <ThreeJSLogo />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex px-8 py-16 max-w-[1800px] w-full justify-center">
        {/* Left Side */}
        <div className="flex-1 flex flex-col gap-36 lg:px-14 lg:py-24">
          <ul className="flex flex-col gap-6 font-metropolis text-pf-5xl font-medium">
            <li>
              <HoverFollowCard maxMove={4} sensitivity={0.035} moveSpeed={0.35}>
                <span className="bg-neutral-800 text-stone-100 px-2 py-2 drop-shadow-sharp-card">
                  Linards
                </span>
              </HoverFollowCard>
            </li>
            <li>
              <HoverFollowCard maxMove={4} sensitivity={0.035} moveSpeed={0.35}>
                <span className="bg-neutral-800 text-stone-100 px-2 py-2 drop-shadow-sharp-card">
                  Liepenieks
                </span>
              </HoverFollowCard>
            </li>
          </ul>
          <div>
            <ul className="flex flex-col gap-2 text-pf-lg text-stone-200">
              <li className="font-metropolis">Location: Finland, Turku</li>
              <li className="font-metropolis">Local time: 00:00</li>
              <li className="font-metropolis my-1">
                <span className="px-4 py-2 bg-neutral-800 text-stone-100 font-medium drop-shadow-sharp-card cursor-pointer hover:bg-neutral-700 hover:scale-105 transition-all duration-300 border-l-2 border-emerald-500">
                  Currently online
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col items-end gap-20 px-4 justify-between py-[12%] pt-[13.6%] ">
          <ul className="flex flex-col text-right gap-6">
            <li className="font-metropolis font-medium text-pf-3xl">
              <span className=" text-stone-100 px-2 py-2 drop-shadow-sharp-card">
                Developer.
              </span>
            </li>
            <li className="font-metropolis font-medium text-pf-3xl">
              <span className=" text-stone-100 px-2 py-2 drop-shadow-sharp-card">
                Entrepreneur.
              </span>
            </li>
            <li className="font-metropolis font-medium text-pf-3xl">
              <span className="text-stone-100 px-2 py-2 drop-shadow-sharp-card">
                Technology educator.
              </span>
            </li>
          </ul>
          <HoverFollowCard
            maxMove={5}
            sensitivity={0.04}
            moveSpeed={0.4}
            className="max-w-[640px] p-3 bg-neutral-800 text-stone-100 drop-shadow-sharp-card"
          >
            <span className="text-pf-base font-metropolis text-pf-lg">
              Finding beauty in elegant solutions and solving real world
              problems - tech should{' '}
              <span className="underline italic">be effortless</span>.
            </span>
          </HoverFollowCard>
        </div>
      </div>

      {/* Black Bottom Row */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-neutral-800 z-20">
        {/* You can add content here if needed */}
      </div>
    </section>
  );
};

export default HeroSection;

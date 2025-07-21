import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative h-screen bg-red-600 overflow-hidden bg-[linear-gradient(135deg,#7F0C0C_0%,#A40000_49%,#761B1B_100%)]">
      {/* Background container for elements */}
      <div className="absolute inset-0 flex items-center justify-center py-16">
        {/*LOGOL*/}
        <div className="bg-blue-500 h-4/5 aspect-square">D</div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex px-8 py-16">
        {/* Left Side */}
        <div className="flex-1 flex flex-col justify-between lg:px-14  lg:py-20">
          <div className="flex flex-col gap-6">
            <div>
              <span className="font-metropolis font-medium text-pf-4xl bg-black px-2 py-2">
                Linards
              </span>
            </div>
            <div>
              <span className="font-metropolis font-medium text-pf-4xl bg-black px-2 py-2">
                Liepenieks
              </span>
            </div>
          </div>
          <div>
            <ul className="flex flex-col gap-1">
              <li className="font-metropolis text-pf-base">
                Location: Finland, Turku
              </li>
              <li className="font-metropolis text-pf-base">
                Local time: 00:00
              </li>
              <li className="font-metropolis text-pf-base">Currently online</li>
            </ul>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col items-end  gap-16 justify-center px-4">
          <ul className="flex flex-col text-right gap-4">
            <li className="font-metropolis font-medium text-pf-xl   inline">
              <span className="bg-black px-2 py-2"> Developer.</span>
            </li>
            <li className="font-metropolis font-medium text-pf-xl  inline">
              <span className="bg-black px-2 py-2"> Enterpreneur.</span>
            </li>
            <li className="font-metropolis font-medium text-pf-xl bg-black  inline">
              <span className="bg-black px-2 py-2"> Technology educator.</span>
            </li>
          </ul>
          <div className="max-w-[350px] p-2 bg-black">
            <span className="text-pf-base font-metropolis">
              Finding beauty in elegant solutions and solving real world
              problems - tech should be effortless.
            </span>
          </div>
        </div>
      </div>

      {/* Black Bottom Row */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-900 z-20">
        {/* You can add content here if needed */}
      </div>
    </section>
  );
};

export default HeroSection;

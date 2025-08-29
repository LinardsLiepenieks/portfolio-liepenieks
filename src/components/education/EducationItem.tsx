import Image from 'next/image';
import { EducationComponentProps } from '@/types/EducationItemType';

export default function EducationItem({
  id,
  name,
  nameShort,
  degree,
  specialty,
  period,
  descriptionShort,
  logoUrl,
  diplomaUrl,
  className,
  onClick,
  onSelect,
  onDeselect,
}: EducationComponentProps) {
  const handleClick = () => {
    onClick?.();
    onSelect?.();
  };

  const handleMouseLeave = () => {
    onDeselect?.();
  };

  return (
    <div
      className={` font-metropolis  group inline-block max-w-[1600px]  ${
        className || ''
      }`}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-6  ">
        <div className="flex-shrink-0  flex items-center overflow-visible">
          <div className="w-60 h-60   relative overflow-visible rounded-lg flex items-center justify-center group-hover:drop-shadow-2xl transition-all duration-300 ">
            {logoUrl ? (
              <div className=" w-full h-full relative group-hover:drop-shadow-lg transition-all duration-400   scale-90 opacity-90 group-hover:scale-100 group-hover:opacity-100">
                <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  fill
                  className="object-cover"
                />
                {/* Shine overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity duration-800 z-10 pointer-events-none"
                  style={{
                    mask: `url(${logoUrl})`,
                    WebkitMask: `url(${logoUrl})`,
                    maskSize: 'cover',
                    WebkitMaskSize: 'cover',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                  }}
                >
                  <div className="absolute opacity-50 inset-0 bg-gradient-to-r from-white/10 via-white/40 to-white/10 transform -skew-x-24 -translate-x-full group-hover:translate-x-full transition-transform duration-800 ease" />
                </div>
                {/* Animated radial glow effect - contained within bounds */}
                <div className="absolute inset-1 bg-gradient-radial from-blue-500/20 via-blue-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
              </div>
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs relative overflow-hidden group-hover:drop-shadow-lg transition-all duration-300">
                {nameShort || name?.charAt(0) || 'EDU'}
                {/* Shine overlay for fallback */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-200 ease-out" />
                </div>
                {/* Animated radial glow for fallback - contained within bounds */}
                <div className="absolute inset-1 bg-gradient-radial from-neutral-500/20 via-neutral-500/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              </div>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-grow min-w-0 flex flex-col justify-center flex flex-col gap-2">
          {/* Institution Name */}
          <h3 className="text-pf-xl italic font-medium text-neutral-200 group-hover:text-white transition-colors duration-300">
            {name}
          </h3>

          {/* Degree, Specialty and Time Row */}
          <div className="flex justify-center  relative px-2 transform-gpu flex-col -mt-1 gap-1">
            <p className="text-pf-sm font-semibold text-neutral-300 group-hover:text-neutral-100 transition-colors duration-300">
              {degree}
              {specialty && (
                <span className="text-neutral-300 ml-2 group-hover:text-neutral-200 transition-colors duration-300">
                  • {specialty}
                </span>
              )}
            </p>
            <p className="text-pf-sm font-semibold text-neutral-200 group-hover:text-neutral-100 transition-colors duration-300">
              {period}
            </p>
          </div>

          {/* Description */}
          {descriptionShort && (
            <div className="px-2 -mt-1.5">
              <p className="text-pf-sm text-neutral-300 group-hover:text-neutral-200 transition-colors duration-200 font-medium">
                {descriptionShort}
              </p>
            </div>
          )}
        </div>

        {/* Optional diploma link indicator */}
        {diplomaUrl && (
          <div className="flex-shrink-0 flex items-center">
            <div className="w-6 h-6 rounded-full bg-neutral-700 group-hover:bg-neutral-600 transition-colors duration-200 flex items-center justify-center">
              <span className="text-xs text-neutral-300">📜</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import Image from 'next/image';
import { EducationComponentProps } from '@/types/EducationItemType';

export default function EducationItem({
  id,
  name,
  nameShort,
  degree,
  specialty,
  period,
  startYear,
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
      className={`mx-auto font-metropolis p-3 my-1 group inline-block max-w-[1600px]  ${
        className || ''
      }`}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-6 p-2  ">
        <div className="flex-shrink-0">
          <div className="w-60 h-60 relative overflow-hidden rounded-lg flex items-center justify-center group-hover:drop-shadow-2xl transition-all duration-500 ease-out">
            {logoUrl ? (
              <div className="w-full h-full relative group-hover:drop-shadow-lg transition-all duration-450 ease scale-90 opacity-90 group-hover:scale-100 group-hover:opacity-100">
                <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  fill
                  className="object-cover"
                />
                {/* Shine overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/40 to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                </div>
                {/* Animated glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
              </div>
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs relative overflow-hidden group-hover:drop-shadow-lg transition-all duration-300">
                {nameShort || name?.charAt(0) || 'EDU'}
                {/* Shine overlay for fallback */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                </div>
                {/* Animated glow for fallback */}
                <div className="absolute -inset-2 bg-gradient-to-r from-neutral-500/0 via-neutral-500/20 to-neutral-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
              </div>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-grow min-w-0 flex flex-col justify-center flex flex-col gap-2">
          {/* Institution Name */}
          <h3 className="text-pf-xl italic font-medium text-neutral-200 group-hover:text-neutral-100 transition-colors duration-200">
            {name}
          </h3>

          {/* Degree, Specialty and Time Row */}
          <div className="flex justify-center  relative px-2 transform-gpu flex-col -mt-1 gap-1">
            <p className="text-pf-sm font-semibold text-neutral-300 group-hover:text-neutral-100 transition-colors duration-200">
              {degree}
              {specialty && (
                <span className="text-neutral-400 ml-2 group-hover:text-neutral-200 transition-colors duration-200">
                  • {specialty}
                </span>
              )}
            </p>
            <p className="text-pf-sm font-semibold text-neutral-300 group-hover:text-neutral-100 transition-colors duration-200">
              {period}
            </p>
          </div>

          {/* Description */}
          {descriptionShort && (
            <div className="px-2 -mt-1.5">
              <p className="text-pf-sm text-neutral-400 group-hover:text-neutral-300 transition-colors duration-200 font-medium">
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

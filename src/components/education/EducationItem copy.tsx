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
      className={`mx-auto font-metropolis p-3 my-1 group cursor-pointer inline-block ${
        className || ''
      }`}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-6 p-2 will-change-transform group-hover:scale-108 transition-all duration-300 origin-left transform translate3d(0,0,0) backface-visibility-hidden ease-out">
        <div className="flex-shrink-0">
          <div className="w-30 h-30 relative overflow-hidden rounded-lg flex items-center justify-center border border-solid border-gray-600 group-hover:rotate-[-8deg] transition-transform duration-300 ease-out">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs">
                {nameShort || name?.charAt(0) || 'EDU'}
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
          <div className="flex items-center gap-4 relative px-2 transform-gpu">
            <p className="text-pf-sm font-semibold text-neutral-200 group-hover:text-neutral-100 transition-colors duration-200">
              {degree}
              {specialty && (
                <span className="text-neutral-400 ml-2">• {specialty}</span>
              )}
            </p>
            <p className="text-pf-sm font-semibold text-neutral-200 group-hover:text-neutral-100 transition-colors duration-200">
              {period}
            </p>
          </div>

          {/* Description */}
          {descriptionShort && (
            <div className="px-2">
              <p className="text-pf-xs text-neutral-400 group-hover:text-neutral-300 transition-colors duration-200">
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

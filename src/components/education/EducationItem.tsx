import Image from 'next/image';

interface EducationItemProps {
  image?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  time?: string;
}

export default function EducationItem({
  image,
  imageAlt = 'Education institution',
  title = 'Turku University of Applied Sciences',
  description = 'Bachelor of Engineering',
  time = '2021-Present',
}: EducationItemProps) {
  return (
    <div className="mx-auto font-metropolis p-3 my-1 group cursor-pointer inline-block">
      <div className="flex gap-6 p-2 will-change-transform group-hover:scale-108 transition-all duration-300 origin-left transform translate3d(0,0,0) backface-visibility-hidden ease-out">
        <div className="flex-shrink-0">
          <div className="w-30 h-30 relative overflow-hidden rounded-lg flex items-center justify-center border border-solid border-gray-600 group-hover:rotate-[-8deg] transition-transform duration-300 ease-out">
            {image ? (
              <Image src={image} alt={imageAlt} fill className="object-cover" />
            ) : (
              ''
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-grow min-w-0 flex flex-col justify-center flex flex-col gap-2">
          {/* Title */}
          <h3 className="text-pf-xl italic font-medium text-neutral-200 group-hover:text-neutral-100 transition-colors duration-200">
            {title}
          </h3>

          {/* Description and Time Row */}
          <div className="flex items-center gap-4 relative px-2 transform-gpu">
            <p className="text-pf-sm font-semibold text-neutral-200 group-hover:text-neutral-100 transition-colors duration-200">
              {description}
            </p>
            <p className="text-pf-sm font-semibold text-neutral-200 group-hover:text-neutral-100 transition-colors duration-200">
              {time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example usage with defaults (no props needed for testing):
/*
<EducationItem />

// Or with custom values:
<EducationItem
  image="/path-to-university-logo.jpg"
  imageAlt="Turku University of Applied Sciences"
  title="Master of Computer Science"
  description="Specializing in AI and Machine Learning"
  time="2023-2025"
/>
*/

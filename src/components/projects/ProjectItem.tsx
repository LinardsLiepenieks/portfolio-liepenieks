import Image from 'next/image';

interface CategoryType {
  id: number;
  name: string;
}

interface ProjectItemProps {
  title: string;
  year: string;
  backgroundImage?: string;
  backgroundColor?: string;
  content?: React.ReactNode;
  categories?: CategoryType[]; // Changed from categoryName to categories array
  onClick?: () => void;
}

export default function ProjectItem({
  title,
  year,
  backgroundImage,
  content,
  categories,
  onClick,
}: ProjectItemProps) {
  return (
    <div
      className="
        2xl:max-w-96 w-full sm:w-96 sm:h-96 md:w-100 md:h-100 xl:w-72 xl:h-48 2xl:w-96 2xl:h-80 aspect-square
        border-neutral-500 border-4 relative group hover:cursor-pointer
        bg-neutral-900 shadow-inner
      "
      onClick={onClick}
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover brightness-90 saturate-90 antialiased shadow-inner "
        />
      )}

      {content && (
        <div className="absolute inset-0 p-4 text-black">{content}</div>
      )}

      {/* Background overlay */}
      <div className="absolute top-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-350 ease-in-out  bg-neutral-900/60 backdrop-blur-sm z-10"></div>

      {/* Text content */}
      <div className="absolute top-0 w-full h-full flex flex-col items-center justify-center gap-4 pointer-events-none font-metropolis z-10">
        <h4 className="text-pf-2xl  opacity-0 group-hover:opacity-100 transition-all duration-350 ease-in-out text-neutral-300 group-hover:text-neutral-100 font-medium">
          {year}
        </h4>
      </div>

      {/* Category tags - Multiple categories support */}
      {categories && categories.length > 0 && (
        <div className="absolute top-3 left-3 flex gap-2 z-20">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-neutral-900/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-neutral-300 uppercase tracking-wide border border-neutral-600"
            >
              {category.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

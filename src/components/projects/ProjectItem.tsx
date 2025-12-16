import Image from 'next/image';

interface ProjectItemProps {
  title: string;
  year: string;
  backgroundImage?: string;
  backgroundColor?: string;
  content?: React.ReactNode;
  categoryName?: string;
  onClick?: () => void;
}

export default function ProjectItem({
  title,
  year,
  backgroundImage,
  content,
  categoryName,
  onClick,
}: ProjectItemProps) {
  return (
    <div
      className="
        w-full max-w-80 md:w-80 md:h-80 aspect-square
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

      {/* Category tag */}
      {categoryName && (
        <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-neutral-300 uppercase tracking-wide border border-neutral-600 z-20">
          {categoryName}
        </div>
      )}
    </div>
  );
}

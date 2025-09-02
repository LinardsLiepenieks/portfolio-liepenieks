import Image from 'next/image';

interface ProjectItemProps {
  title: string;
  year: string;
  backgroundImage?: string;
  backgroundColor?: string;
  content?: React.ReactNode;
  onClick?: () => void;
}

export default function ProjectItem({
  title,
  year,
  backgroundImage,
  backgroundColor = '#A9ABAC',
  content,
  onClick,
}: ProjectItemProps) {
  return (
    <div
      className="w-80 h-80 border-white border-4 relative group hover:cursor-pointer"
      style={{ backgroundColor }}
      onClick={onClick}
    >
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
        />
      )}

      {content && (
        <div className="absolute inset-0 p-4 text-black">{content}</div>
      )}

      <div className="absolute top-0 w-full h-full opacity-0 group-hover:opacity-100 transition-all duration-350 ease-in-out bg-gray-400/0 backdrop-blur-xs flex flex-col items-center justify-center gap-4">
        <h3 className="text-pf-lg scale-80 group-hover:scale-100 transition-all duration-350 ease-in-out text-neutral-200 group-hover:text-white font-medium italic">
          {title}
        </h3>
        <h4 className="text-pf-lg scale-80 group-hover:scale-100 transition-all duration-350 ease-in-out text-neutral-300 group-hover:text-neutral-100 font-semibold">
          {year}
        </h4>
      </div>
    </div>
  );
}

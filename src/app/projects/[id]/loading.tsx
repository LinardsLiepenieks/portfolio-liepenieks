import ContentNavbar from '@/components/ui/ContentNavbar';

export default function ProjectDetailLoading() {
  return (
    <section className="flex flex-col w-full h-screen bg-neutral-900 font-metropolis">
      <ContentNavbar customReturnRoute="/projects" />
      <div className="flex flex-col items-center justify-center flex-1 text-neutral-300">
        <h2 className="text-2xl">Loading project details...</h2>
      </div>
    </section>
  );
}

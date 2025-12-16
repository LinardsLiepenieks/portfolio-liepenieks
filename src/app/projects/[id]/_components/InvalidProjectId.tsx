'use client';

import { useRouter } from 'next/navigation';
import { IoChevronBack } from 'react-icons/io5';
import ContentNavbar from '@/components/ui/ContentNavbar';

export default function InvalidProjectId() {
  const router = useRouter();

  return (
    <section className="flex flex-col w-full h-screen bg-neutral-900 font-metropolis pt-8">
      <ContentNavbar customReturnRoute="/projects" />
      <div className="flex flex-col items-center justify-center flex-1 text-neutral-300">
        <h2 className="text-2xl mb-4">Invalid project ID</h2>
        <button
          onClick={() => router.push('/projects')}
          className="flex items-center gap-2 text-neutral-300 hover:text-white"
        >
          <IoChevronBack size={20} />
          Back to Projects
        </button>
      </div>
    </section>
  );
}

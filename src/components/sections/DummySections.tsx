'use client';
import { useRouter } from 'next/navigation';

// Section 1 - Red
export function Section1() {
  return (
    <section className="h-screen w-full bg-red-500 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Section 1</h1>
        <p className="text-xl">Red Section</p>
      </div>
    </section>
  );
}

// In your Section2 component
export function Section2() {
  const router = useRouter();

  const handleOpenDetails = () => {
    // Use Next.js router for client-side navigation
    router.push('/experience?returnTo=1');
  };

  return (
    <section className="h-screen w-full bg-blue-500 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Section 2</h1>
        <p className="text-xl">Blue Section</p>
        <button
          onClick={handleOpenDetails}
          className="mt-4 px-6 py-3 bg-white text-blue-500 rounded-lg font-semibold hover:bg-gray-100"
        >
          Open Details
        </button>
      </div>
    </section>
  );
}
// Section 3 - Green
export function Section3() {
  return (
    <section className="h-screen w-full bg-green-500 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Section 3</h1>
        <p className="text-xl">Green Section</p>
      </div>
    </section>
  );
}

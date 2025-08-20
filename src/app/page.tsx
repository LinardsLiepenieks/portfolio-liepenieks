import { Suspense } from 'react';
import Portfolio from '@/components/Portfolio';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading Portfolio..." />}>
      <Portfolio />
    </Suspense>
  );
}

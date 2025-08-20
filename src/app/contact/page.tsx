import { Suspense } from 'react';
import Portfolio from '@/components/Portfolio';

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Portfolio />
    </Suspense>
  );
}

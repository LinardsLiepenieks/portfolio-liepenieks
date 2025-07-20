import './globals.css';
import localFont from 'next/font/local';
import LoadingScreen from '@/components/LoadingScreen';
import { LoadingProvider } from '@/contexts/LoadingProvider';

const metropolis = localFont({
  src: [
    {
      path: '../../public/fonts/Metropolis-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Metropolis-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Metropolis-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-metropolis',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={metropolis.variable}>
      <body suppressHydrationWarning={true}>
        <LoadingProvider>
          <LoadingScreen message="Loading..." />
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}

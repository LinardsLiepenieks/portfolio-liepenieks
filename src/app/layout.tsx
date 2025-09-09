import './globals.css';
import localFont from 'next/font/local';
import LoadingScreen from '@/components/LoadingScreen';
import { LoadingProvider } from '@/contexts/LoadingProvider';

const metropolis = localFont({
  src: [
    {
      path: '../../public/fonts/Metropolis-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Metropolis-ExtraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Metropolis-Light.woff2',
      weight: '300',
      style: 'normal',
    },
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
      path: '../../public/fonts/Metropolis-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Metropolis-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Metropolis-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Metropolis-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-metropolis',
  display: 'swap',
  preload: true,
  fallback: [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'sans-serif',
  ],
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

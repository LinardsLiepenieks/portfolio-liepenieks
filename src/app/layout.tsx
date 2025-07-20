import './globals.css';
import LoadingScreen from '@/components/LoadingScreen';
import { LoadingProvider } from '@/contexts/LoadingProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {' '}
        <LoadingProvider>
          {/* Loading screen will show on all navigation */}
          <LoadingScreen message="Loading..." />

          {/* Your app content */}
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}

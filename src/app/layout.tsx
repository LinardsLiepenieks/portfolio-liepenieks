import { LoadingProvider } from '@/contexts/LoadingContext';
import LoadingScreen from '@/components/LoadingScreen';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <LoadingProvider>
          <LoadingScreen />
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}

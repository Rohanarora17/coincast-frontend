import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { Providers } from "~~/components/Providers";
import "~~/styles/globals.css";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Token Reward Splitter',
  description: 'Split your token rewards automatically',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Override alert to prevent SDK from showing alerts
  if (typeof window !== 'undefined') {
    const originalAlert = window.alert;
    window.alert = function(message) {
      // Only show alerts that aren't from the SDK
      if (!message.includes('Campaign created successfully')) {
        originalAlert(message);
      }
    };
  }

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <ThemeProvider>
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

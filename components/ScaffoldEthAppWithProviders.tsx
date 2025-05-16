"use client";

import { useEffect, useState } from "react";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider, Config } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const queryClient = new QueryClient();

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="relative flex flex-col flex-1">
          {children}
        </main>
      </div>
      <Toaster />
      <style jsx global>{`
        .btn-ghost {
          color: #000000 !important;
        }
        .btn-ghost span {
          color: #000000 !important;
          font-weight: 500 !important;
        }
      `}</style>
    </>
  );
};

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig as unknown as Config}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar height="3px" color="#2299dd" />
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={lightTheme({
            accentColor: '#000000',
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="compact"
        >
          <ScaffoldEthApp>{children}</ScaffoldEthApp>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

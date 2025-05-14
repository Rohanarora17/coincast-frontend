import { http } from 'viem'; // Import http
import { base } from 'viem/chains';
import { defaultWagmiConfig, createWeb3Modal } from '@web3modal/wagmi/react';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set in .env');
}

const metadata = {
  name: 'zora-coin',
  description: 'zora-coin dapp',
  url: 'https://zora-coin.vercel.app',
  icons: ['https://zora-coin.vercel.app/icon.png'],
};

const chains = [base] as const;

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true, // Enable server-side rendering
  transports: {
    [base.id]: http(), // Use public Base RPC or custom URL
  },
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
});

// Initialize Web3Modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  defaultChain: base,
  themeMode: 'dark',
});
import { http } from 'viem'; // Import http
import { base, baseSepolia } from 'viem/chains';
import { defaultWagmiConfig, createWeb3Modal } from '@web3modal/wagmi';

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

// Define the chains we want to support
// Using type assertion to work around version mismatch
const chains = [base, baseSepolia] as any;

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true, // Enable server-side rendering
  transports: {
    [base.id]: http() as any,
    [baseSepolia.id]: http() as any,
  },
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
});

// Initialize Web3Modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  // Only include properties that are actually supported by the library
  defaultChain: base as any,
  themeMode: 'dark',
});
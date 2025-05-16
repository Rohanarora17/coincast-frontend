import { defaultWagmiConfig } from '@web3modal/wagmi/react'
import { base, baseSepolia } from "viem/chains";
import type { Chain } from 'viem';

// Use 'any' type to work around version mismatch
const targetNetworks = [base, baseSepolia] as any;

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";

const metadata = {
  name: 'zora-coin',
  description: 'zora-coin dapp',
  url: 'https://zora-coin.vercel.app',
  icons: ['https://zora-coin.vercel.app/icon.png']
}

const wagmiConnectors = defaultWagmiConfig({ 
  chains: targetNetworks, 
  projectId,
  metadata
})

export { wagmiConnectors }; 
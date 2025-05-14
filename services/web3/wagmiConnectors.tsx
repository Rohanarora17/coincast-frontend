import { defaultWagmiConfig } from '@web3modal/wagmi/react'
import { base } from "viem/chains";
import type { Chain } from 'viem';

const targetNetworks = [base] as [Chain, ...Chain[]];

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
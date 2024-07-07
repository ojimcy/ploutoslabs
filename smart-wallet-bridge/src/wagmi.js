import { http, createConfig } from 'wagmi'
import { base, sepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, sepolia],
  connectors: [
    coinbaseWallet(),
  ],
  transports: {
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})

import { PropsWithChildren } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "~~/node_modules/viem/_types/chains";
import { useAccount } from "~~/node_modules/wagmi/dist/types/exports";

export const OnchainKitScaffoldProvider = ({ children }: PropsWithChildren) => {
  const { chain } = useAccount();

  return (
    <OnchainKitProvider chain={chain || base} apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}>
      {children}
    </OnchainKitProvider>
  );
};

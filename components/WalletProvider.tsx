"use client";

import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletAdapterNetwork,
  WalletReadyState,
} from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const adapters = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );

  const [wallets, setWallets] = useState(adapters);

  useEffect(() => {
    const updateWallets = () => {
      setWallets(
        adapters.filter((wallet) =>
          [WalletReadyState.Installed, WalletReadyState.Loadable].includes(
            wallet.readyState,
          ),
        ),
      );
    };

    updateWallets();
    adapters.forEach((wallet) => wallet.on("readyStateChange", updateWallets));

    return () => {
      adapters.forEach((wallet) =>
        wallet.off("readyStateChange", updateWallets),
      );
    };
  }, [adapters]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { WagmiConfig, createClient } from "wagmi";
import { configureChains, goerli } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from "connectkit";

import {
  useWeb3LoadingContext,
  Web3LoadingProvider,
} from "contexts/web3Loading";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  const chains = [goerli];
  const { provider } = configureChains(chains, [publicProvider()]);

  const client = createClient(
    getDefaultClient({
      appName: "Decentralized Dice",
      provider,
      chains,
    })
  );

  const { isWeb3Loading } = useWeb3LoadingContext();

  return (
    <>
      <Head>
        <title>Decentralized Dice</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="crossOrigin"
        />
      </Head>
      <main>
        <QueryClientProvider client={queryClient}>
          <WagmiConfig client={client}>
            <Web3LoadingProvider value={{ isWeb3Loading }}>
              <ConnectKitProvider>
                <ConnectKitButton />
                <Component {...pageProps} />
              </ConnectKitProvider>
            </Web3LoadingProvider>
          </WagmiConfig>
        </QueryClientProvider>
      </main>
    </>
  );
}

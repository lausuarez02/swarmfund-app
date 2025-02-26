import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful');
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "clx0xxxxxxxxxxxxxxxx"}
      config={{
        loginMethods: ['twitter', 'email','wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#4ade80',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        }
      }}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  );
}

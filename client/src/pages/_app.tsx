import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import Layout from "@/components/Layout";
import ClientOnly from "@/components/ClientOnly";
import { SearchProvider } from "@/context/SearchContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ClientOnly>
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </CartProvider>
          </SearchProvider>
        </AuthProvider>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </ClientOnly>
    </ThemeProvider>
  );
}

"use client";

import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import CartMessage from "./CartMessage";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSearch = pathname === "/";

  return (
    <>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="Marketplace with multi-currency support" />
        <link rel="icon" href="https://cpsu.ie/wp-content/uploads/2025/03/gradient-isometric-nft-concept_52683-62009.jpg" />
      </Head>

      <Header showSearch={showSearch} />
      <main className="min-h-screen">{children}</main>
      <CartMessage />
      <Footer />
    </>
  );
}

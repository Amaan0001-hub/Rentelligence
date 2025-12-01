import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dashboard from "./dashboard.css";
import { Providers } from "./redux/slices/provider";
import GradientToast from "./components/toast";

import ErrorBoundary from "./components/ErrorBoundary";
import BodyWrapper from "./components/BodyWrapper";
import ClientActivityTracker from "./components/ClientActivityTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rentelligence",
  description: "AI-powered rental analytics and property insights.",
  openGraph: {
    title:
      "Rentelligence: Deploying intelligence for financially Independent future",
    description:
      "Rentelligence is the first decentralized marketplace for AI and ML agents. Buy, rent, or lease intelligent agents for limitless innovation in business, gaming, metaverse, and beyond.[Get Started] [Explore Agents]",
    //url: "https://rentelligence.live/CategoryImage/b78d8d19-c36a-4510-afc1-9b98c73e3a02.png",
    url: "https://app.rentelligence.ai/",

    siteName: "Rentelligence",
    images: [
      {
        url: "https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/6db933b4-d8e8-4cb4-f94d-5ff7533aba00/public",
        width: 1200,
        height: 630,
        alt: "Rentelligence dashboard preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Rentelligence",
  //   description: "AI-powered rental analytics and property insights.",
  //   images: ["/og-image.png"],
  //   creator: "@your_twitter_handle",
  // },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="transition-colors duration-300">
      <head>
        <link rel="icon" type="image/x-icon" href="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/51683b1e-6b8c-4e25-62f0-0a0eb6976400/public" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <BodyWrapper
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <main>
          <ClientActivityTracker />
          <GradientToast />
          <Providers>
            <ErrorBoundary>{children}</ErrorBoundary>
          </Providers>
        </main>
      </BodyWrapper>
    </html>
  );
}

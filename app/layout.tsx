import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ViewTransitions } from "next-view-transitions"
import { ThemeProvider } from "@/components/ui/theme-provider"
import Navigation from "@/components/ui/navigation"
import Footer from "@/components/ui/footer"
import NotificationBus from "@/components/ui/notification"
import ServiceWorkerRegister from "@/components/ui/sw-register"
import Head from "next/head"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InQuest — Learn. Play. Profit",
  description:
    "Your sandbox for mastering investing — risk-free, profit-ready.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} min-h-screen bg-background pb-6 antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black`}
        >
          <Head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#0d1117" />
          </Head>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            {/* Client notification portal */}
            <NotificationBus />
            <ServiceWorkerRegister />
            <main className="container">{children}</main>
            <Footer />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  )
}

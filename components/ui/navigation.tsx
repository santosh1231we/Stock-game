"use client"
import { ThemeToggle } from "./theme-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import GoBack from "./go-back"
import { usePathname } from "next/navigation"
import CommandMenu from "./command-menu"
import { isLoggedIn } from "@/lib/auth"
import { loadState } from "@/lib/sim"
import { useEffect, useState } from "react"

const NAVIGATION = [
  { title: "Markets", href: "/" },
  { title: "Screener", href: "/screener" },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [sim, setSim] = useState<ReturnType<typeof loadState> | null>(null)

  useEffect(() => {
    setMounted(true)
    if (isLoggedIn()) setSim(loadState())
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex w-full flex-row justify-between py-4">
          <div>{pathname !== "/" && <GoBack />}</div>
          <div className="flex flex-row items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                {NAVIGATION.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <CommandMenu />

            {mounted && sim && (
              <div className="mr-2 rounded-xl border border-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {sim.user.name} · ₹{sim.balance.toLocaleString()}
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

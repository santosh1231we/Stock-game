"use client"
// Theme toggle removed; moved to Profile section
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
import { useEffect, useState } from "react"
import SessionClient, { type Session } from "@/components/auth/SessionClient"
import NavUserBadge from "@/components/ui/NavUserBadge"
import LogoutButton from "@/components/auth/LogoutButton"
import { loadState } from "@/lib/sim"

const NAVIGATION = [
  { title: "Markets", href: "/" },
  { title: "Screener", href: "/screener" },
  { title: "Leaderboard", href: "/leaderboard" },
  { title: "Friends", href: "/friends" },
]

export default function Navigation() {
  const pathname = usePathname()
  const [sim, setSim] = useState<ReturnType<typeof loadState> | null>(null)
  useEffect(() => {
    setSim(loadState())
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex w-full flex-row justify-between py-4">
          <div>{pathname !== "/" && pathname !== "/dashboard" && <GoBack />}</div>
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

            <div className="mr-2 rounded-xl border border-zinc-800 px-3 py-1 text-xs text-zinc-400"><span className="font-semibold">InQuest</span> · Learn. Play. Profit.</div>
            <SessionClient>
              {(sess: Session) => (
                <NavUserBadge sess={sess} balance={sim?.balance} />
              )}
            </SessionClient>
            <Link href="/profile" className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-900">Profile</Link>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}

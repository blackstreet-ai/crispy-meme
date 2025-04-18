"use client"

import { Bell, User, PanelRight } from "lucide-react"
import { useSidebar } from "./sidebar-context"
import { ThemeToggle } from "./ui/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function Header() {
  const { collapsed, toggle } = useSidebar()
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* Sidebar toggle */}
        <button onClick={toggle} className="p-1.5 rounded-md hover:bg-accent">
          <PanelRight className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className="ml-auto flex items-center gap-4">
          <button className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-medium text-white">
              2
            </span>
          </button>
          <ThemeToggle />
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage src="https://ui.shadcn.com/avatars/01.png" alt="User avatar" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

"use client"

import * as React from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  User,
  LayoutDashboard,
  CreditCard,
  FileText,
  Settings,
  LogOut
} from "lucide-react"

export function UserDropdown() {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const menuItems = [
    { icon: <User className="mr-2 h-4 w-4" />, label: "Profile", href: "/profile" },
    { icon: <LayoutDashboard className="mr-2 h-4 w-4" />, label: "Dashboard", href: "/dashboard" },
    { icon: <CreditCard className="mr-2 h-4 w-4" />, label: "Payouts", href: "/payouts" },
    { icon: <FileText className="mr-2 h-4 w-4" />, label: "Statement", href: "/statement" },
    { icon: <Settings className="mr-2 h-4 w-4" />, label: "Settings", href: "/settings" },
    { icon: <LogOut className="mr-2 h-4 w-4" />, label: "Log out", href: "/logout" }
  ]

  // Close the dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" data-dropdown>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage 
            src="https://ui.shadcn.com/avatars/01.png" 
            alt="User avatar" 
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-card shadow-md z-50">
          <div className="p-2">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <Link
                  href={item.href}
                  className="flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
                {index === 4 && <div className="my-1 h-px bg-border" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

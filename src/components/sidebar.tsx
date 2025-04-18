"use client"

import Link from "next/link"
import { useSidebar } from "./sidebar-context"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  BarChart2, 
  Users, 
  Settings
} from "lucide-react"

interface SidebarItem {
  icon: React.ReactNode
  label: string
  href: string
}

export function Sidebar() {
  const { collapsed } = useSidebar()

  const mainItems: SidebarItem[] = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard"
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "Images",
      href: "/images"
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Orders",
      href: "/orders"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Payments",
      href: "/payments"
    },
    {
      icon: <BarChart2 className="h-5 w-5" />,
      label: "Transactions",
      href: "/transactions"
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Clients",
      href: "/clients"
    }
  ]

  const categories = [
    { name: "Laptops", count: 6, color: "bg-yellow-400" },
    { name: "Mobile phones", count: 8, color: "bg-orange-400" },
    { name: "Desktops", count: 0, color: "" },
    { name: "Accessories", count: 5, color: "bg-pink-400" },
    { name: "Portable storage", count: 4, color: "bg-green-400" },
    { name: "Networking", count: 0, color: "" }
  ]

  return (
    <aside className={`flex flex-col h-screen sticky top-0 border-r border-border/40 bg-background ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      <div className="p-4 flex items-center justify-center">
        <Link href="/" className="flex items-center">
          <div className={`w-8 h-8 ${!collapsed ? 'mr-2' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-500">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5 12C7.5 12 9 9 12 9C15 9 16.5 12 16.5 12C16.5 12 15 15 12 15C9 15 7.5 12 7.5 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {!collapsed && <span className="font-medium text-xl">Frox</span>}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {mainItems.map((item, index) => (
            <li key={index}>
              <Link 
                href={item.href}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                  index === 0 ? 'bg-purple-500 text-white hover:bg-purple-600 hover:text-white' : 'text-foreground'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        {!collapsed && (
          <>
            <div className="mt-8 px-4">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Categories</h3>
              <ul className="space-y-1 px-2">
                {categories.map((category, index) => (
                  <li key={index} className="flex items-center justify-between py-1">
                    <span className="text-sm">{category.name}</span>
                    {category.count > 0 && (
                      <span className={`flex h-5 w-5 items-center justify-center rounded-md text-xs ${category.color} text-white`}>
                        {category.count}
                      </span>
                    )}
                  </li>
                ))}
                <li className="mt-2">
                  <button className="flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <Settings className="mr-2 h-4 w-4" />
                    Add category
                  </button>
                </li>
              </ul>
            </div>

            <div className="mt-8 px-4">
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Top Sellers</h3>
              <div className="flex px-2 space-x-1">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <Avatar key={index} className="h-8 w-8 border border-border">
                    <AvatarImage 
                      src={`https://ui.shadcn.com/avatars/0${index + 1}.png`} 
                      alt={`Seller ${index + 1}`} 
                    />
                    <AvatarFallback>{index + 1}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            <div className="mt-8 px-4">
              <div className="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
                <h3 className="font-medium">Go to Pro</h3>
                <p className="mt-1 text-xs text-purple-100">Get access to all features on Pro account</p>
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-border/40 flex items-center space-x-2">
        <button className="p-1.5 rounded-md hover:bg-accent">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </aside>
  )
}

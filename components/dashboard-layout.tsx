"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useKifayat } from "@/components/kifayat-provider"
import { Button } from "@/components/ui/button"
import { BarChart3, Home, Lightbulb, LogOut, Menu, Settings, TrendingDown, User, X } from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  const router = useRouter()
  const { user, logout } = useKifayat()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const navItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Appliances", icon: Lightbulb, href: "/appliances" },
    { name: "Savings", icon: TrendingDown, href: "/savings" },
    { name: "Reports", icon: BarChart3, href: "/reports" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ]

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-green-800">Kifayat</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center">
              <User className="h-4 w-4 mr-2" />
              {user.name}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  item.href === window.location.pathname
                    ? "bg-green-100 text-green-800"
                    : "text-gray-700 hover:bg-green-50"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
              <div className="p-4 flex justify-between items-center border-b">
                <h2 className="font-bold text-green-800">Kifayat</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-green-800" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">View Profile</p>
                  </div>
                </div>
              </div>

              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      item.href === window.location.pathname
                        ? "bg-green-100 text-green-800"
                        : "text-gray-700 hover:bg-green-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                ))}

                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </Button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import LoginForm from "@/components/login-form"

export default function Navbar() {
  const { user, logout, isLoggedIn } = useUser()
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <nav className="bg-white shadow-sm py-4 px-6 mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">Personal Website</h1>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-sm py-4 px-6 mb-8">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">Personal Website</h1>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={user?.avatar || "/globe.svg"}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-medium text-sm hidden sm:inline">{user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowLoginForm(true)}>Login</Button>
          )}
        </div>
      </div>

      {showLoginForm && !isLoggedIn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <LoginForm onSuccess={() => setShowLoginForm(false)} onCancel={() => setShowLoginForm(false)} />
          </div>
        </div>
      )}
    </nav>
  )
}


"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type User = {
  id: string
  name: string
  avatar: string
}

type UserContextType = {
  user: User | null
  login: (name: string, avatarId: number, avatarPhoto: string) => void
  logout: () => void
  isLoggedIn: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const login = (name: string, avatarId: number, avatarPhoto: string) => {
    if (!isMounted) return

    setUser({
      id: Date.now().toString(),
      name,
      avatar: `/${avatarPhoto}.svg?height=100&width=100&text=${avatarId}`,
    })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}


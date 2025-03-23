
"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"

export default function VisitorCounter() {
  const [count, setCount] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Increment the counter only after client-side hydration is complete
    setCount((prevCount) => prevCount + 1)
  }, [])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-primary">
        <Users className="h-5 w-5" />
        <span className="font-medium">Visitor Count</span>
      </div>
      {/* Only show the count after client-side hydration */}
      <div className="text-3xl font-bold">{isMounted ? count : 0}</div>
      <p className="text-sm text-gray-500">Thank you for visiting my website!</p>
    </div>
  )
}


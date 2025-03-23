"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface Message {
  id: number
  author: string
  content: string
  timestamp: Date
  avatar?: string
  userId?: string
}

export default function MessageBoard() {
  const { user, isLoggedIn } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    const newMessage: Message = {
      id: Date.now(),
      author: user?.name || "Anonymous",
      content: content.trim(),
      timestamp: new Date(),
      avatar: user?.avatar,
      userId: user?.id,
    }

    setMessages([...messages, newMessage])
    setContent("")
  }

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="h-[100px] bg-gray-100 rounded-md animate-pulse"></div>
        <div className="h-[200px] bg-gray-100 rounded-md animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Textarea
            placeholder={
              isLoggedIn
                ? "Write your message here..."
                : "Login to leave a personalized message or write as anonymous..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[100px]"
            required
          />
          <Button type="submit" className="md:self-end">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-medium text-gray-700">
          {messages.length === 0 ? "No messages yet" : `${messages.length} Message${messages.length !== 1 ? "s" : ""}`}
        </h3>

        {messages.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Be the first to leave a message!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="p-4 bg-gray-50 rounded-lg flex gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={message.avatar || "/globe.svg?height=50&width=50&text=A"}
                    width={50}
                    height={50}
                    alt={message.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{message.author}</h4>
                    <span className="text-xs text-gray-500">{message.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <p className="text-gray-700">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


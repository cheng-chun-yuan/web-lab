"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface Message {
  id: number
  author: string
  content: string
  createdAt: Date
  updatedAt: Date
  avatar?: string
  userId?: string
}

export default function MessageBoard() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/messages')
        if (!response.ok) {
          throw new Error('Failed to fetch messages')
        }
        const data = await response.json()
        setMessages(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch messages:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch messages')
      } finally {
        setIsLoading(false)
      }
    }

    if (isMounted) {
      fetchMessages()
    }
  }, [isMounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    const newMessage = {
      author: session?.user?.name || "Anonymous",
      content: content.trim(),
      avatar: session?.user?.image || "/globe.svg",
      userId: session?.user?.id,
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      })

      if (response.ok) {
        const createdMessage = await response.json()
        setMessages(prev => [createdMessage, ...prev])
        setContent('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }

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
              session?.user
                ? "Write your message here..."
                : "Login to leave a personalized message or write as anonymous..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[100px]"
            required
            disabled={!session?.user}
          />
          <Button type="submit" className="md:self-end" disabled={!session?.user}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-medium text-gray-700">
          {isLoading ? "Loading..." :
           error ? "Error loading messages" :
           messages.length === 0 ? "No messages yet" :
           `${messages.length} Message${messages.length !== 1 ? "s" : ""}`}
        </h3>

        {isLoading ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : messages.length === 0 ? (
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
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
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


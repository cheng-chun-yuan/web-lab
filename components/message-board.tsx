"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useUser } from '@/lib/hooks/useUser';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface Message {
  id: number
  content: string
  userId: string
  user: {
    name: string
    avatar: string | null
  }
  createdAt: string
  updatedAt: string
}

export default function MessageBoard() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/messages?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        const updatedMessages = messages.filter((message) => message.id !== id)
        setMessages(updatedMessages)
      } else {
        setError('Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      setError('Failed to delete message')
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages')
        if (response.ok) {
          const data = await response.json()
          setMessages(data)
        } else {
          setError('Failed to fetch messages')
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
        setError('Failed to fetch messages')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [isMounted])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newMessage = {
      content: content.trim(),
      userId: user?.id,
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const savedMessage = await response.json()
      setMessages((prev) => [savedMessage, ...prev])
      setContent('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (isLoading) {
    return <div>Loading messages...</div>
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Textarea
            placeholder={
              user
                ? "Write your message here..."
                : "Login to leave a personalized message or write as anonymous..."
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[100px]"
            required
            disabled={!user}
          />
          <Button type="submit" className="md:self-end" disabled={!user}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex gap-4 bg-white p-4 rounded-lg shadow-sm"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={message.user.avatar || "/globe.svg"}
                alt={message.user.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">
                  {message.user.name}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </span>
                {user?.id === message.userId && (
                  <button className="text-red-500 text-xs" onClick={() => handleDelete(message.id)}>
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-700">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

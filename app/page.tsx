'use client'
import MessageBoard from "@/components/message-board"
import VisitorCounter from "@/components/visitor-counter"

import Image from "next/image"
import { useSession } from 'next-auth/react'
import Link from 'next/link'
export default function Home() {
  const { data: session } = useSession();

  return (

      <main className="p-6 md:p-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Welcome Section */}
          <section className="flex flex-col items-center gap-8 bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-primary/20">
              <Image
                src={`/globe.svg`}
                alt={"Logo"}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-800">Welcome to Message Board</h1>
              <p className="text-gray-600 max-w-xl">
                Share your thoughts and connect with others in our community
              </p>
              {!session ? (
                <div className="flex gap-4 justify-center mt-6">
                  <Link
                    href="/signup"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/about"
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              ) : (
                <div className="flex gap-4 justify-center mt-6">
                  <Link
                    href="/profile"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    View Profile
                  </Link>
                  <Link
                    href="/about"
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Message Board */}
          <section className="bg-white p-8 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Message Board</h2>
              {!session && (
                <p className="text-gray-600">
                  <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
                    Login
                  </Link>{' '}
                  to post messages
                </p>
              )}
            </div>
            <MessageBoard />
          </section>

          {/* Visitor Counter */}
          <section className="bg-white p-6 rounded-xl shadow-sm text-center">
            <VisitorCounter />
          </section>
        </div>
      </main>

  )
}


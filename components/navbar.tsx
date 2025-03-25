"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from 'next-auth/react'
export default function Navbar() {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <nav className="bg-white shadow-sm py-4 px-6 mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">
            <Link href="/">Message Board</Link>
          </h1>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm py-4 px-6 mb-8">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">
          <Link href="/">Message Board</Link>
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/about">About</Link>
          {session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={session?.user?.image || "/globe.svg"}
                    width={50}
                    height={50}
                    alt={"username"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-medium text-sm hidden sm:inline">
                  {session?.user?.name}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => {signOut()}}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link href="/signup">
                <Button variant="outline" size="sm">
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

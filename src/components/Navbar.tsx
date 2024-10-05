"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PenBoxIcon } from 'lucide-react'
import ShinyButton from "@/components/ui/shiny-button";

const Navbar = () => {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const LoginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("google", { redirect: false })
      if (result?.ok) {
        router.push('/')
      } else {
        console.error("Sign in failed:", result?.error)
      }
    } catch (error) {
      console.error("Error during sign in:", error)
    } finally {
      setIsLoading(false);
    }
  };

  const storeUser = async (user: any) => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          image: user.image,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to store user')
      }
    } catch (error) {
      console.error('Error storing user:', error)
    }
  }

  useEffect(() => {
    if (session?.user) {
      storeUser(session.user)
    }
  }, [session])

  return (
    <nav className="px-2 sm:px-8 md:px-12 lg:px-20 py-2">
      <div className="flex items-center justify-between px-2 sm:px-6">
        <Link href="/">
          <div className="flex items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
            <PenBoxIcon size={24} className='sm:w-6 sm:h-6 text-white' />
            <span className="ml-1 sm:ml-2 text-sm sm:text-xl font-semibold">ArticleGen</span>
          </div>
        </Link>
        <div className="flex items-center gap-4 sm:gap-4">
          {session?.user ? (
            <>
              <div className='sm:mr-3 mr-0'>
                <Link href="/articles">
                  <ShinyButton className='bg-white'>Articles</ShinyButton>
                </Link>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Image
                    src={session.user.image || "https://randomuser.me/api/portraits/men/1.jpg"}
                    alt="User"
                    width={32}
                    height={32}
                    className="rounded-full cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 sm:gap-2 group rounded-lg text-xs sm:text-sm text-black"
              onClick={LoginWithGoogle}
              disabled={isLoading}
            >
              <Image src="https://www.google.com/favicon.ico" alt="Google Logo" width={12} height={12} className="sm:w-4 sm:h-4" />
              {isLoading ? 'Logging in...' : 'Get Started'}
            </Button>
          )}
        </div>
      </div>
      <Separator className="mt-2" />
    </nav>
  )
}

export default Navbar
'use client';

import Link from "next/link";
import Image from "next/image";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
} from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import UserControl from '@/components/UserControl';
import ThemeToggle from '@/components/ThemeToggle';
import { useScroll } from '@/hooks/use-scroll';
import React from 'react'
import { cn } from "@/lib/utils";

const Navbar = () => {
    const isScrolled = useScroll(10);
  return (
    <nav 
        className={cn(
            "p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent", 
            isScrolled && "bg-background border-border"
        )}
    >
        <div className="max-w-5xl mx-auto flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="logo" width={24} height={24} />
                <h1 className="text-lg font-semibold">ArchiteckAI</h1>
            </Link>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <SignedOut>
                    <div className="flex gap-2">
                        <SignUpButton>
                            <Button variant={'outline'} size={'sm'}>
                                Sign Up
                            </Button>
                        </SignUpButton>
                        <SignInButton>
                            <Button size={'sm'}>
                                Sign In
                            </Button>
                        </SignInButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <UserControl showName />
                </SignedIn>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
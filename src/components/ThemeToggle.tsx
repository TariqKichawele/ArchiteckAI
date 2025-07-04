'use client';

import React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'

interface Props {
    variant?: "default" | "ghost" | "outline";
    size?: "sm" | "default" | "lg";
}

const ThemeToggle = ({ variant = "ghost", size = "sm" }: Props) => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Button 
            variant={variant} 
            size={size}
            onClick={toggleTheme}
            className="relative"
            aria-label="Toggle theme"
        >
            <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    )
}

export default ThemeToggle 
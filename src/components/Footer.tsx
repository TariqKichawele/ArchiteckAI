'use client';

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { 
    TwitterIcon, 
    GithubIcon, 
    LinkedinIcon, 
    MailIcon,
    HeartIcon
} from 'lucide-react'

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: 'Twitter',
            href: 'https://twitter.com',
            icon: TwitterIcon,
        },
        {
            name: 'GitHub',
            href: 'https://github.com',
            icon: GithubIcon,
        },
        {
            name: 'LinkedIn',
            href: 'https://linkedin.com',
            icon: LinkedinIcon,
        },
        {
            name: 'Email',
            href: 'mailto:hello@architeckai.com',
            icon: MailIcon,
        },
    ];

    const footerLinks = [
        {
            title: 'Product',
            links: [
                { name: 'Features', href: '#' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Documentation', href: '#' },
                { name: 'API Reference', href: '#' },
            ],
        },
        {
            title: 'Company',
            links: [
                { name: 'About', href: '#' },
                { name: 'Blog', href: '#' },
                { name: 'Careers', href: '#' },
                { name: 'Contact', href: '#' },
            ],
        },
        {
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms of Service', href: '#' },
                { name: 'Cookie Policy', href: '#' },
                { name: 'GDPR', href: '#' },
            ],
        },
    ];

    return (
        <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-5xl mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image 
                                src="/logo.svg" 
                                alt="ArchiteckAI logo" 
                                width={32} 
                                height={32} 
                            />
                            <h3 className="text-lg font-semibold">ArchiteckAI</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Build amazing applications and websites by simply chatting with AI. 
                            Turn your ideas into reality with the power of artificial intelligence.
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex items-center gap-2">
                            {socialLinks.map((social) => (
                                <Button
                                    key={social.name}
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="hover:bg-accent"
                                >
                                    <a
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Visit our ${social.name}`}
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    {footerLinks.map((section) => (
                        <div key={section.title} className="space-y-4">
                            <h4 className="text-sm font-semibold">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-muted-foreground">
                            © {currentYear} ArchiteckAI. All rights reserved.
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>Made with</span>
                            <HeartIcon className="h-3 w-3 text-red-500 fill-current" />
                            <span>by the ArchiteckAI team</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 
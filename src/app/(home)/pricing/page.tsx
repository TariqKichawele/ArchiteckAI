'use client';
import { PricingTable } from '@clerk/nextjs';
import Image from 'next/image';
import React from 'react'
import { dark } from '@clerk/themes';
import { useCurrentTheme } from '@/hooks/use-current-theme';
const PricingPage = () => {
    const currentTheme = useCurrentTheme();
  return (
    <div className='flex flex-col w-full mx-auto max-w-3xl'>
        <section className='space-y-6 pt-[16vh] 2xl:pt-48'>
            <div className='flex flex-col items-center'>
                <Image 
                    src={'/logo.svg'}
                    alt='logo'
                    width={50}
                    height={50}
                    className='hidden md:block'
                />
            </div>
            <h1 className='text-center md:text-3xl text-xl  font-bold'>Pricing</h1>
            <p className='text-center text-muted-foreground md:text-base text-sm'>
                Choose the plan that&apos;s right for you.
            </p>
            <PricingTable 
                appearance={{
                    baseTheme: currentTheme === 'dark' ? dark : undefined,
                    elements: {
                        pricingTableCard: "border! shadow-none! rounded-lg!",
                    }
                }}
            />
        </section>
    </div>
  )
}

export default PricingPage
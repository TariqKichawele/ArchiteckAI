import Navbar from '@/modules/home/ui/components/Navbar'
import React from 'react'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='flex flex-col min-h-screen max-h-screen'>
        <Navbar />
        <div className='absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e41_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]' />
        <div className='flex-1 flex flex-col px-4 pb-4'>
            {children}
        </div>
    </main>
  )
}

export default HomeLayout
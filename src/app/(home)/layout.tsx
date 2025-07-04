import Navbar from '@/modules/home/ui/components/Navbar'
import Footer from '@/components/Footer'
import React from 'react'

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='min-h-screen flex flex-col'>
        <Navbar />
        <div className='fixed inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#393e41_1px,transparent_1px)] bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]' />
        <div className='flex-1 px-4 pt-4 pb-4'>
            {children}
        </div>
        <Footer />
    </main>
  )
}

export default HomeLayout
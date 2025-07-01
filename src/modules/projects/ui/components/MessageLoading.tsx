import Image from 'next/image';
import { useEffect, useState } from 'react'

const ShimmerMessage = () => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const messages = [
        "Thinking...",
        "Looking for information...",
        "Analyzing...",
        "Generating response...",
        "Preparing to answer...",
        "Gathering information...",
        "Processing data...",
        "Preparing to answer...",
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className='flex items-center gap-2'>
            <span className='text-base text-muted-foreground animate-pulse'>
                {messages[currentMessageIndex]}
            </span>
        </div>
    )
}

const MessageLoading = () => {
    return (
        <div className='flex flex-col group px-2 pb-4'>
            <div className='flex items-center gap-2 pl-2 mb-2'>
                <Image 
                    src={"/logo.svg"}
                    alt='logo'
                    width={18}
                    height={18}
                    className='shrink-0'
                />
                <span className='text-sm font-medium'>Architect</span>
            </div>
            <div className='pl-8.5 flex flex-col gap-y-4'>
                <ShimmerMessage />
            </div>
        </div>
    )
}

export default MessageLoading;
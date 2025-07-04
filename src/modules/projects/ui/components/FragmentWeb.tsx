import Hint from '@/components/Hint';
import { Button } from '@/components/ui/button';
import { Fragment } from '@/generated/prisma';
import { ExternalLinkIcon, RefreshCcwIcon, AlertCircleIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react'

interface Props {
    data: Fragment;
}

const FragmentWeb = ({ data }: Props) => {
    const [fragmentKey, setFragmentKey] = useState(0);
    const [copied, setCopied] = useState(false);
    const [iframeError, setIframeError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const onRefresh = () => {
        setFragmentKey(prev => prev + 1);
        setIframeError(false);
        setIsLoading(true);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(data.sandboxUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    const handleIframeError = () => {
        setIframeError(true);
        setIsLoading(false);
    };

    const handleIframeLoad = () => {
        setIsLoading(false);
        setIframeError(false);
    };

    // Set a timeout to show error if iframe doesn't load within 10 seconds
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isLoading && !iframeError) {
                setIframeError(true);
                setIsLoading(false);
            }
        }, 10000); // 10 second timeout

        return () => clearTimeout(timeout);
    }, [fragmentKey, isLoading, iframeError]);

  return (
    <div className='flex flex-col w-full h-full'>
        <div className='p-2 border-b bg-sidebar flex items-center gap-2'>
            <Hint text='Refresh' side='bottom' align='start'>
                <Button size={'sm'} variant={'outline'} onClick={onRefresh}>
                    <RefreshCcwIcon />
                </Button>
            </Hint>
            <Hint text='Copy URL' side='bottom' align='start'>
                <Button
                    size={'sm'}
                    variant={'outline'}
                    className='flex-1 justify-start font-normal text-start'
                    onClick={handleCopy}
                    disabled={copied || !data.sandboxUrl}    
                >
                    <span className='truncate'>
                        {data.sandboxUrl}
                    </span>
                </Button>
            </Hint>
            <Hint text='Open in new tab' side='bottom' align='start'>
                <Button 
                    size={'sm'} 
                    variant={'outline'} 
                    onClick={() => {
                        if(!data.sandboxUrl) return;
                        window.open(data.sandboxUrl, '_blank');
                    }} 
                    disabled={!data.sandboxUrl}
                >
                    <ExternalLinkIcon />
                </Button>
            </Hint>
        </div>
        
        {iframeError ? (
            <div className='flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4'>
                <AlertCircleIcon className='w-12 h-12 text-muted-foreground' />
                <div className='space-y-2'>
                    <h3 className='text-lg font-medium'>Preview Unavailable</h3>
                    <p className='text-sm text-muted-foreground max-w-md'>
                        The preview cannot be displayed in the embedded view. This is typically due to security restrictions from the hosting service.
                    </p>
                </div>
                <div className='flex gap-2'>
                    <Button 
                        onClick={() => {
                            if(!data.sandboxUrl) return;
                            window.open(data.sandboxUrl, '_blank');
                        }}
                        disabled={!data.sandboxUrl}
                    >
                        <ExternalLinkIcon className='w-4 h-4 mr-2' />
                        Open in New Tab
                    </Button>
                    <Button variant="outline" onClick={onRefresh}>
                        <RefreshCcwIcon className='w-4 h-4 mr-2' />
                        Try Again
                    </Button>
                </div>
            </div>
        ) : (
            <div className='relative w-full h-full'>
                {isLoading && (
                    <div className='absolute inset-0 flex items-center justify-center bg-background/50 z-10'>
                        <div className='text-sm text-muted-foreground'>Loading preview...</div>
                    </div>
                )}
                <iframe 
                    key={fragmentKey}
                    className='w-full h-full'
                    sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation allow-presentation'
                    src={data.sandboxUrl}
                    loading='lazy'
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Code Preview"
                    onError={handleIframeError}
                    onLoad={handleIframeLoad}
                />
            </div>
        )}
    </div>
  )
}

export default FragmentWeb
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
        console.log('Iframe error occurred');
        setIframeError(true);
        setIsLoading(false);
    };

    const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
        console.log('Iframe loaded successfully');
        const iframe = e.target as HTMLIFrameElement;
        
        // Check if iframe actually loaded content or was blocked
        try {
            // For same-origin content, we can check contentDocument
            if (iframe.contentDocument || iframe.contentWindow) {
                setIsLoading(false);
                setIframeError(false);
                return;
            }
        } catch (error) {
            // This is expected for cross-origin content
            console.log('Cross-origin iframe - this is normal:', error);
        }
        
        // For cross-origin iframes, we assume success if onLoad fired
        // Give it a moment to render
        setTimeout(() => {
            setIsLoading(false);
            setIframeError(false);
        }, 1000);
    };

    // Set a timeout to show error if iframe doesn't load within 15 seconds
    useEffect(() => {
        if (!data.sandboxUrl) {
            setIframeError(true);
            setIsLoading(false);
            return;
        }

        const timeout = setTimeout(() => {
            if (isLoading && !iframeError) {
                console.log('Iframe timeout - showing error fallback');
                setIframeError(true);
                setIsLoading(false);
            }
        }, 15000); // 15 second timeout

        return () => clearTimeout(timeout);
    }, [fragmentKey, isLoading, iframeError, data.sandboxUrl]);

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
                        {data.sandboxUrl || 'No URL available'}
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
                        The preview cannot be displayed in the embedded view. This might be due to:
                    </p>
                    <ul className='text-xs text-muted-foreground text-left max-w-md space-y-1'>
                        <li>• Security restrictions from the hosting service</li>
                        <li>{`• The sandbox URL doesn't support embedding`}</li>
                        <li>• Network connectivity issues</li>
                    </ul>
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
                    <div className='absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10'>
                        <div className='flex flex-col items-center space-y-2'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
                            <div className='text-sm text-muted-foreground'>Loading preview...</div>
                        </div>
                    </div>
                )}
                <iframe 
                    key={fragmentKey}
                    className='w-full h-full border-0'
                    sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation'
                    src={data.sandboxUrl}
                    loading='eager'
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
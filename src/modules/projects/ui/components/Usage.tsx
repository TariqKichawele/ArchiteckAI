import React from 'react'
import { CrownIcon } from 'lucide-react';
import { formatDuration, intervalToDuration } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

interface Props {
    points: number;
    msBeforeNext: number;
}

const Usage = ({ points, msBeforeNext }: Props) => {
    const { has } = useAuth();
    const hasProAccess = has?.({ plan: "pro" });
    const isFreeTier = has?.({ plan: "free_user" });
    
    return (
        <div className='rounded-t-xl bg-background border border-b-0 p-2.5'>
            <div className='flex items-center gap-x-2'>
                <div>
                    <p className='text-sm'>
                    {points} {isFreeTier ? "free" : "" } credits remaining
                    </p>
                    <p className='text-xs text-muted-foreground'>
                        Resets in {" "}
                        {formatDuration(
                            intervalToDuration({
                                start: new Date(),
                                end: new Date(Date.now() + msBeforeNext)
                            }),
                            { format: ["months", "days", "hours"]}
                        )}
                    </p>
                </div>
                {!hasProAccess && (
                    <Button asChild size={'sm'} variant={'tertiary'} className='ml-auto'>
                        <Link href="/pricing">
                            <CrownIcon className='w-4 h-4' /> Upgrade
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Usage
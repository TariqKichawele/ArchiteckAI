import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
    children: React.ReactNode;
    text: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
}
const Hint = ({ children, text, side = 'top', align = 'center' }: Props) => {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={side} align={align}><p>{text}</p></TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default Hint
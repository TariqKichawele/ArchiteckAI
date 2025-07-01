"use client";

import React, { Suspense, useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import MessagesContainer from '../components/MessagesContainer';
import { Fragment } from '@/generated/prisma';
import ProjectHeader from '../components/ProjectHeader';

interface Props {
    projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

  return (
    <div className='h-screen'>
        <ResizablePanelGroup direction='horizontal'>
            <ResizablePanel
                defaultSize={35}
                minSize={20}
                className='flex flex-col min-h-0'
            >
                <Suspense fallback={<div>Loading Project Header...</div>}>
                    <ProjectHeader projectId={projectId} />
                </Suspense>
                <Suspense fallback={<div>Loading Messages...</div>}>
                    <MessagesContainer 
                        projectId={projectId} 
                        activeFragment={activeFragment} 
                        setActiveFragment={setActiveFragment} 
                    />
                </Suspense>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
                defaultSize={65}
                minSize={50}
                className='flex flex-col min-h-0'
            >
                TODO: Project View
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

export default ProjectView
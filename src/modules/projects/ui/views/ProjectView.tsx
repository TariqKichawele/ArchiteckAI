"use client";

import React, { Suspense, useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import MessagesContainer from '../components/MessagesContainer';
import { Fragment } from '@/generated/prisma';
import ProjectHeader from '../components/ProjectHeader';
import FragmentWeb from '../components/FragmentWeb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CodeIcon, CrownIcon, EyeIcon } from 'lucide-react';
import Link from 'next/link';
import FileExplorer, { FileCollection } from '@/components/FileExplorer';
import UserControl from '@/components/UserControl';

interface Props {
    projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
    const [tabState, setTabState] = useState<'preview' | 'code'>('preview');

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
            <ResizableHandle className='hover:bg-primary transition-colors' />
            <ResizablePanel
                defaultSize={65}
                minSize={50}
                className='flex flex-col min-h-0'
            >
                <Tabs
                    value={tabState}
                    defaultValue='preview'
                    onValueChange={(value) => setTabState(value as 'preview' | 'code')}
                    className='h-full gap-y-0'
                >
                    <div className='w-full flex items-center p-2 border-b gap-x-2'>
                        <TabsList className='h-8 p-0 border rounded-md'>
                            <TabsTrigger value='preview' className='rounded-md'>
                                <EyeIcon />
                                <span>Preview</span>
                            </TabsTrigger>
                            <TabsTrigger value='code' className='rounded-md'>
                                <CodeIcon />
                                <span>Code</span>
                            </TabsTrigger>
                        </TabsList>
                        <div className='ml-auto flex items-center gap-x-2 '>
                            <Button asChild size={'sm'} variant={'tertiary'}>
                                <Link href={'/pricing'}>
                                    <CrownIcon /> Upgrade
                                </Link>
                            </Button>
                            <UserControl />
                        </div>
                    </div>
                    <TabsContent value='preview'>
                        {!!activeFragment && <FragmentWeb data={activeFragment} /> }
                    </TabsContent>
                    <TabsContent value='code' className='min-h-0'>
                        {!!activeFragment?.files && (
                            <FileExplorer files={activeFragment.files as FileCollection} />
                        )}
                    </TabsContent>
                </Tabs>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  )
}

export default ProjectView
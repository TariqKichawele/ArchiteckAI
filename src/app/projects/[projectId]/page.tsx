import { getQueryClient } from '@/trpc/server';
import React, { Suspense } from 'react'
import { trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import ProjectView from '@/modules/projects/ui/views/ProjectView';

interface Props {
    params: Promise<{ projectId: string }>
}


const ProjectPage = async ({ params }: Props) => {
    const { projectId } = await params;
    const queryClient = getQueryClient();
    
    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
        projectId,
    }));
    void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
    }));

    const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
        <Suspense fallback={<div>Loading...</div>}>
            <ProjectView projectId={projectId} />
        </Suspense>
    </HydrationBoundary>
  )
}

export default ProjectPage
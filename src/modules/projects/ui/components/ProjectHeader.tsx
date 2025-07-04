import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import {
    ChevronLeftIcon,
    ChevronDownIcon,
    SunMoonIcon,
    TrashIcon,
    AlertTriangleIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioItem,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useTRPC } from '@/trpc/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props {
    projectId: string;
}

const ProjectHeader = ({ projectId }: Props) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
    }));
    const { theme, setTheme } = useTheme();

    const deleteProject = useMutation(trpc.projects.delete.mutationOptions({
        onSuccess: () => {
            toast.success("Project deleted successfully");
            setIsDeleteDialogOpen(false);
            queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
            router.push("/");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete project");
        }
    }));

    const handleDeleteProject = () => {
        deleteProject.mutate({ id: projectId });
    };

  return (
    <>
        <header className='p-2 flex justify-between items-center border-b'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm' className='focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!'>
                        <Image 
                            src={"/logo.svg"}
                            alt='logo'
                            width={18}
                            height={18}
                        />
                        <span className='text-sm font-medium'>{project.name}</span>
                        <ChevronDownIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' align='start'>
                    <DropdownMenuItem asChild>
                        <Link href={"/"}>
                            <ChevronLeftIcon />
                            <span>
                                Go to Dashboard
                            </span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className='gap-2'>
                            <SunMoonIcon className='size-4 text-muted-foreground' />
                            <span>Appearance</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                    <DropdownMenuRadioItem value='light'>
                                        <span>Light</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value='dark'>
                                        <span>Dark</span>
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value='system'>
                                        <span>System</span>
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className='text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950'
                    >
                        <TrashIcon className='size-4' />
                        <span>Delete Project</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <AlertTriangleIcon className='size-5 text-red-600' />
                        Delete Project
                    </DialogTitle>
                    <DialogDescription>
                        {`Are you sure you want to delete "${project.name}"? This action cannot be undone and will permanently delete the project and all its messages.`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button 
                        variant="outline" 
                        onClick={() => setIsDeleteDialogOpen(false)}
                        disabled={deleteProject.isPending}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDeleteProject}
                        disabled={deleteProject.isPending}
                    >
                        {deleteProject.isPending ? "Deleting..." : "Delete Project"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default ProjectHeader
import React, { useState, useMemo, useCallback, Fragment } from 'react'
import Hint from './Hint'
import { Button } from './ui/button'
import CodeView from './Codeview/CodeView'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'
import { 
    Breadcrumb, 
    BreadcrumbEllipsis, 
    BreadcrumbItem, 
    BreadcrumbList, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from './ui/breadcrumb'
import { CopyCheckIcon, CopyIcon } from 'lucide-react'
import { convertFilesToTreeItems } from '@/lib/utils'
import TreeView from './TreeView'

export type FileCollection = {
    [path: string]: string;
}

function getLanguageFromExtension(filename: string) {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension || 'text';
}

interface fileBreadCrumbProps {
    filePath: string;
}

const FileBreadCrumb = ({ filePath }: fileBreadCrumbProps) => {
    const pathSegments = filePath.split("/");
    const maxSegments = 4;

    const renderBreadcrumbItems = () => {
        if (pathSegments.length <= maxSegments) {
            return pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;

                return (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {isLast ? (
                                <BreadcrumbPage className='font-medium'>
                                    {segment}
                                </BreadcrumbPage>
                            ) : (
                                <span className='text-muted-foreground'>
                                    {segment}
                                </span>
                            )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                    </Fragment> 
                )
            })
        } else {
            const firstSegment = pathSegments[0];
            const lastSegment = pathSegments[pathSegments.length - 1];

            return (
                <>
                    <BreadcrumbItem>
                        <span className='text-muted-foreground'>
                            {firstSegment}
                        </span>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbEllipsis />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className='font-medium'>
                                {lastSegment}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbItem>
                </>
            )
        }
    };

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {renderBreadcrumbItems()}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

interface FileExplorerProps {
    files: FileCollection;

}

const FileExplorer = ({ files }: FileExplorerProps) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files);
        return fileKeys.length > 0 ? fileKeys[0] : null;
    });
    const [copied, setCopied] = useState(false);
    const treeData = useMemo(() => convertFilesToTreeItems(files), [files]);

    const handleFileSelect = useCallback((filePath: string) => {
        if(files[filePath]) {
            setSelectedFile(filePath);
        }
    }, [files]);

    const handleCopy = useCallback(() => {
        if(selectedFile) {
            navigator.clipboard.writeText(files[selectedFile]);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel defaultSize={30} minSize={30} className='bg-sidebar'>
            <TreeView 
                data={treeData}
                value={selectedFile}
                onSelect={handleFileSelect}
            />
        </ResizablePanel>
        <ResizableHandle className='hover:bg-primary transition-colors'/>
        <ResizablePanel defaultSize={70} minSize={50}>
            {selectedFile && files[selectedFile] ? (
                <div className='h-full w-full flex flex-col'>
                    <div className='border-b bg-sidebar py-2 px-4 flex items-center justify-between gap-x-2'>
                        <FileBreadCrumb filePath={selectedFile} />
                        <Hint text='Copy to clipboard' side='bottom'>
                            <Button 
                                variant={'outline'} 
                                size={'icon'} 
                                className='ml-auto' 
                                onClick={handleCopy} 
                                disabled={copied}
                            >
                                {copied ? (
                                    <CopyCheckIcon className='text-green-500' />
                                ) : (
                                    <CopyIcon />
                                )}
                            </Button>
                        </Hint>
                    </div>
                    <div className='flex-1 overflow-auto'>
                        <CodeView
                            language={getLanguageFromExtension(selectedFile)}
                            code={files[selectedFile]}
                        />
                    </div>
                </div>
            ) : (
                <div className='flex text-muted-foreground items-center justify-center h-full'>
                    Select a file to view the code
                </div>
            )}
        </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default FileExplorer
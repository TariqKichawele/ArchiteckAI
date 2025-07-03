import React, { useEffect } from 'react'
import Prism from 'prismjs';
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "./CodeTheme.css";

interface Props {
    code: string;
    language: string;
}

const CodeView = ({ code, language }: Props) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [code]);
    
  return (
    <pre className='p-2 bg-transparent border-none rounded-none m-0 text-xs'>
        <code className={`language-${language}`}>
            {code}
        </code>
    </pre>
  )
}

export default CodeView
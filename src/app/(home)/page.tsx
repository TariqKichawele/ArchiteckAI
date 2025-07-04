'use client';

import ProjectForm from "@/modules/home/ui/components/ProjectForm";
import ProjectsList from "@/modules/home/ui/components/ProjectsList";
import Image from "next/image";


export default function Home() {
  return (
    <div className='flex flex-col max-w-5xl mx-auto w-full space-y-12'>
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image 
            src={'/logo.svg'}
            alt="logo"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Build Something with Architeck AI
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Create apps and websites by chatting with Architeck AI
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>
      <div className="pb-12">
        <ProjectsList />
      </div>
    </div>
  )
}

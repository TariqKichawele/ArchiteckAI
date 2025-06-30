'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";


export default function Home() {
  const trpc = useTRPC();
  const [value, setValue] = useState("");
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());

  const createMessage = useMutation(trpc.messages.create.mutationOptions({}));
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => createMessage.mutate({ value })} disabled={createMessage.isPending}>
        Create Message
      </Button>
      <div>
        {JSON.stringify(messages, null, 2)}
      </div>
    </div>
  )
}

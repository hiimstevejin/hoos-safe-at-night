"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "other" | "system";
  text: string;
  name?: string;
  avatarUrl?: string;
  time?: string;
};

export default function ChatLauncher({
  postId,
  postTitle,
  initialMessages = [],
}: {
  postId: string;
  postTitle: string;
  initialMessages?: Message[];
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    // optimistic append
    setMessages((m) => [
      ...m,
      {
        id: crypto.randomUUID(),
        role: "user",
        text,
        name: "You",
        time: new Date().toLocaleTimeString(),
      },
    ]);
    setInput("");

    // TODO: 서버 연동
    // await fetch("/api/chat", { method: "POST", body: JSON.stringify({ postId, text }) })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          aria-label={`Open chat for ${postTitle}`}
          onClick={(e) => e.stopPropagation()} // 행 클릭과 충돌 방지
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      {/* 가운데 뜨는 컨테이너 */}
      <DialogContent
        // 중앙 고정 폭 + 반응형
        className="p-0 w-[min(92vw,680px)] sm:max-w-[680px]"
      >
        <div className="flex h-[70vh] min-h-[480px] flex-col">
          <DialogHeader className="p-4">
            <DialogTitle className="truncate">Chat — {postTitle}</DialogTitle>
          </DialogHeader>
          <Separator />

          {/* 메시지 영역 */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start gap-2 ${
                    m.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {m.role !== "user" && (
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={m.avatarUrl ?? "/avatar.png"} />
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[75%] text-sm ${
                      m.role === "user" ? "bg-blue-600 text-white" : "bg-muted"
                    }`}
                  >
                    <p>{m.text}</p>
                    {m.time && (
                      <span className="mt-1 block text-[10px] opacity-70">
                        {m.time}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />
          <form onSubmit={send} className="p-3 flex gap-2">
            <Input
              placeholder="Type a message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Message"
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

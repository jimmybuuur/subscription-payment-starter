import { Message, UserDetails } from "@/types";
import { IconArrowUp } from "@tabler/icons-react";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';  
import type { Database } from 'types_db';  



export const supabase = createBrowserSupabaseClient<Database>();  

interface Props {
  onSend: (message: Message) => void;
  userDetails: UserDetails | null;
  sessionId: string | null;
}

export const ChatInput: FC<Props> = ({ onSend, userDetails, sessionId }) => {
  const [content, setContent] = useState<string>();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 4000) {
      alert("Message limit is 4000 characters");
      return;
    }

    setContent(value);
  };

  const handleSend = async () => { // is async allowed here?
    if (!content) {
      alert("Please enter a message");
      return;
    }
    // send data to backend
    const { data: messages, error } = await supabase.from('message').insert([{ message: content, user_id: userDetails?.id ?? '', role: "user", session_id: sessionId ?? ''}]);
    if (error) {
      console.log(error);
      return;
    }
    else {
      console.log(messages);
    }

    onSend({ role: "user", message: content, user_id: userDetails?.id ?? '', session_id: sessionId ?? ''});
    setContent("");
  };


  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className="min-h-[44px] rounded-lg pl-4 pr-12 py-2 w-full focus:outline-none focus:ring-1 focus:ring-neutral-300 border-2 border-neutral-200"
        style={{ resize: "none", color: "black" }}
        placeholder="Type a message..."
        value={content}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <button onClick={() => handleSend()}>
        <IconArrowUp className="absolute right-2 bottom-3 h-8 w-8 hover:cursor-pointer rounded-full p-1 bg-blue-500 text-white hover:opacity-80" />
      </button>
    </div>
  );
};
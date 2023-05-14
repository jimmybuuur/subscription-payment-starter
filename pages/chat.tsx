import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';  
import { useUser } from '@/utils/useUser';  
// import { UserDetails } from "@/types";
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';  
import type { Database } from 'types_db';

import { Chat } from "@/components/chat/Chat";
import { Message } from "@/types";
import Head from "next/head";


// import for ReadableStream
// import { ReadableStream } from "web-streams-polyfill/ponyfill";

// const { userDetails } = useUser();
export const supabase = createBrowserSupabaseClient<Database>(); 

export default function Home() {
  const router = useRouter();  
  const { user, isLoading, userDetails } = useUser();  
  
  useEffect(() => {  
    if (!user && !isLoading) {  
      router.push('/signin');  
    }  
  }, [user, isLoading]);  

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);
    

    const body = {  
      query: message,  
      user_id: userDetails?.id,  
      user_name: `${userDetails?.first_name} ${userDetails?.last_name}`  
  }

    if (!process.env.AZURE_CHAT_API_KEY) {
      throw new Error("A key should be provided to invoke the endpoint");
    }

    // The azureml-model-deployment header will force the request to go to a specific deployment.
    // Remove this header to have the request observe the endpoint traffic rules
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.AZURE_CHAT_API_KEY,
        'azureml-model-deployment': 'blue'
      },
      body: JSON.stringify(body)
    };

    const response = await fetch(process.env.AZURE_CHAT_ENDPOINT_URL ?? '', options);

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      if (isFirst) {
        isFirst = false;
        setMessages((messages) => [
          ...messages,
          {
            role: "assistant",
            message: chunkValue,
            user_id: "-1"
          }
        ]);
      } else {
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const updatedMessage = {
            ...lastMessage,
            content: lastMessage.message + chunkValue
          };
          return [...messages.slice(0, -1), updatedMessage];
        });
      }
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        message: `Hi there! I'm Chatbot UI, an AI assistant. I can help you with things like answering questions, providing information, and helping with tasks. How can I help you?`,
        user_id: "-1"
      }
    ]);
  };

  useEffect(() => {  
    if (messagesEndRef.current) {  
      scrollToBottom();  
    }  
  }, [messages]); 

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        message: `Hi there! I'm Chatbot UI, an AI assistant. I can help you with things like answering questions, providing information, and helping with tasks. How can I help you?`,
        user_id: "-1"
      }
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Chatbot UI</title>
        <meta
          name="description"
          content="A simple chatbot starter kit for OpenAI's chat model using Next.js, TypeScript, and Tailwind CSS."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col h-screen">
        {/* <Navbar /> */}

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
              userDetails={userDetails}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
}
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router';  
import { useUser } from '@/utils/useUser';  
import {searchAzureChat} from '@/utils/useAzure';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';  
import type { Database } from 'types_db';
import { ExtractsSidebar } from "@/components/sidebar/ExtractsSidebar";

import { Chat } from "@/components/chat/Chat";
import { Message } from "@/types";
import Head from "next/head";


// import for ReadableStream
// import { ReadableStream } from "web-streams-polyfill/ponyfill";


export const supabase = createBrowserSupabaseClient<Database>(); 

export default function Home() {
  const router = useRouter();  
  const { user, isLoading, userDetails, accessToken } = useUser(); 
  const [extracts, setExtracts] = useState<string[]>([]);
  
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
    
    const data = await searchAzureChat(message, userDetails, accessToken);
    console.log("Data: ", data);
    if (!data) {
      setLoading(false);
      return;  
    }
    setLoading(false);
    
    const chunkValue = data.outputs.response;
    console.log("Chunk Value: ", chunkValue);
    // const extracts = data.outputs.extracts;
    const newExtracts = data.outputs.extracts || [];
    console.log("Extracts: ", extracts);
    // setExtracts((extracts) => [...extracts, ...newExtracts]);  
    // if extracts is not an empty string, then overwrite the extracts
    if (newExtracts) {
      setExtracts(newExtracts);
    }
    
    setMessages((messages) => [
    ...messages,
      {
        role: "assistant",
        message: chunkValue,
        user_id: userDetails?.id ?? '',
        session_id: accessToken ?? ''
      }
    ]);
    
    // when done, save message in db
    const { error } = await supabase.from('message').insert([{ message: chunkValue, user_id: userDetails?.id ?? '', role: "assistant", session_id: accessToken ?? ''}]);
    if (error) {
      console.log(error);
    }
    // also save extracts if any
    if (data.outputs.extracts) {
      const { error } = await supabase.from('extract').insert([{ extracts: extracts, user_id: userDetails?.id ?? '', session_id: accessToken ?? ''}]);
      if (error) {
        console.log(error);
      }
    }
  };

  //   const reader = data.getReader();
  //   const decoder = new TextDecoder();
  //   let done = false;
  //   let isFirst = true;

  //   let chunkValues = [];
  //   while (!done) {
  //     const { value, done: doneReading } = await reader.read();
  //     done = doneReading;
  //     const chunkValue = decoder.decode(value);


  //     if (isFirst) {
  //       isFirst = false;
  //       setMessages((messages) => [
  //         ...messages,
  //         {
  //           role: "assistant",
  //           message: chunkValue,
  //           user_id: userDetails?.id ?? '',
  //           session_id: accessToken ?? ''
  //         }
  //       ]);
  //     } else {
  //       setMessages((messages) => {
  //         const lastMessage = messages[messages.length - 1];
  //         const updatedMessage = {
  //           ...lastMessage,
  //           content: lastMessage.message + chunkValue
  //         };
  //         return [...messages.slice(0, -1), updatedMessage];
  //       });
  //     }
  //     // append chunkValue's in a temp variable
  //     // when done, save message in db
  //     chunkValues.push(chunkValue);
  //     console.log(chunkValue);
  //   }
  //   // when done, save message in db
  //   const { error } = await supabase.from('message').insert([{ message: chunkValues.join(''), user_id: userDetails?.id ?? '', role: "assistant", session_id: accessToken ?? ''}]);
  //   if (error) {
  //     console.log(error);

  // };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        message: `Hi there! I'm Chatbot UI, an AI assistant. I can help you with things like answering questions, providing information, and helping with tasks. How can I help you?`,
        user_id: userDetails?.id ?? '',
        session_id: accessToken ?? ''
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
        user_id: userDetails?.id ?? '',
        session_id: accessToken ?? ''
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

        <div className="flex flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12 flex">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
              userDetails={userDetails}
              sessionId={accessToken}
            />
            <ExtractsSidebar extracts={extracts} />
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
}
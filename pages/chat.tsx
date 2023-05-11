import { useEffect, useState } from 'react';  
import { useRouter } from 'next/router';  
import { useSessionContext } from '@supabase/auth-helpers-react';  
import { MyUserContextProvider, useUser } from '@/utils/useUser';  
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';  
import type { Database } from 'types_db';  
import React from 'react';  
// import { NextApiRequest } from 'next';  
import type { AppProps } from 'next/app';

  
export const supabase = createBrowserSupabaseClient<Database>();  
  
interface Message {  
    id: number;  
    message: string;  
    user_id: string;  
    created_at: string;  
  }  

function Chat() {  
  const router = useRouter();  
  const { user, isLoading, userDetails } = useUser();  
  const [messages, setMessages] = useState<Message[]>([]);  
  const [newMessage, setNewMessage] = useState('');  
  
  useEffect(() => {  
    if (!user && !isLoading) {  
      router.push('/signin');  
    }  
  }, [user, isLoading]);  
  
  useEffect(() => {  
    fetchMessages();  
  }, []);  
  
  const fetchMessages = async () => {  
    const { data: messages, error } = await supabase  
      .from('messages')  
      .select('*')  
      .order('created_at', { ascending: false });  
  
    if (error) {  
      console.log('Error fetching messages:', error.message);  
    } else {  
    const formattedMessages = messages.map((message) => ({  
        id: message.id,  
        message: message.message,  
        user_id: message.user_id,  
        created_at: message.created_at,  
        }));  
        setMessages(formattedMessages);    
    }  
  };  
  
//   const handleSubmit =  async (event: React.FormEvent<HTMLFormElement>) => {  
//     event.preventDefault();  
//     //log user.id to console
//     console.log('user.id: ', userDetails?.id);
//     if (!newMessage.trim()) {  
//       return;  
//     }  
  
//     const { data: message, error } = await supabase.from('messages').insert([    
//         { message: newMessage, user_id: user?.id }    
//       ]);         
  
//     if (error) {  
//       console.log('Error creating message:', error.message);  
//     } else {  
//         if (message) {  
//             setMessages([message, ...messages]);  
//             setNewMessage('');  
//         }  
//     }  
//   };  

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {  
    event.preventDefault();  
    console.log('user.id: ', userDetails?.id);  
    if (!newMessage.trim()) {  
      return;  
    }  
    
    const { data: message, error } = await supabase  
      .from('messages')  
      .insert([{ message: newMessage, user_id: user?.id }]);  
    
    if (error) {  
      console.log('Error creating message:', error.message);  
    } else {  
      if (message) {  
        const formattedMessage = {  
          id: message[0].id,  
          message: message[0].message,  
          user_id: message[0].user_id,  
          created_at: message[0].created_at,  
        };  
        setMessages([formattedMessage, ...messages]);  
        setNewMessage('');  
      }  
    }  
  };  
  
  // log message.user_id and userDetails?.id to console
    console.log('message.user_id: ', message.user_id);
    console.log('userDetails?.id: ', userDetails?.id);

  return (  
    <div style={{width: '100%', height: '100vh', backgroundColor: '#fff'}}>  
    <div style={{maxWidth: '600px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column'}}>  
        <div style={{background: '#f1f0f0', padding: '10px', borderBottom: '1px solid #ccc'}}>  
        <h2 style={{margin: '0'}}>Chat</h2>  
        </div>  
        <div style={{flex: '1', overflowY: 'scroll'}}>  
        {messages.map((message, index) => (  
            <div key={index} style={{display: 'flex', justifyContent: message.user_id === userDetails?.id ? 'flex-end' : 'flex-start', margin: '10px'}}>  
            <div style={{background: message.user_id === userDetails?.id ? '#DCF8C6' : '#fff', color: message.user_id === userDetails?.id ? '#000' : '#333', padding: '10px', borderRadius: '10px', maxWidth: '70%'}}>  
                <p style={{margin: 0}}>{message.user_id}: {message.message}</p>  
            </div>  
            </div>  
        ))}  
        </div>  
        <form onSubmit={handleSubmit} style={{display: 'flex', alignItems: 'center', margin: '10px'}}>  
        <input type="text" value={newMessage} onChange={(event) => setNewMessage(event.target.value)} style={{flex: '1', padding: '10px', color: '#000'}} />  
        <button type="submit" style={{background: '#4CAF50', color: '#fff', padding: '10px', border: 'none', borderRadius: '0 10px 10px 0'}}>Send</button>  
        </form>  
    </div>  
    </div>  
        
        
  );  
}  
  
export default Chat;

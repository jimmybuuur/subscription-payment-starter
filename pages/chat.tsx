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
  const { user, isLoading } = useUser();  
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
  
  const handleSubmit =  async (event: React.FormEvent<HTMLFormElement>) => {  
    event.preventDefault();  
  
    if (!newMessage.trim()) {  
      return;  
    }  
  
    const { data: message, error } = await supabase.from('messages').insert([    
        { message: newMessage, user_id: user?.id }    
      ]);         
  
    if (error) {  
      console.log('Error creating message:', error.message);  
    } else {  
        if (message) {  
            setMessages([message, ...messages]);  
            setNewMessage('');  
        }  
    }  
  };  
  
  return (  
    // <div>  
    //   <h1>Chat</h1>  
    //   <form onSubmit={handleSubmit}>  
    //     <input  
    //       type="text"  
    //       value={newMessage}  
    //       onChange={(event) => setNewMessage(event.target.value)}  
    //     />  
    //     <button type="submit">Send</button>  
    //   </form>  
    //   <ul>  
    //     {messages.map((message) => (  
    //       <li key={message.id}>  
    //         {message.user_id}: {message.message}  
    //       </li>  
    //     ))}  
    //   </ul>  
    // </div>
    


    // <div style={{maxWidth: '400px', margin: 'auto'}}>  
    // <div style={{background: '#f1f0f0', padding: '10px', borderBottom: '1px solid #ccc'}}>  
    //     <h2 style={{margin: '0'}}>Chat</h2>  
    // </div>  ''
    // <div style={{height: '400px', overflowY: 'scroll'}}>  
    //     {messages.map((message, index) => (  
    //     <div key={index} style={{display: 'flex', justifyContent: message.user_id === 'Me' ? 'flex-end' : 'flex-start', margin: '10px'}}>  
    //         <div style={{background: message.user_id === 'Me' ? '#DCF8C6' : '#fff', padding: '10px', borderRadius: '10px', maxWidth: '70%'}}>  
    //         {message.message}  
    //         </div>  
    //     </div>  
    //     ))}  
    // </div>  
    // <form onSubmit={handleSubmit} style={{display: 'flex', marginTop: '10px'}}>  
    //     <input type="text" value={newMessage} onChange={(event) => setNewMessage(event.target.value)} style={{flex: '1', padding: '10px'}} />  
    //     <button type="submit" style={{background: '#4CAF50', color: '#fff', padding: '10px', border: 'none', borderRadius: '0 10px 10px 0'}}>Send</button>  
    // </form>  
    // </div> 

        <html>
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Chat</title>
            <style>
            body {
                margin: 0;
                padding: 0;
                font-family: sans-serif;
            }

            .chat-container {
                max-width: 400px;
                margin: auto;
            }

            .chat-header {
                background: #f1f0f0;
                padding: 10px;
                border-bottom: 1px solid #ccc;
            }

            .chat-header h2 {
                margin: 0;
            }

            .chat-messages {
                height: 400px;
                overflow-y: scroll;
            }

            .chat-message {
                display: flex;
                justify-content: flex-end;
                margin: 10px;
            }

            .chat-message-other {
                justify-content: flex-start;
            }

            .chat-message-bubble {
                background-color: #DCF8C6;
                padding: 10px;
                border-radius: 10px;
                max-width: 70%;
            }

            .chat-message-bubble-other {
                background-color: #fff;
            }

            .chat-input-form {
                display: flex;
                margin-top: 10px;
            }

            .chat-input-form input[type="text"] {
                flex: 1;
                padding: 10px;
            }

            .chat-input-form button[type="submit"] {
                background-color: #4CAF50;
                color: #fff;
                padding: 10px;
                border: none;
                border-radius: 0 10px 10px 0;
            }
            </style>
        </head>

        <body>
            <div class="chat-container">
            <div class="chat-header">
                <h2>Chat</h2>
            </div>

            <div class="chat-messages">
                <div class="chat-message">
                <div class="chat-message-bubble">Hola!</div>
                </div>
            </div>

            <form class="chat-input-form" onSubmit={handleSubmit}>
                <input
                type="text"
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                placeholder="Escribe tu mensaje aqui..."
                required
                />
                
                <button type="submit">Send</button>
                
            </form>
            </div>
        </body>
        </html>
  );  
}  
  
export default Chat;

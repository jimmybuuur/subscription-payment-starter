import { useEffect, useRef, useState } from "react";
import { Message } from "@/types";  
import { UserDetails } from "@/types";
  
export async function searchAzureChat(message: Message, userDetails: UserDetails | null ) {  

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
    throw new Error(response.statusText);  
  }  
  
  const data = response.body;   
  return data;  
}  
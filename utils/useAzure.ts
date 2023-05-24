// import { useEffect, useRef, useState } from "react";
import { Message } from "@/types";  
import { UserDetails } from "@/types";
  
export async function searchAzureChat(message: Message, userDetails: UserDetails | null, access_token: string | null ) {  

  const body = {
    data: {
      inputs: {
        query: message.message,    
        user_id: userDetails?.id,    
        user_name: `${userDetails?.first_name} ${userDetails?.last_name}`
      }
    }  
  }  
  
  if (!process.env.NEXT_PUBLIC_AZURE_CHAT_API_KEY) {  
    throw new Error("A key should be provided to invoke the Azure endpoint");  
  }  
  

  // The azureml-model-deployment header will force the request to go to a specific deployment.  
  // Remove this header to have the request observe the endpoint traffic rules  
  const options = {  
    method: 'POST',  
    headers: {  
      'Content-Type': 'application/json',  
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AZURE_CHAT_API_KEY}`,  
      'azureml-model-deployment': 'blue',
      'Accept': '*/*'
    }, 
    body: JSON.stringify(body)
  };  

  
  const response = await fetch(process.env.NEXT_PUBLIC_AZURE_CHAT_ENDPOINT_URL ?? '', options);  
  
  if (!response.ok) {  
    throw new Error(response.statusText);  
  }  
  
  // const data = response.body;   
  // response is a json object with a data property that contains the response from the model
  const data = await response.json();
  // data has shape: { data: { outputs: { response: "string", extracts: "string" } } }
  // let res: string = data.data.outputs.response;
  // let extracts: string = data.data.outputs.extracts;

  // return { res, extracts };
  return data;
}  

import React from 'react';  
  
interface Props {  
  extracts: string[];  
}  
  
export const ExtractsSidebar: React.FC<Props> = ({ extracts }) => {  
    return (  
      <div className="w-full sm:w-3/5 h-screen bg-gray-100 p-4 overflow-auto">  
        <h2 className="text-lg font-medium mb-2">Extracts</h2>  
        <ul className="max-h-screen">  
          {extracts.length > 0 ? (  
            <li className="mb-2 whitespace-pre-wrap">{extracts[extracts.length - 1]}</li>  
          ) : (  
            <li className="mb-2 whitespace-pre-wrap">No extracts yet</li>  
          )}  
        </ul>  
      </div>  
    );  
  };  
  
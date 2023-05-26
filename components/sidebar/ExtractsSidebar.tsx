import React from 'react';  
  
interface Props {  
  extracts: string[];  
}  
  
export const ExtractsSidebar: React.FC<Props> = ({ extracts }) => {  
  return (  
    <div className="w-full sm:w-1/4 h-screen bg-gray-100 p-4">  
      <h2 className="text-lg font-medium mb-2">Extracts</h2>  
      <ul className="max-h-screen">  
        {extracts.map((extract, index) => (  
          <li key={index} className="mb-2 whitespace-pre-wrap">{extract}</li>  
        ))}  
      </ul>  
    </div>  
  );  
};  
import React from 'react';  
  
interface Props {  
  extracts: string[];  
}  
  
export const ExtractsSidebar: React.FC<Props> = ({ extracts }) => {  
  return (  
    <div className="w-1/4 h-screen bg-gray-100 p-4">  
      <h2 className="text-lg font-medium mb-2">Extracts</h2>  
      <ul>  
        {extracts.map((extract, index) => (  
          <li key={index} className="mb-2">{extract}</li>  
        ))}  
      </ul>  
    </div>  
  );  
};  
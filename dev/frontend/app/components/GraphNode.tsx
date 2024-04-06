import React, { useState } from 'react';

export function GraphNode({ size, initialNode, value, setValue }: { size: String, initialNode: Boolean, value: Number, setValue: Function }) {
  const [error, setError] = useState(false); 
  
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    console.log(input)

    if(/^[1-9]\d?$/.test(input)) {
      setValue(input);
      setError(false)
    } else {
      setError(true);
    }
  }
  
  return (
    <div className={`w-${size} h-${size} box-border rounded-full bg-gray-200 flex flex-col justify-center items-center overflow-hidden`}>
        {
          initialNode 
          ? <p>{ value.toString() }</p> 
          : <input 
              type="number" 
              onChange={ handleInputChange }
              className="w-3/4 border border-gray-300 rounded-md text-center text-lg"
            />
        }
        {error && 
          <div>
            <p className="text-xs text-center">Input must be a positive integer from 1 - 99!</p>
          </div>
        }
      </div>
  )
}
import React, { useState } from 'react';

export function GraphNode({ size, setValue, initialNode, initialValue }: { size: String, setValue: Function, initialNode: Boolean, initialValue?: Number }) {
  const [inputField, setInputField] = useState("");
  const [error, setError] = useState(false); 
  
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;

    if(/^[1-9]\d?$/.test(input)) {
      setInputField(input);
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
          ? <p>lol</p> 
          : <input 
              type="text" 
              value={ inputField }
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
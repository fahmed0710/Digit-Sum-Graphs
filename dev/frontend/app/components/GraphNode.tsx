import React, { useState } from 'react';

export function GraphNode({ initialNode, value, setValue }: { initialNode: Boolean, value: Number, setValue: Function }) {
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
    <div>
      <div className="w-40 h-40 rounded-full bg-gray-200 flex flex-col justify-center items-center">
        {
          initialNode 
          ? <p>{ value.toString() }</p> 
          : <input 
              type="number" 
              onChange={ handleInputChange }
              className="w-3/4 p-2 border border-gray-300 rounded-md text-center text-lg"
            ></input>
        }
        {error && 
          <div>
            <p className="text-sm text-center">Input must be a positive integer from 1 - 99!</p>
          </div>
        }
      </div>
    </div>
  )
}
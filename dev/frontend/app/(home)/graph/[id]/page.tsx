"use client"
import React, { useState, useEffect } from 'react';
import { GraphNode } from "@/app/components/GraphNode"
import { getPuzzle } from '@/app/actions/puzzle';

export default function Graph({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  
  const [puzzleNodeNumber, setPuzzleNodeNumber] = useState(0);
  const [puzzleStr, setPuzzleStr] = useState("");
  const [puzzleStrLayers, setPuzzleStrLayers] = useState<string[]>([]);
  const [puzzleStrWidth, setPuzzleStrWidth] = useState(0);

  useEffect(() => {
    async function fetchPuzzle() {
      try {
        const result = await getPuzzle(id);
        if(result?.success) {
          setPuzzleNodeNumber(result.result['number_of_nodes'])
          setPuzzleStr(result.result['str_representation']);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchPuzzle();
  }, []);

  useEffect(() => {
    if(puzzleStr) {
      const splitStr = puzzleStr.split('\n');
      if (splitStr.length > 0) {
        setPuzzleStrWidth(splitStr[0].length);
        setPuzzleStrLayers(splitStr);
      }
    }
  }, [puzzleStr]);

  const [nodeValues, setNodeValues] = useState<number[]>([]);

  const handleNodeChange = (index: number, value: number) => {
    const newNodes = [...nodeValues];
    newNodes[index] = value;
    setNodeValues(newNodes);
    console.log(nodeValues);
  };

  const [submissionError, setSubmissionError] = useState(false);

  const handleSubmit = () => {
    function isValidSubmission () {
      if (nodeValues.length !== puzzleNodeNumber) {
        return false;
      } 
      
      for (let i = 0; i < nodeValues.length; i++) {
        let val = nodeValues[i];
        if (typeof val === 'undefined' || typeof val !== 'number' || !Number.isInteger(val) || val <= 0 || val >= 100) {
          return false; 
        } 
      }

      return true;
    }

    if(isValidSubmission()) {
      setSubmissionError(false);
    } else {
      setSubmissionError(true);
    }
    
  };

  return (
    <div className="container mx-auto px-6 py-20 flex-col justify-center items-center overflow-auto">
      
      <h1 className="font-geoeves text-7xl text-center" style={{ wordSpacing: '-7px' }}>Digit Sum Graphs</h1>
      
      {/* Add instructions on how to play the game */}
      <h2 className="text-md text-center py-2">Graph {id}</h2>
      
      <div className={`relative mx-auto p-8 md:w-4/5 lg:w-2/5 aspect-square flex-col rounded-xl border border-solid border-black flex justify-center items-center ${puzzleStrWidth > 5 ? 'overflow-x-auto' : ''}`}>
        <div className="absolute top-0 p-4">X/{puzzleNodeNumber} nodes filled</div>
        
        <div className={`grid grid-cols-${puzzleStrWidth}`}>
          {puzzleStrLayers.map((layer, layerIndex) => (
            <div key={layerIndex} className="flex justify-center items-center">
              {layer.split('').map((element, elementIndex) => (
                <div key={`${layerIndex}-${elementIndex}`} className="w-full aspect-square flex justify-center items-center">
                  {(!isNaN(Number(element)) && element !== ' ') && <GraphNode size={"full"} setValue={(value: number) => handleNodeChange(Number(element) - 1, Number(value))} initialNode={false} />}
                  {element === ' ' && <div className="w-full"/>}
                  {element === '-' && <div className="w-full h-1 bg-gray-600" />}
                  {element === '|' && <div className="w-1 h-full bg-gray-600" />}
                  {element === '\\' && <div className="w-1 h-full transform -rotate-45 border-r-2 border-gray-600" />}
                  {element === '/' && <div className="w-1 h-full transform rotate-45 border-r-2 border-gray-600" />} 
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto p-6 flex justify-center items-center">
        <button onClick={ handleSubmit }>Submit Solution</button>
      </div>

      {submissionError && 
        <p className="mx-auto p-6 md:w-4/5 lg:w-2/5 border border-solid border-red-500">
          <b>Submission error!</b> Check to make sure that a{')'} all nodes are filled out and b{')'} all nodes contain a whole number between 0 and 99!
        </p>
      }

      {/* Hint mechanism */}
    </div>
  );
}
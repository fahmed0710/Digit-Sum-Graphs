"use client"
import React, { useState, useEffect } from 'react';
import { GraphNode } from "@/app/components/GraphNode"
import { getPuzzle } from '@/app/actions/puzzle';

export default function Graph({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  
  const [puzzleStr, setPuzzleStr] = useState("");
  const [puzzleStrLayers, setPuzzleStrLayers] = useState<string[]>([]);
  const [puzzleStrWidth, setPuzzleStrWidth] = useState(0);

  useEffect(() => {
    async function fetchPuzzle() {
      try {
        const result = await getPuzzle(id);
        if(result?.success) {
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

  const [node1, setNode1] = useState(0);
  const [node2, setNode2] = useState(18);
  const [node3, setNode3] = useState(0);

  return (
    <div className="container mx-auto px-6 py-20 flex-col justify-center items-center overflow-auto">
      
      <h1 className="font-geoeves text-7xl text-center" style={{ wordSpacing: '-7px' }}>Digit Sum Graphs</h1>
      
      <h2 className="text-md text-center py-2">Graph {id}</h2>
      
      <div className={`mx-auto p-8 md:w-4/5 lg:w-2/5 aspect-square rounded-xl border border-solid border-black flex justify-center items-center ${puzzleStrWidth > 5 ? 'overflow-x-auto' : ''}`}>
        <div className={`grid grid-cols-${puzzleStrWidth}`}>
          {puzzleStrLayers.map((layer, layerIndex) => (
            <div key={layerIndex} className="flex justify-center items-center">
              {layer.split('').map((element, elementIndex) => (
                <div key={`${layerIndex}-${elementIndex}`} className="w-full aspect-square flex justify-center items-center">
                  {element === 'N' && <GraphNode size={"full"} initialNode={false} value={0} setValue={setNode1} />}
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

      <div className="flex justify-center items-center mx-auto p-6">
        <button className="">Submit Solution</button>
      </div>
    </div>
  );
}
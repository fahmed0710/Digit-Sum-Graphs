"use client"
import React, { useState, useEffect } from 'react';
import { getPuzzleIDs } from '@/app/actions/puzzle';

export default function GraphMenu() {
  const [puzzleIds, setPuzzleIds] = useState<number[]>([]);

  useEffect(() => {
    async function getPuzzleIdList() {
      try {
        const result = await getPuzzleIDs();

        if(result?.success) {
          setPuzzleIds(result?.result as number[]);
          console.log(result?.message);
        } else {
          console.log(result?.message);
        }
      } catch (error) {
        console.log(error)
      }
    }

    getPuzzleIdList();
  }, [])

  return (
    <div className="container mx-auto px-6 py-20 flex-col justify-center items-center overflow-auto">
      <h1 className="font-geoeves text-7xl text-center" style={{ wordSpacing: '-7px' }}>Digit Sum Graphs</h1>
      <p className="text-center">Click on a link to access a graph puzzle!</p>
      
      <div className="mx-auto p-8 md:w-4/5 lg:w-2/5 grid grid-cols-6">
        {puzzleIds.map((puzzleId, puzzleIdIndex) => (
          <div 
            key={puzzleIdIndex}
            className="py-2 flex justify-center items-center"
          >
            <a 
              href={`/graph/${puzzleId}`}
              className="font-medium text-pink-500 hover:text-pink-400 hover:undlerline"
            >
              {puzzleId}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
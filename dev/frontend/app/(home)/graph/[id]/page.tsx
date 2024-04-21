"use client"
import React, { useState, useEffect } from 'react';
import { GraphNode } from "@/app/components/GraphNode"
import { getPuzzle, checkSolution } from '@/app/actions/puzzle';

export default function Graph({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  
  const [initNode, setInitNode] = useState(0);
  const [initVal, setInitVal] = useState(0);
  const [numOfNodes, setNumOfNodes] = useState(0);
  const [puzzleStr, setPuzzleStr] = useState("");
  const [puzzleStrLayers, setPuzzleStrLayers] = useState<string[]>([]);
  const [puzzleStrWidth, setPuzzleStrWidth] = useState(0);
  const [nodeValues, setNodeValues] = useState<number[]>([]);

  const handleNodeChange = (index: number, value: number) => {
    const newNodes = [...nodeValues];
    newNodes[index] = value;
    setNodeValues(newNodes);
  };

  useEffect(() => {
    async function fetchPuzzle() {
      try {
        const result = await getPuzzle(id);
        if(result?.success) {
          setInitNode(result.result['initial_node']);
          setInitVal(result.result['initial_val']);
          setNumOfNodes(result.result['number_of_nodes'])
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
    handleNodeChange(initNode - 1, initVal);
  }, [initNode, initVal]);

  useEffect(() => {
    if(puzzleStr) {
      const splitStr = puzzleStr.split('\n');
      if (splitStr.length > 0) {
        setPuzzleStrWidth(splitStr[0].length);
        setPuzzleStrLayers(splitStr);
      }
    }
  }, [puzzleStr]);

  const [submissionError, setSubmissionError] = useState(false);

  function isValidSubmission() {
    if (nodeValues.length !== (numOfNodes)) {
      return false;
    } 
    
    for (let i = 0; i < nodeValues.length; i++) {
      let val = nodeValues[i];
      if (typeof val === 'undefined' || typeof val !== 'number' || isNaN(val) || !Number.isInteger(val) || val <= 0 || val >= 100) {
        return false; 
      } 
    }
    return true;
  }

  const [correct, setCorrect] = useState(true);
  const [incorrectNodes, setIncorrectNodes] = useState<number[]>([]); 

  async function checkNodes() {
    const result = await checkSolution(id, nodeValues);
    
    let modal;

    if (result.success) {
      setCorrect(true);

      modal = document.getElementById("correctSolution");
      if (modal instanceof HTMLDialogElement) {
        modal.showModal();
      }
    } else {
      setCorrect(false);
      setIncorrectNodes(result.result);

      modal = document.getElementById("incorrectSolution");
      if (modal instanceof HTMLDialogElement) {
        modal.showModal();
      }
    }
  }

  const handleSubmit = () => {
    if(isValidSubmission()) {
      setSubmissionError(false);
      checkNodes();
    } else {
      setSubmissionError(true);
      
      const modal = document.getElementById("submissionError");
      if (modal instanceof HTMLDialogElement) {
        modal.showModal();
      }
    } 
  };

  return (
    <div className="container mx-auto px-6 py-6 flex-col justify-center items-center overflow-auto">
      
      <h1 className="font-geoeves text-7xl text-center" style={{ wordSpacing: '-7px' }}>Digit Sum Graphs</h1>
      
      <h2 className="mx-auto p-4 md:w-4/5 lg:w-2/5 text-md text-center">Given one node with a number in it, fill in the other nodes with positive whole numbers in such a way that each node's number is the sum of the digits of all the numbers connected to it.</h2>
      
      <div className={`relative mx-auto p-8 md:w-4/5 lg:w-2/5 aspect-square flex-col rounded-xl border border-solid border-black flex justify-center items-center ${puzzleStrWidth > 5 ? 'overflow-x-auto' : ''}`}>
        {/* <div className="absolute top-0 p-4">X/{numOfNodes} nodes filled</div> */}

        {!correct &&
          <div className="absolute top-0 p-4">
            <p>Incorrect!</p>
          </div>
        }

        <div className={`grid grid-cols-${puzzleStrWidth}`}>
          {puzzleStrLayers.map((layer, layerIndex) => (
            <div key={layerIndex} className="flex justify-center items-center">
              {layer.split('').map((element, elementIndex) => (
                <div key={`${layerIndex}-${elementIndex}`} className="w-full aspect-square flex justify-center items-center">
                  {(Number.isInteger(Number(element)) && element !== ' ' 
                    && ((Number(element) === initNode)
                      ? <GraphNode size={"full"} setValue={(value: number) => handleNodeChange(Number(element) - 1, Number(value))} initialNode={true} initialValue={ initVal }/>
                      : <GraphNode size={"full"} setValue={(value: number) => handleNodeChange(Number(element) - 1, Number(value))} />
                    )
                  )}
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
        <button className="m-1 px-2 py-2 rounded bg-pink-500 hover:bg-pink-400 text-white">Get Solution</button>
        <button className="m-1 px-2 py-2 rounded bg-pink-500 hover:bg-pink-400 text-white" onClick={ handleSubmit }>Submit Solution</button>
      </div>

      <dialog id="submissionError" className="modal">
        <div className="modal-box border border-solid border-red-500 flex">
          <form method="dialog" className="modal-action">
            <button className="absolute top-2 right-4">x</button>
          </form>
          <p >
            <b>Submission error!</b> Check to make sure that a{')'} all nodes are filled out and b{')'} all nodes contain a whole number between 0 and 99!
          </p>  
        </div>
      </dialog>

      <dialog id="incorrectSolution" className="modal">
        <div className="modal-box border border-solid border-red-500 flex">
          <form method="dialog" className="modal-action">
            <button className="absolute top-2 right-4">x</button>
          </form>
          <p >
            <b>Incorrect solution!</b> Make sure each node is the sum of all the digits in the nodes connecting to it.
          </p>  
        </div>
      </dialog>

      <dialog id="correctSolution" className="modal">
        <div className="modal-box border border-solid border-green-500 flex">
          <form method="dialog" className="modal-action">
            <button className="absolute top-2 right-4">x</button>
          </form>
          <p >
            <b>Correct solution!</b> Move on to the next game?
          </p>  
        </div>
      </dialog>

      {/* Hint mechanism */}
    </div>
  );
}
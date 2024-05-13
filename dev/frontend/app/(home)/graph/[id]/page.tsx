"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationMenu } from '@/app/components/NavigationMenu';
import { GraphNode } from "@/app/components/GraphNode"
import { getSession } from '@/app/actions/auth';
import { getPuzzle, getSolution, checkSolution } from '@/app/actions/puzzle';
import { createGameplay } from '@/app/actions/gameplays';

export default function Graph({ params }: { params: { id: number } }) {
  const puzzleId = Number(params.id);
  
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(0);

  const [startTime, setStartTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [stopTimer, setStopTimer] = useState(false);
 
  useEffect(() => {
    async function checkSession() {
      const retrievedSession = await getSession();
      if(retrievedSession) {
        setSession(retrievedSession);
        setUserId(retrievedSession.user.user_id);
      } 
    }

    checkSession();
  }, []);

  function formatElapsedTime (timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (startTime && !stopTimer) {
      const updateElapsedTime = () => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000); // in seconds
        const elapsedString = formatElapsedTime(elapsed);
        setElapsedTime(elapsedString);
        timeout = setTimeout(updateElapsedTime, 1000); // Schedule next update
      };

      updateElapsedTime();
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [startTime, stopTimer]);

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
        const result = await getPuzzle(puzzleId);
        if(result?.success) {
          setInitNode(result.result['initial_node']);
          setInitVal(result.result['initial_val']);
          setNumOfNodes(result.result['number_of_nodes'])
          setPuzzleStr(result.result['str_representation']);
        } else {
          router.push("/graph");
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchPuzzle();
  }, [puzzleId]);

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

  const [generatedSolution, setGeneratedSolution] = useState([]); 

  const handleGetSolution = async () => {
    const result = await getSolution(puzzleId);

    if(result.success) {
      const solutionStr = result.result;
      setGeneratedSolution(solutionStr.match(/\d+|[^0-9\s]| /g));
    } 

    let modal = document.getElementById("getSolution");
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  }

  const [correct, setCorrect] = useState(true);
  const [incorrectNodes, setIncorrectNodes] = useState<number[]>([]); 

  async function checkNodes() {
    const result = await checkSolution(puzzleId, nodeValues);
    
    let modal;

    if (result.success) {
      setCorrect(true);

      setStopTimer(true);
      if(session) {
        const result = await createGameplay({'user_id': userId, 'puzzle_id': puzzleId, 'completion_time': elapsedTime});
        if (result.error) {
          console.log(result.error);
        }
      }

      modal = document.getElementById("correctSolution");
      if (modal instanceof HTMLDialogElement) {
        modal.showModal();
      }
    } else {
      setCorrect(false);

      setStopTimer(false);

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
      <NavigationMenu />
      <h1 className="font-geoeves text-7xl text-center" style={{ wordSpacing: '-7px' }}>Digit Sum Graphs</h1>
      
      <h2 className="mx-auto p-4 md:w-4/5 lg:w-2/5 text-md text-center">Given one node with a number in it, fill in the other nodes with positive whole numbers in such a way that the value of each node is the sum of the digits of all the numbers connected to it.</h2>
      
      <div className={`relative mx-auto p-8 md:w-4/5 lg:w-2/5 aspect-square flex-col rounded-xl border border-solid border-black flex justify-center items-center`}>
        <div className="absolute top-0 p-4">{elapsedTime}</div>
        <div className="grid" style={{  gridTemplateRows: `repeat(${puzzleStrLayers.length}, auto)` }}>
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
                  {element === '\\' && <div className="w-1 h-full transform -rotate-45 scale-y-180 border-2 border-gray-600" />}
                  {element === '/' && <div className="w-1 h-full transform rotate-45 scale-y-180 border-2 border-gray-600" />} 
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto p-6 flex justify-center items-center">
        <button className="m-1 px-2 py-2 rounded bg-pink-500 hover:bg-pink-400 text-white" onClick={ handleGetSolution }>Get Solution</button>
        <button className="m-1 px-2 py-2 rounded bg-pink-500 hover:bg-pink-400 text-white" onClick={ handleSubmit }>Submit Solution</button>
      </div>

      <dialog id="getSolution" className="modal">
        <div className="max-w-sm modal-box border border-solid border-pink-500 flex justify-center items-center">
          <form method="dialog" className="modal-action">
            <button className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
          
          <div>
            <span className="font-bold">Solution for Graph {puzzleId}</span>
            <div className="grid" style={{ gridTemplateColumns: `repeat(${puzzleStrWidth}, auto)`, gridTemplateRows: `repeat(${puzzleStrLayers.length}, auto)` }}>
              {generatedSolution.map((element, idx) => (
                <div className="flex justify-center items-center" key={idx}>
                  {element}
                </div>
              ))}
            </div>
          </div>  
        </div>
      </dialog>

      <dialog id="submissionError" className="modal">
        <div className="modal-box border border-solid border-red-500 flex">
          <form method="dialog" className="modal-action">
            <button className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
          
          <p >
            <span className="font-bold">Submission error!</span> Check to make sure that a{")"} all nodes are filled out and b{")"} all nodes contain a whole number between 1 and 99!
          </p>  
        </div>
      </dialog>

      <dialog id="incorrectSolution" className="modal">
        <div className="modal-box border border-solid border-red-500 flex flex-col">
          <form method="dialog" className="modal-action">
            <button className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
         
          <p>
            <span className="font-bold">Incorrect solution!</span> Make sure each node is the sum of all the digits in the nodes connecting to it.
          </p>
          
          <div className="py-2 flex justify-center gap-2">
            <button onClick={() => router.push("/graph")} className="px-2 py-1 rounded bg-pink-500 hover:bg-pink-400 text-white">View all graphs</button>
            <button onClick={() => router.push("/")} className="px-2 py-1 rounded bg-pink-500 hover:bg-pink-400 text-white">Home</button>
          </div> 
        </div>
      </dialog>

      <dialog id="correctSolution" className="modal">
        <div className="modal-box border border-solid border-pink-500 flex flex-col">
          <form method="dialog" className="modal-action">
            <button className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
          
          <p>
            <span className="font-bold">Correct!</span> Graph completed in <i>{elapsedTime}</i>
            <br />Move on to the next game?
          </p>  
          
          <div className="py-2 flex justify-center gap-2">
            <button onClick={() => router.push(`/graph/${puzzleId + 1}`)} className="px-2 py-1 rounded bg-pink-500 hover:bg-pink-400 text-white">Yes</button>
            <button onClick={() => router.push("/")} className="px-2 py-1 rounded bg-pink-500 hover:bg-pink-400 text-white">No</button>
            <button onClick={() => router.push("/graph")} className="px-2 py-1 rounded bg-pink-500 hover:bg-pink-400 text-white">View all graphs</button>
          </div>
        </div>
      </dialog>

      {/* Hint mechanism */}
    </div>
  );
}
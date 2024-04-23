"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { NavigationMenu } from "./components/NavigationMenu";
import { GraphNode } from "./components/GraphNode";
import exampleImage from "./components/images/example.jpg";
import solutionImage from "./components/images/solution.jpg"


export default function Home() {
  const router = useRouter();
  
  return(
    <div className="mx-auto min-h-screen md:w-full lg:w-3/5 flex flex-col justify-center items-center overflow-auto">
      <NavigationMenu />
      
      <div className="grid grid-rows-4 w-screen">

        <div className="flex justify-center items-center">
          <h1 className="font-geoeves text-9xl text-center" style={{ wordSpacing: '-7px'}}>Digit Sum Graphs</h1>
        </div>
        
        <div className="mx-auto md:w-full lg:w-3/5 row-span-2 grid grid-cols-3">
          <div className="col-span-3 px-8 py-4 flex flex-col justify-center items-center">
            <p className="text-lg text-center leading-loose">In each diagram, fill in the circles with positive whole numbers in such a way that each circle's number is the sum of the digits of all the numbers connected to it.</p>
          </div>
          
          <div className="flex flex-col justify-center items-center">
            <p className="text-lg leading-loose">Example:</p>
            <Image className="max-h-full w-auto" src={exampleImage} alt="Example" />
          </div>
          
          <div className="flex flex-col justify-center items-center">
            <p className="text-lg leading-loose">Solution:</p>
            <Image className="max-h-full w-auto" src={solutionImage} alt="Example" />
          </div>

          <div className="flex flex-col justify-center items-center">
            <p className="text-md leading-6">
              The solution works because:
              <br/>{"\nCircle 1, 5: 15 = (2 + 1) + (1 + 8) + (2 + 1)"}
              <br/>{"\nCircle 2, 4: 21 = (1 + 5) + (1 + 8) + (1 + 5)"}
              <br/>{"\nCircle 3: 18 = (1 + 5) + (2 + 1) + (1 + 5) + (2 + 1)"}
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <button onClick={() => router.push("/graph/1")} className="m-1 px-2 py-2 rounded bg-pink-500 hover:bg-pink-400 text-xl text-white">Play now!</button>
        </div>
      </div>
    </div> 
  )
}

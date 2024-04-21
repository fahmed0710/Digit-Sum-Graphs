"use server"

interface Puzzle {
  puzzle_id: number;
  number_of_nodes: number;
  str_representation: string;
}

export async function getPuzzles() {
  try {
    const response = await fetch("http://127.0.0.1:4000/puzzles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error.message as string };
  }
}

export async function getPuzzleIDs() {
  try {
    const result = await getPuzzles();
    
    if(result.success) {
      const puzzles: Puzzle[] = result.result;

      const puzzleIds: number[] = puzzles.map((puzzle) => puzzle.puzzle_id);
    
      return { success: true, message: "Puzzle IDs retrieved successfully.", result: puzzleIds };
    } else {
      return { success: true, message: "Puzzle IDs failed to be retrieved."};
    }
  } catch (error: any) {
    return { success: false, message: error.message as string };
  }
}

export async function getPuzzle(id: Number) {
  try {
    const response = await fetch(`http://127.0.0.1:4000/puzzles/get/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error.message as string };
  }
}

export async function checkSolution(id: Number, solution_set: Number[]) {
  try {
    const body = {
      solution_set: solution_set
    }
    
    const response = await fetch(`http://127.0.0.1:4000/puzzles/check/solution/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }, 
      body: JSON.stringify(body)
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    return { success: false, message: error.message as string };
  }
}
"use server"

interface Puzzle {
  puzzle_id: number;
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
      const puzzles: Puzzle[] = result.puzzles;

      const puzzleIds: number[] = puzzles.map((puzzle) => puzzle.puzzle_id);
    
      return { success: true, message: "Puzzle IDs retrieved successfully.", ids: puzzleIds };
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

export async function validateSolution(username: string, password: string): Promise<{ success: boolean, message: string }> {
  try {
    // const credentials = {
    //   username: username,
    //   password: password
    // };
    
    // const response = await fetch("http://127.0.0.1:4000/users/login", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(credentials)
    // });

    // const result = await response.json();
    // return result;
    return { success: true, message: "In progress!"};
  } catch (error) {
    return { success: false, message: "Database Error: failed to login user" };
  }
}
"use server"

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
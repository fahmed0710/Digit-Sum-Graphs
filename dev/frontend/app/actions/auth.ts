"use server"

export async function login(username: string, password: string): Promise<{ success: boolean, message: string }> {
  try {
    const credentials = {
      username: username,
      password: password
    };
    
    const response = await fetch("http://127.0.0.1:4000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, message: "Database Error: failed to login user" };
  }
}

export async function signup(username: String, email: String, password: String): Promise<{ success: boolean, message: string }> {
  try {
    const newUser = {
      username: username,
      email: email,
      password: password
    }

    const response = await fetch("http://127.0.0.1:4000/users/add_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    });

    const result = response.json();

    return result;
  } catch (error) {
    return { success: false, message: "Database Error: failed to create new user" };
  }
}
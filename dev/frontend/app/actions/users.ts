"use server"

export async function getUsers() {
  try {
    const response = await fetch("http://127.0.0.1:4000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, message: "Database Error: failed to get users" };
  }
}

export async function deleteUser(id: number) {
  try {
    const response = await fetch(`http://127.0.0.1:4000/users/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();
    return result;
  } catch (error) {
    return { success: false, message: "Database Error: failed to delete user" };
  }
}
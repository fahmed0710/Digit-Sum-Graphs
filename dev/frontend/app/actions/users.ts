"use server"

import { editSession } from "./auth";

export async function getUsers() {
  try {
    const response = await fetch("http://digitsumgraphs.pythonanywhere.com/users", {
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

export async function editUser(id: Number, updatedUser: any) {
  try {
    const response = await fetch(`http://digitsumgraphs.pythonanywhere.com/users/edit/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedUser)
    });

    const result = await response.json();

    return result;
  } catch (error: any) {
    return { success: false, message: "Database Error: failed to edit user"};
  }
}

export async function deleteUser(id: number) {
  try {
    const response = await fetch(`http://digitsumgraphs.pythonanywhere.com/users/delete/${id}`, {
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
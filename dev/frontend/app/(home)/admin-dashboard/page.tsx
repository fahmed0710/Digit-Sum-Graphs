"use client"
import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from "@/app/actions/users";

interface User {
  id: number;
  username: string;
  email: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const result = await getUsers();
      if(result?.success) {
        setUsers(result.users);
        console.log("Success: ", result.message);
      } else {
        console.log("Fail: ", result.message);
      }
    }

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: number) => {
    const result = await deleteUser(id);
    if(result?.success) {
      console.log("User deleted successfully");
    } else {
      console.log("Fail: ", result.message);
    }
  }
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Users:</h2>
        <ul>
          {Array.isArray(users) ? (
            users.map(user => (
              <li key={user.id}>
                {user.username} - {user.email}
                <button onClick={() => handleDeleteUser(user.id)}>Delete user</button>
              </li>
            ))
          ) : (
            <li>No users found</li>
          )}
        </ul>
      </div>
    </div>
  )
}
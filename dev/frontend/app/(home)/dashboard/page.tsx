"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { getSession } from "@/app/actions/auth";
import { NavigationMenu } from "@/app/components/NavigationMenu";

export default function Dashboard() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function checkSession() {
      const retrievedSession = await getSession();
      if(retrievedSession) {
        setSession(retrievedSession);
        setUsername(retrievedSession.name);
      } else {
        setSession(null);
        router.push("/");
      }
    }

    checkSession();
  }, []);

  if (!session) {
    return null;
  }

  return (
    <div>
      <NavigationMenu />
      {username}
    </div>
  )
}
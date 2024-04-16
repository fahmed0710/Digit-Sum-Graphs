"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { getSession, login } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(true);
  
  useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if(session) {
        router.push("/dashboard");
      }
    }

    checkSession();
  }, [])


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await login(username, password);
    if(result.success) {
      setLoginSuccess(true);
      console.log("Login success.");
      router.push("/dashboard");
    } else {
      setLoginSuccess(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Log In</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Username</label>
            <div className="mt-2">
            <input id="username" name="username" type="username" autoComplete="username" placeholder="Username" required
                className="block w-full rounded-md border-0 p-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => { setUsername(e.target.value); }}></input>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div className="mt-2">
              <input id="password" name="password" type="password" placeholder="*******" required
                className="block w-full rounded-md border-0 p-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => { setPassword(e.target.value); }}></input>
            </div>
          </div>

          {!loginSuccess &&
            <div>
              <p>Login Unsuccessful! Invalid username or password.</p>
            </div>
          }

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
              >Log in</button>
          </div>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Not a user? 
          <a href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Create an account</a>
        </p>

        <p className="mt-5 text-center text-sm text-gray-500">
          <a href="/forgot-password" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Forgot password?</a>
        </p>
      </div>
    </div>
  )
}
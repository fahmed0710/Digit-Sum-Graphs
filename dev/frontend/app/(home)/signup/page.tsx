"use client"
import { useState } from "react"
import { signup } from "@/app/actions/auth"

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwMatch, setPWMatch] = useState(true);
  const [signupSuccess, setSignupSuccess] = useState(true)

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signup(username, email, password);
    if(result?.success) {
      setSignupSuccess(true);
      console.log("Success", result.message);
    } else {
      setSignupSuccess(false);
      console.log("Fail", result?.message);
    }
  };
  
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create an Account</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Username</label>
            <div className="mt-2">
              <input id="username" name="username" type="username" autoComplete="username" placeholder="Username" required
                className="block w-full rounded-md border-0 p-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => { setUsername(e.target.value) }}></input>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div className="mt-2">
              <input id="email" name="email" type="email" autoComplete="email" placeholder="name@email.com" required
                className="block w-full rounded-md border-0 p-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => { setEmail(e.target.value) }}></input>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div className="mt-2">
              <input id="password" name="password" type="password" placeholder="*******" required
                className="block w-full rounded-md border-0 p-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => { setPassword(e.target.value) }}></input>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>            <div className="mt-2">
            <input id="password" name="password" type="password" placeholder="*******" required
                className="block w-full rounded-md border-0 p-2.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
            </div>
          </div>

          <div>
            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600">Create account</button>
          </div>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?
          <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Log in</a>
        </p>
      </div>
    </div>
  )
}
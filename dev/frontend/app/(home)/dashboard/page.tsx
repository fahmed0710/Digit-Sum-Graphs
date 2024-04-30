"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { getSession } from "@/app/actions/auth";
import { deleteUser } from "@/app/actions/users";
import { NavigationMenu } from "@/app/components/NavigationMenu";
import { setTimeout } from "timers/promises";

export default function Dashboard() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [id, setId] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function checkSession() {
      const retrievedSession = await getSession();
      if(retrievedSession) {
        console.log(retrievedSession);
        setSession(retrievedSession);

        setId(retrievedSession.user.id);
        setUsername(retrievedSession.user.username);
        setEmail(retrievedSession.user.email);
      } else {
        setSession(null);
        router.push("/");
      }
    }

    checkSession();
  }, [session]);

  if(!session) {
    return null;
  }

  function showModal (modalName: string) {
    const modal = document.getElementById(modalName);
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  }

  function closeModal (modalName: string) {
    const modal = document.getElementById(modalName);
    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
  }

  const changeUsername = () => {
    closeModal("changeUsername");
  }

  const changeEmail = () => {
    closeModal("changeEmail");
  }

  const changePassword = () => {
    closeModal("changePassword");
  }

  const handleDelete = async () => {
    const result = await deleteUser(id);
    
    if(result?.success){
      console.log(result.message);
    }
  }

  return (
    <div className="mx-auto min-h-screen md:w-full lg:w-3/5 flex flex-col justify-center items-center overflow-auto">
      <NavigationMenu />
      
      <h1 className="py-6 font-bold text-xl text-center">Welcome, {username}!</h1>
      
      <div className="w-4/6 py-4 flex-col justify-center items-center">
        <h2 className="font-medium text-lg text-center">Settings</h2>
          
        
        <div className="py-1 grid grid-cols-3">
          <p className="text-left py-1 col-span-1">Username:</p>
          <p className="text-left py-1 col-span-1">{username}</p>
          <button onClick={() => {showModal("changeUsername")}} className="ml-auto px-2 py-1 rounded bg-blue-500 hover:bg-blue-400 text-sm text-white">Change</button>
        </div>

        <div className="py-1 grid grid-cols-3">
          <p className="text-left py-1">Email:</p>
          <p className="text-left py-1">{email}</p>
          <button onClick={() => {showModal("changeEmail")}} className="ml-auto px-2 py-1 rounded bg-blue-500 hover:bg-blue-400 text-sm text-white">Change</button>
        </div>
        
        <div className="py-1 grid grid-cols-3">
          <p className="text-left py-1">Password:</p>
          <p className="text-left py-1"></p>
          <button onClick={() => {showModal("changePassword")}} className="ml-auto px-2 py-1 rounded bg-blue-500 hover:bg-blue-400 text-sm text-white">Change</button>
        </div>
          
        <div className="py-4 gap-6 flex justify-center items-center">
          <button onClick={() => {showModal("deleteAccount")}} className="px-2 py-1 rounded bg-red-500 hover:bg-red-400 text-white">Delete Account</button>
        </div> 
      </div>

      <div className="py-4 flex-col justify-center items-center">
        <h2 className="font-medium text-lg text-center">Gameplays</h2>
        
        <div className="py-2 grid grid-cols-4">
          <p>ID</p>
          <p>Puzzle #</p>
          <p>Date</p>
          <p>Time to Complete</p>
        </div>
      </div>

      <dialog id="changeUsername" className="modal">
        <div className="modal-box border border-solid border-blue-500 flex flex-col">
          <form method="dialog" className="modal-action">
            <button className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>

          <p className="py-2 text-center text-lg font-bold">Change Username</p>

          <form className="mx-auto w-4/6 h-full py-2 space-y-4 flex flex-col items-center">
            <div className="grid grid-cols-2 w-5/6">
              <label className="text-sm text-left font-medium leading-6">Username</label>
              <p className="text-sm text-center">{username}</p>
            </div>

            <div>
              <label className="text-sm font-medium leading-6">New Username</label>
              <label className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input required type="text" placeholder="Username" className="text-sm leading-6"
                  />
              </label>
            </div>
          </form>

          <div className="py-2 flex justify-end gap-2">
            <button onClick={() => {closeModal("changeUsername")}} className="px-2 py-1 rounded bg-gray-500 hover:bg-gray-400 text-white">Cancel</button>
            <button onClick={changeUsername} className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-400 text-white">Change username</button>
          </div>
        </div>
      </dialog>

      <dialog id="changeEmail" className="modal">
        <div className="modal-box border border-solid border-blue-500 flex flex-col">
          <form method="dialog" className="modal-action">
            <button className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>

          <p className="py-2 text-center text-lg font-bold">Change Email</p>

          <form className="mx-auto w-4/6 h-full py-2 space-y-4 flex flex-col items-center">
            <div className="grid grid-cols-2 w-5/6">
              <label className="text-sm text-left font-medium leading-6">Email</label>
              <p className="text-sm text-center">{email}</p>
            </div>

            <div>
              <label className="text-sm font-medium leading-6">New Email</label>
              <label className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input required type="text" placeholder="Email" className="text-sm leading-6"
                      />
              </label>
            </div>
          </form>

          <div className="py-2 flex justify-end gap-2">
            <button onClick={() => {closeModal("changeEmail")}} className="px-2 py-1 rounded bg-gray-500 hover:bg-gray-400 text-white">Cancel</button>
            <button onClick={changeEmail} className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-400 text-white">Change email</button>
          </div>
        </div>
      </dialog>

      <dialog id="changePassword" className="modal">
        <div className="modal-box border border-solid border-blue-500 flex flex-col">
          <form method="dialog" className="modal-action">
            <button className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>

          <p className="py-2 text-center text-lg font-bold">Change Password</p>

          <form className="mx-auto w-4/6 h-full py-2 space-y-4 flex flex-col items-center">
            <div>
              <label className="text-sm font-medium leading-6">New Password</label>
              <label className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input required type="password" placeholder="********" className="text-sm leading-6"/>
              </label>
            </div>

            <div>
              <label className="text-sm font-medium leading-6">Confirm New Password</label>
              <label className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input required type="password" placeholder="********" className="text-sm leading-6"/>
              </label>
            </div>
          </form>

          <div className="py-2 flex justify-end gap-2">
            <button onClick={() => {closeModal("changePassword")}} className="px-2 py-1 rounded bg-gray-500 hover:bg-gray-400 text-white">Cancel</button>
            <button onClick={changePassword} className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-400 text-white">Change password</button>
          </div>
        </div>
      </dialog>

      <dialog id="deleteAccount" className="modal">
        <div className="modal-box border border-solid border-red-500 flex flex-col">
          <form method="dialog" className="modal-action">
            <button className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>

          <p className="py-2">
            <b>Are you sure you want to delete this account?</b> This account will not be able to be accessed again and any information associated with this account will be deleted permanently.
          </p>

          <div className="py-2 flex justify-end gap-2">
            <button onClick={() => {closeModal("deleteAccount")}} className="px-2 py-1 rounded bg-gray-500 hover:bg-gray-400 text-white">Cancel</button>
            <button className="px-2 py-1 rounded bg-red-500 hover:bg-red-400 text-white">Delete account</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
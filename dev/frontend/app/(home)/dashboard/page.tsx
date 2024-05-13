"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { logout, getSession, editSession } from "@/app/actions/auth";
import { editUser, deleteUser } from "@/app/actions/users";
import { getGameplaysForUser } from "@/app/actions/gameplays";
import { NavigationMenu } from "@/app/components/NavigationMenu";
import { setTimeout } from "timers";

interface Gameplay {
  gameplay_id: number,
  puzzle_id: number, 
  date_completed: string,
  completion_time: string
}

export default function Dashboard() {
  const router = useRouter();

  const [sessionCheck, setSessionCheck] = useState(false);
  const [session, setSession] = useState(null);
  const [id, setId] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gameplays, setGameplays] = useState<Gameplay[]>([]);

  const [error, setError] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newUsernameSuccess, setNewUsernameSuccess] = useState<boolean | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [newEmailSuccess, setNewEmailSuccess] = useState<boolean | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordSuccess, setNewPasswordSuccess] = useState<boolean | null>(null);
  const [newConfirmPassword, setNewConfirmPassword] = useState("");

  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null);

  // check session dependency
  useEffect(() => {
    async function checkSession() {
      const retrievedSession = await getSession();
      if(retrievedSession) {
        if(retrievedSession.user.user_type !== "user") {
          setSession(null);
          router.push("/");
        } 

        setSession(retrievedSession);
        
        setId(retrievedSession.user.user_id);
        setUsername(retrievedSession.user.username);
        setEmail(retrievedSession.user.email);

        const gameplays = await getGameplaysForUser(retrievedSession.user.user_id);
        if(gameplays.success) {
          setGameplays(gameplays.result);
        }
      } else {
        setSession(null);
        router.push("/");
      }
    }

    checkSession();
  }, [router]);

  if(!session) {
    return null;
  }

  function showModal (modalName: string) {
    const modal = document.getElementById(modalName);
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  }

  function closeModal (modalName: string, setStateFunction: (value: React.SetStateAction<boolean | null>) => void) {
    const modal = document.getElementById(modalName);
    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
    
    setStateFunction(null);
  }

  function formatDateString(dateString: string) {
    const dateObj = new Date(dateString);
    const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getFullYear()}`;
  
    return formattedDate;
  }
  
  const changeUsername = async () => {
    if(newUsername.trim().length <= 1) {
      setNewUsernameSuccess(false);
      setError("Username must be at least 2 characters long.");
    } else {
      const result = await editUser(id, {'username': newUsername});

      if(result.success) {
        setNewUsernameSuccess(true);

        await editSession(result.result);
        
        setTimeout(() => {
          closeModal("changeUsername", setNewUsernameSuccess);
        }, 900);

        setTimeout(() => {
          window.location.reload();
        },1200);
      } else {
        setNewUsernameSuccess(false);
        setError(result.message);
      }
    }
  }

  const changeEmail = async () => {
    if(newEmail.trim().length <= 1) {
      setNewEmailSuccess(false);
      setError("Enter a valid email.");
    } else {
      const result = await editUser(id, {'email': newEmail});

      if(result.success) {
        setNewEmailSuccess(true);

        await editSession(result.result);
        
        setTimeout(() => {
          closeModal("changeEmail", setNewEmailSuccess);
        }, 900);

        setTimeout(() => {
          window.location.reload();
        },1200);
      } else {
        setNewEmailSuccess(false);
        setError(result.message);
      }
    }
  }

  const changePassword = async () => {
    if(newPassword.trim().length < 6) {
      setNewPasswordSuccess(false);
      setError("Password must be at least 6 characters.");
    } else if(newPassword !== newConfirmPassword) {
      setNewPasswordSuccess(false);
      setError("Passwords don't match.");
    } else {
      const result = await editUser(id, {'password': newPassword});

      if(result.success) {
        setNewPasswordSuccess(true);

        await editSession(result.result);
        
        setTimeout(() => {
          closeModal("changePassword", setNewPasswordSuccess);
        }, 900);

        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setNewPasswordSuccess(false);
        setError(result.message);
      }
    }
  }

  const handleDelete = async () => {
    const result = await deleteUser(id);
    console.log(result);
    if(result?.success){
      setDeleteSuccess(true);

      setTimeout(async () => {
        closeModal("deleteAccount", setDeleteSuccess);
        await logout();
      }, 900); 
  
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else {
      setDeleteSuccess(false);
      setError("Error occurred while trying to delete user.");
    }
  }

  return (
    <div className="mx-auto min-h-screen md:w-full lg:w-3/5 flex flex-col items-center overflow-auto">
      <NavigationMenu />

      <h1 className="py-6 font-bold text-xl text-center">Welcome, {username}!</h1>
      
      <div className="w-4/6 py-4 flex-col justify-center items-center">
        <h2 className="font-medium text-lg text-center">Account Settings</h2>
          
        
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
          <p className="text-left py-1">{":)"}</p>
          <button onClick={() => {showModal("changePassword")}} className="ml-auto px-2 py-1 rounded bg-blue-500 hover:bg-blue-400 text-sm text-white">Change</button>
        </div>
          
        <div className="py-4 gap-6 flex justify-center items-center">
          <button onClick={() => {showModal("deleteAccount")}} className="px-2 py-1 rounded bg-red-500 hover:bg-red-400 text-white">Delete Account</button>
        </div> 
      </div>

      <div className="w-5/6 h-auto py-4 flex-col justify-center items-center">
        <h2 className="font-medium text-lg text-center">Gameplays</h2>
        
        {gameplays.length != 0 
          ?
            (<div className="py-2 grid grid-cols-3 overflow-y-auto">
              <p className="text-center">Graph #</p>
              <p className="text-center">Date</p>
              <p className="text-center">Time to Complete</p>
              
              {gameplays.map((gameplay) => (
                <React.Fragment key={gameplay.gameplay_id}>
                  <p className="py-2 text-center">{gameplay.puzzle_id}</p>
                  <p className="py-2 text-center">{formatDateString(gameplay.date_completed)}</p>
                  <p className="py-2 text-center">{gameplay.completion_time}</p>
                </React.Fragment>
              ))}
            </div>)
          : <div className="py-2 text-md text-center">You have not played any games!</div>
        }
      </div>
      
      <dialog id="changeUsername" className="modal">
        <div className="max-w-sm modal-box border border-solid border-blue-500 flex flex-col">
          <form method="dialog" className="modal-action">
            <button onClick={() => {closeModal("changeUsername", setNewUsernameSuccess)}} className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>

          <p className="py-1 text-center text-lg font-bold">Change Username</p>

          <form className="mx-auto w-4/6 h-full py-2 space-y-4 flex flex-col items-center">
            {newUsernameSuccess !== null && newUsernameSuccess
              ?
                <div className="w-full p-2 flex justify-center items-center rounded-md bg-green-100">
                  <p className="text-sm text-center">Username changed successfully!</p>
                </div>
              : newUsernameSuccess !== null && !newUsernameSuccess
              ?
                <div className="w-full p-2 flex justify-center items-center rounded-md bg-red-200">
                  <p className="text-sm text-center">{error}</p>
                </div>
              : <div className="bg-white"></div>
            }
            
            <div className="w-full grid grid-cols-2">
              <label className="text-sm text-left font-medium leading-6">Username</label>
              <p className="text-sm text-right">{username}</p>
            </div>

            <div className="w-full">
              <label className="text-sm font-medium leading-6">New Username</label>
              <div className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input required type="text" placeholder="Username" className="text-sm leading-6 w-full"
                  onChange={(e) => {setNewUsername(e.target.value)} }/>
                </div>
            </div>
          </form>

          <div className="py-2 flex justify-center gap-2">
            <button onClick={changeUsername} className="w-4/6 py-1 rounded bg-blue-500 hover:bg-blue-400 text-white">Change username</button>
          </div>
        </div>
      </dialog>

      <dialog id="changeEmail" className="modal">
        <div className="max-w-sm modal-box border border-solid border-blue-500 flex flex-col">
          <form method="dialog" className="modal-action">
            <button onClick={() => {closeModal("changeEmail", setNewEmailSuccess)}} className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>

          <p className="py-1 text-center text-lg font-bold">Change Email</p>

          <form className="mx-auto w-4/6 py-2 space-y-4 flex flex-col items-center">
            {newEmailSuccess !== null && newEmailSuccess
              ?
                <div className="w-full p-2 flex justify-center items-center rounded-md bg-green-100">
                  <p className="text-sm text-center">Email changed successfully!</p>
                </div>
              : newEmailSuccess !== null && !newEmailSuccess
              ?
                <div className="w-full p-2 flex justify-center items-center rounded-md bg-red-200">
                  <p className="text-sm text-center">{error}</p>
                </div>
              : <div className="bg-white"></div>
            }

            <div className="grid grid-cols-2">
              <label className="text-sm text-left font-medium leading-6">Email</label>
              <p className="text-sm text-right">{email}</p>
            </div>

            <div className="w-full">
              <label className="text-sm font-medium leading-6">New Email</label>
              <div className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input required type="text" placeholder="Email" className="text-sm leading-6 w-full"
                  onChange={(e) => {setNewEmail(e.target.value)} }/>
              </div>
            </div>
          </form>

          <div className="py-2 flex justify-center gap-2">
            <button onClick={changeEmail} className="w-4/6 py-1 rounded bg-blue-500 hover:bg-blue-400 text-white">Change email</button>
          </div>
        </div>
      </dialog>

      <dialog id="changePassword" className="modal">
        <div className="max-w-sm modal-box border border-solid border-blue-500 flex flex-col">
          <form method="dialog" className="modal-action">
            <button onClick={() => {closeModal("changePassword", setNewPasswordSuccess)}} className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>

          <p className="py-1 text-center text-lg font-bold">Change Password</p>

          <form className="mx-auto w-4/6 h-full py-2 space-y-4 flex flex-col items-center">
            {newPasswordSuccess !== null && newPasswordSuccess
              ?
                <div className="w-full p-2 flex justify-center items-center rounded-md bg-green-100">
                  <p className="text-sm text-center">Password changed successfully!</p>
                </div>
              : newPasswordSuccess !== null && !newPasswordSuccess
              ?
                <div className="w-full p-2 flex justify-center items-center rounded-md bg-red-200">
                  <p className="text-sm text-center">{error}</p>
                </div>
              : <div className="bg-white"></div>
            }

            <div className="w-full">
              <label className="text-sm font-medium leading-6">New Password</label>
              <div className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input required type="password" placeholder="********" className="text-sm leading-6 w-full"
                  onChange={(e) => {setNewPassword(e.target.value)} }/>
              </div>
            </div>

            <div className="w-full">
              <label className="text-sm font-medium leading-6">Confirm New Password</label>
              <div className="input input-bordered flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input required type="password" placeholder="********" className="text-sm leading-6 w-full"
                  onChange={(e) => {setNewConfirmPassword(e.target.value)} }/>
              </div>
            </div>
          </form>

          <div className="py-2 flex justify-center gap-2">
            <button onClick={changePassword} className="w-4/6 py-1 rounded bg-blue-500 hover:bg-blue-400 text-white">Change password</button>
          </div>
        </div>
      </dialog>

      <dialog id="deleteAccount" className="modal">
        <div className="modal-box border border-solid border-red-500 flex flex-col">
          <form method="dialog" className="modal-action">
            <button onClick={() => {closeModal("deleteAccount", setDeleteSuccess)}} className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
          
          {deleteSuccess !== null && deleteSuccess
            ?
              <div className="p-2">
                <p className="text-sm text-center text-green-500">Account deleted successfully!</p>
              </div>
            : deleteSuccess !== null && !deleteSuccess
            ?
              <div className="p-2">
                  <p className="text-sm text-center text-red-500">{error}</p>
                </div>
            : 
              <div>
                <p className="py-2">
                  <b>Are you sure you want to delete this account?</b> This account will not be able to be accessed again and any information associated with this account will be deleted permanently.
                </p>

                <div className="py-2 flex justify-end gap-2">
                  <button onClick={() => {closeModal("deleteAccount", setDeleteSuccess)}} className="px-2 py-1 rounded bg-gray-500 hover:bg-gray-400 text-white">Cancel</button>
                  <button onClick={handleDelete} className="px-2 py-1 rounded bg-red-500 hover:bg-red-400 text-white">Delete account</button>
                </div>
              </div>
            }
        </div>
      </dialog>
    </div>
  )
}
"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { getSession, login, signup, logout } from "@/app/actions/auth";

export function NavigationMenu() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [accountAction, setAccountAction] = useState("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState<boolean | null>(null);

  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState<boolean | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSession() {
      const retrievedSession = await getSession();
      if(retrievedSession) {
        setLoggedIn(true);
        setSession(retrievedSession);
        setUserType(retrievedSession.user.user_type);
      } else {
        setLoggedIn(false);
        setSession(null);
        setUserType("");
      }
    }

    checkSession();
  }, [loggedIn]);

  useEffect(() => {
    setLoginSuccess(null);
    setSignupSuccess(null);
  }, [accountAction])

  function handleClick(route: string) {
    const modal = document.getElementById(route);
    if (modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };

  function isStrEmpty(str: string) {
    return str.trim() == "";
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(isStrEmpty(username) || isStrEmpty(password)) {
      setLoginSuccess(false);
      setError("No field can be left blank.")
      return;
    } else {
      const result = await login(username, password);
    
      if(result.success) {
        setLoggedIn(true);
        setLoginSuccess(true);
      
        setTimeout(() => {
          const modal = document.getElementById("account");
          if (modal instanceof HTMLDialogElement) {
            modal.close();
          }
        }, 500);
      } else {
        setLoggedIn(false);
        setLoginSuccess(false);
        setError("Login unsuccessful! Invalid username or password.");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if(isStrEmpty(username) || isStrEmpty(email) || isStrEmpty(password)) {
      setSignupSuccess(false);
      setError("No field can be left blank.")
      return;
    } else if(username.trim().length <= 1 || email.trim().length <=1) {
      setSignupSuccess(false);
      setError("Make sure fields are made up of actual characters.")
    } else if(password.length < 6) {
      setSignupSuccess(false);
      setError("Password must be at least 6 characters long.");
      return;
    } else if(password != confirmPassword) {
      setSignupSuccess(false);
      setError("Passwords don't match.");
      return;
    } 

    const result = await signup("user", username, email, password);
    
    if(result?.success) {
      setSignupSuccess(true);

      const result = await login(username, password);
    
      if(result.success) {
        setLoggedIn(true);
        setLoginSuccess(true);
        
        setTimeout(() => {
          const modal = document.getElementById("account");
          if (modal instanceof HTMLDialogElement) {
            modal.close();
          }
        }, 500);
      } else {
        console.log(result.message);
      }
    } else {
      setSignupSuccess(false);
      setError("Signup unsuccessful! Account with provided username/email already exists.")
    }
  };

  const handleLogout = async() => {
    await logout();
    setLoginSuccess(null);
    setSignupSuccess(null);
    setLoggedIn(false);

    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  const handleCloseModal = () => {
    setLoginSuccess(null);
    setSignupSuccess(null);
  }

  const handleDashboardRouting = () => {
    if(userType == "admin") {
      router.push("/admin");
    } else if(userType == "user") {
      router.push("/dashboard");
    }
  }

  return (
    <div className="navbar">
      <div className="absolute top-4 right-4 px-2 flex flex-1 justify-end">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost">Menu</div>
          <ul tabIndex={0} className="menu dropdown-content text-end z-[1] p-2 shadow bg-base-100 rounded-box w-min">
            <li><a onClick={() => router.push("/")}>Home</a></li>
            <li>{loggedIn ? <a onClick={ handleDashboardRouting }>Dashboard</a> : <a onClick={() => {handleClick("account"); setAccountAction("login")}}>Login</a>}</li>
            <li><a onClick={() => router.push("/graph")}>Game</a></li>
            {loggedIn && <li><a onClick={ handleLogout }>Log out</a></li>}
          </ul>
        </div>
      </div>

      <dialog id="account" className="modal w-xs h-full">
        <div className="modal-box border border-solid flex-col">
          <form method="dialog" className="modal-action">
            <button onClick={ handleCloseModal } className="absolute top-4 right-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </form>
          
          <div>
            {accountAction === "login" ? (
              <div>
                <p className="py-2 text-center text-lg font-bold">Log In</p>

                <form className="mx-auto w-4/6 h-full space-y-4 flex flex-col items-center" onSubmit={ handleLogin }>
                  {loginSuccess !== null && loginSuccess
                   ?
                    <div className="w-5/6 p-2 flex justify-center items-center rounded-md bg-green-100">
                      <p className="text-sm text-center">Login success!</p>
                    </div>
                   : loginSuccess !== null && !loginSuccess
                   ?
                    <div className="w-5/6 p-2 flex justify-center items-center rounded-md bg-red-200">
                      <p className="text-sm text-center">{error}</p>
                    </div>
                    : <div className="bg-white"></div>
                  }
                  
                  <div>
                    <label className="text-sm font-medium leading-6">Username</label>
                    <label className="input input-bordered flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                      </svg>
                      <input required name="usernameInput" type="text" placeholder="Username" className="text-sm leading-6"
                        onChange={(e) => { setUsername(e.target.value); }}/>
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium leading-6">Password</label>
                    <label className="input input-bordered flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                        <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                      </svg>
                      <input required name="passwordInput" type="password" placeholder="********" className="text-sm leading-6" 
                        onChange={(e) => { setPassword(e.target.value); }}/>
                    </label>
                  </div>

                  <button type="submit" className="w-5/6 py-2 flex justify-center items-center rounded bg-pink-500 hover:bg-pink-400 text-white">
                    Log In
                  </button>
                </form>
                
                <p className="mt-5 text-sm text-center text-gray-500">
                  Not a user? {" "}
                  <a onClick={() => { setAccountAction("signup") }} className="link link-hover font-semibold leading-6 text-pink-600 hover:text-pink-500">Create an account</a>
                </p> 
              </div>
            ) : accountAction === "signup" ? (
              <div>
                <p className="py-2 text-center text-lg font-bold">Create Account</p>

                <form className="mx-auto w-4/6 h-full space-y-4 flex flex-col items-center" onSubmit={handleSignup}>
                  {signupSuccess !== null && signupSuccess
                   ?
                    <div className="w-5/6 p-2 flex justify-center items-center rounded-md bg-green-100">
                      <p className="text-sm text-center">Account created successfully!</p>
                    </div>
                   : signupSuccess !== null && !signupSuccess
                   ?
                    <div className="w-5/6 p-2 flex justify-center items-center rounded-md bg-red-200">
                      <p className="text-sm text-center">{error}</p>
                    </div>
                    : <div className="bg-white"></div>
                  }

                  <div>
                    <label className="text-sm font-medium leading-6">Username</label>
                    <label className="input input-bordered flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                      </svg>
                      <input required name="usernameInput" type="text" placeholder="Username" className="text-sm leading-6"
                        onChange={(e) => { setUsername(e.target.value); }}/>
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium leading-6">Email</label>
                    <label className="input input-bordered flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                        <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                      </svg>
                      <input required name="emailInput" type="text" placeholder="Email" className="text-sm leading-6"
                        onChange={(e) => { setEmail(e.target.value); }}/>
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium leading-6">Password</label>
                    <label className="input input-bordered flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                        <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                      </svg>
                      <input required name="passwordInput" type="password" placeholder="********" className="text-sm leading-6" 
                        onChange={(e) => { setPassword(e.target.value); }}/>
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium leading-6">Confirm Password</label>
                    <label className="input input-bordered flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                        <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                      </svg>
                      <input required name="confirmPasswordInput" type="password" placeholder="********" className="text-sm leading-6" 
                        onChange={(e) => { setConfirmPassword(e.target.value); }}/>
                    </label>
                  </div>

                  <button type="submit" className="w-5/6 py-2 rounded bg-pink-500 hover:bg-pink-400 text-white">Create Account</button>
                </form>
                
                <p className="mt-5 text-sm text-center text-gray-500">
                  Already have an account? {" "}
                  <a onClick={() => setAccountAction("login")} className="link link-hover font-semibold leading-6 text-pink-600 hover:text-pink-500">Log in</a>
                </p> 
              </div>
            ) : (
              <div>Currently experiencing an error, please try again!</div>
            )}
          </div>
        </div>
      </dialog>
    </div>
  )
}
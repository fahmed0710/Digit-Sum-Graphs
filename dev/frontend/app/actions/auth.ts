"use server"
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from 'jose';

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(username: string, password: string) {
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

    const userId = result.result['user_id'];
    const expires = new Date(Date.now() + 3600000);
    const session = await encrypt({ userId, expires });
    cookies().set('session', session, {expires, httpOnly: true });

    return result;
  } catch (error) {
    return { success: false, message: "Database Error: failed to login user" };
  }
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;

  try {
    const payload = await decrypt(session);
    const expirationTime = new Date(payload.exp * 1000);
    if (expirationTime < new Date()) {
      return null;
    }
    return payload;
  } catch (error) {
    return null;    
  }
}

export async function signup(username: String, email: String, password: String): Promise<{ success: boolean, message: string }> {
  try {
    const newUser = {
      username: username,
      email: email,
      password: password
    }

    const response = await fetch("http://127.0.0.1:4000/users/add", {
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
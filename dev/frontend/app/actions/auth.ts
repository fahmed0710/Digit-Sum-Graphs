"use server"
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from 'jose';

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
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
    const name = result.result['username'];
    
    const expires = new Date(Date.now() + 3600000);
    const session = await encrypt({ name, userId, expires });
    cookies().set('session', session, {expires, httpOnly: true });

    return result;
  } catch (error) {
    return { success: false, message: "Database Error: failed to login user" };
  }
}

export async function logout() {
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 3600 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
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
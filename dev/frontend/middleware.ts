import { NextRequest } from "next/server";
import { updateSession } from "./app/actions/auth";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
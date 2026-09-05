 "use server";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
export async function getCurrentUser(){const session=await getSession();if(!session)return null;await connectDB();return session;}

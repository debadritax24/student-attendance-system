import { NextResponse } from "next/server";
export const runtime="nodejs";
export async function POST(){const r=NextResponse.json({success:true});r.cookies.set("attendify_token","",{httpOnly:true,maxAge:0,path:"/"});return r;}
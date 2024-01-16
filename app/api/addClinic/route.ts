import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { ProductWithPrice } from "@/types";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabaseAdmin";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const reqData = await req.json();
    const { name, email, password, intialMessage } = reqData;

    
    // const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);

    const {data, error} = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
      })
    //   data.user.id
    console.log(data.user?.id)

    if (error) {
      console.error("Error deleting manager from auth:", error.message);
    } else {
      console.log("Added new user");
      return NextResponse.json({data});
    }
  }
}
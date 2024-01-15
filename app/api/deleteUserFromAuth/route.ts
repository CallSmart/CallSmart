import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { ProductWithPrice } from "@/types";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/supabaseAdmin";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const { reqData } = await req.json();
    console.log("reqData", reqData, typeof reqData);
    const id = reqData.deletedUserID;
    console.log("id", id, typeof id);

    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      console.error("Error deleting user from auth:", error.message);
    } else {
      console.log("Successfully deleted User from auth");
      return new NextResponse("Successfully deleted user from auth", {
        status: 200,
      });
    }
  }
}

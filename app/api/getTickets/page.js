import { createRouteHandlerClient, createRouteHandlerServer } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export default async function POST(request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data: tickets, error: ticketsError } = await supabase
    .from("tickets")
    .select("*")
    // .in("clinic", clinicIds)
    .eq("information_recieved", true)
    .filter(
      "time",
      "gte",
      new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
    );

  if (ticketsError) {
    console.error("Error fetching tickets:", ticketsError);
    return NextResponse.json({ error: ticketsError.message });
  }

  console.log(tickets);
  const tickets2 = tickets || []
  // res.status(200).json({tickets});
  return NextResponse.json({ tickets });
}

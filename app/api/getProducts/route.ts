import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { ProductWithPrice } from "@/types";
import { NextResponse } from "next/server";

const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
}


export async function GET(
    request: Request
  ) {
    // console.log('in get function')
    try {
      const products = await getActiveProductsWithPrices();
    //   console.log('the products', products)
      return NextResponse.json({ products: products });
    } catch (err: any) {
      console.log(err);
      return new NextResponse('Internal Error', { status: 500 });
    }
  }
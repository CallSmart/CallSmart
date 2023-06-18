"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import { useUser } from "@/hooks/useUser";
import { getURL } from "@/libs/helpers";
import { postData } from '@/libs/helpers';
import { getStripe } from '@/libs/stripeClient';

const Tier1Page = async () => {
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const { user, isLoading, subscription } = useUser();
  const url = getURL();
  
  const getProducts = async () => {
    const res = await fetch(url+'/api/getProducts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.log('Error in postData', { res });
      throw Error(res.statusText);
    }
    
    return res.json();
  };
  
  const formatPrice = (price: any) => {
    const priceString = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency,
      minimumFractionDigits: 0
    }).format((price?.unit_amount || 0) / 100);
  
    return priceString;
  };
  
  const handleCheckout = async (price: any) => {
    if (!price) {
      return toast.error('No price found');
    } else {
      setPriceIdLoading(price.id);
  
      if (!user) {
        setPriceIdLoading(undefined);
        return toast.error('Must be logged in');
      }
  
      if (subscription) {
        setPriceIdLoading(undefined);
        return toast('Already subscribed');
      }
  
      try {
        const { sessionId } = await postData({
          url: '/api/create-checkout-session',
          data: { price }
        });
  
        const stripe = await getStripe();
        stripe?.redirectToCheckout({ sessionId });
      } catch (error) {
        return toast.error((error as Error)?.message);
      } finally {
        setPriceIdLoading(undefined);
      }
    }
  };
  
  const fetchProducts = async () => {
    try {
      const {products} = await getProducts();
      console.log(products);
      return products;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  const products = await fetchProducts();
  
  return (
    <div>
      <div>
        {Array.isArray(products) && products.length > 0 ? (
            products.map((product: any) => {
              if (!product.prices?.length) {
                return (
                  <div key={product.id}>
                    No prices available
                  </div>
                );
              }
            
              return product.prices.map((price: any) => (
                <Button
                  key={price.id}
                  onClick={() => handleCheckout(price)}
                  disabled={isLoading || price.id === priceIdLoading}
                  className="mb-4"
                >
                  {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
                </Button>
              ));
              })
        ) : (
            <div>
                No products available
            </div>
        )}
      </div>
    </div>
  );
};

export default Tier1Page;

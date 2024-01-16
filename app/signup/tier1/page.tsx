"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/Button";
import { useUser } from "@/hooks/useUser";
import { getURL } from "@/libs/helpers";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";

const Tier1Page = async () => {
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const [products, setProducts] = useState<any>([]);
  const { user, isLoading, subscription } = useUser();
  
  console.log(user);
  console.log(isLoading);
  console.log(subscription);
  const url = getURL();

  const getProducts = async () => {
    const res = await fetch(url + "/api/getProducts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.log("Error in postData", { res });
      throw Error(res.statusText);
    }

    return res.json();
  };

  const formatPrice = (price: any) => {
    const priceString = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency,
      minimumFractionDigits: 0,
    }).format((price?.unit_amount || 0) / 100);

    return priceString;
  };

  const handleCheckout = async (price: any) => {
    console.log("handleCheckout");
    if (!price) {
      return toast.error("No price found");
    } else {
      setPriceIdLoading(price.id);
      console.log("handleCheckout user");
      if (!user) {
        setPriceIdLoading(undefined);
        return toast.error("Must be logged in");
      }
      console.log("handleCheckout subscription");
      if (subscription) {
        setPriceIdLoading(undefined);
        return toast("Already subscribed");
      }
      console.log("handleCheckout try");
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(url + "/api/create-checkout-session", {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }),
          credentials: "same-origin",
          body: JSON.stringify({ price }),
        });

        const sessionId = await res.json();
        console.log(sessionId);
        console.log(sessionId.sessionId);
        const stripe = await getStripe();
        console.log(stripe);
        console.log("REDIRECTING TO CHECKOUT");
        if (!stripe) return toast.error("Stripe not found");
        stripe.redirectToCheckout({ sessionId: sessionId.sessionId });
        console.log("stripe?.redirectToCheckout({ sessionId })");
      } catch (error) {
        return toast.error((error as Error)?.message);
      } finally {
        setPriceIdLoading(undefined);
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const { products } = await getProducts();
      console.log(products);
      return products;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // const products = await fetchProducts(); //might this be your loop?
  useEffect(() => {
    const getProducts = async () => {
      const { products } = await fetchProducts();
      console.log(products);
      setProducts(products);
    };
    getProducts();
  }, []);

  return (
    <div>
      <div>
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product: any) => {
            if (!product.prices?.length) {
              return <div key={product.id}>No prices available</div>;
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
          <div>No products available</div>
        )}
      </div>
    </div>
  );
};

export default Tier1Page;

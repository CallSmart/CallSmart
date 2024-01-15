'use client'
import React, { useState } from 'react';
import ProductNavBar from "@/components/ProductNavBar";
import { supabase } from "../../../supabase"; // Uncomment if supabase is used
import { redirect } from 'next/dist/server/api-utils';

function Page() {
    const [pswd, setPswd] = useState("");

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPswd(event.target.value);
    }

    const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(pswd); // For demonstration, replace with your function
        // Add your logic to handle password submission
        await supabase.auth.updateUser({ password: pswd })
        alert('You may now log in')
    }

    return (
        <ProductNavBar>
            <div>reset password</div>
            <form onSubmit={handlePasswordSubmit}>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Enter Password" 
                    value={pswd} 
                    onChange={handlePasswordChange} 
                />
                <button type="submit">Submit</button>
            </form>
        </ProductNavBar>
    );
}

export default Page;

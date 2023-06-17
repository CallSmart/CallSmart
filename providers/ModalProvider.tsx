"use client";

import AuthModal from "@/components/AuthModal";
import SubscribeModal from "@/components/subscribeModal";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";


const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    
    
    useEffect(() => {
      setIsMounted(true);
    }, []);

    if(!isMounted) return null;

    return (
        <>
            <AuthModal />
            {/* <SubscribeModal /> */}
        </>
    )
}


export default ModalProvider;
    
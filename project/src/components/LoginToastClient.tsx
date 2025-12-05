"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function LoginToastClient() {
    const params = useSearchParams();
    const loggedIn = params.get("loggedIn");
    console.log(params)

    useEffect(() => {
        if (loggedIn) {
            toast.success("Successfully logged in!");
        }
    }, [loggedIn]);

    return null;
}

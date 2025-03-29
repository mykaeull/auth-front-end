"use client";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider({ children }: { children: ReactNode }) {
    return (
        <>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                theme="dark"
                toastStyle={{
                    backgroundColor: "#212121",
                    color: "#ffffff",
                    fontWeight: 500,
                }}
            />
        </>
    );
}

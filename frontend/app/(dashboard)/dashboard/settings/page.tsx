"use client";

import React from "react";  

import UpdateUserCard from "./update-user-card";
import DeleteAccountCard from "./delete-account-card";
import SetThemeCard from "./set-theme-card";

export default function Settings() {
    return (
        <div className="container mx-auto py-10 px-5">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* User Details */}
                <UpdateUserCard />
                <div className="flex flex-col gap-6 w-full lg:w-1/3">
                    {/* Set Theme */}
                    <SetThemeCard />
                    {/* Delete Account */}
                    <DeleteAccountCard />
                </div>
            </div>
        </div>
    )
}
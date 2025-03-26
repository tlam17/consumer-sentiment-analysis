"use client";

import React from "react";  

import UpdateUserCard from "./update-user-card";

export default function Settings() {
    return (
        <div className="container mx-auto py-10 px-5">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* User Details */}
                <UpdateUserCard />
            </div>
        </div>
    )
}
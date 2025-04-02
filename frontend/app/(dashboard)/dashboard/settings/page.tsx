"use client";

import React from "react";

import UpdateUserCard from "./update-user-card";
import DeleteAccountCard from "./delete-account-card";
import SetThemeCard from "./set-theme-card";

export default function Settings() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-screen-lg">
        {/* User Details */}
        <UpdateUserCard />

        {/* Sidebar Settings */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3">
          <SetThemeCard />
          <DeleteAccountCard />
        </div>
      </div>
    </div>
  );
}

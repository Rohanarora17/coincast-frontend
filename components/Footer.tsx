"use client";

import React from "react";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

export const Footer = () => {
  return (
    <div className="bg-white border-t border-gray-100 py-6 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-sm text-gray-600">Secure & Audited</span>
          </div>
          <div className="flex items-center">
            <img src="/base-icon.svg" alt="Base Network" className="h-5 w-5 mr-2" />
            <span className="text-sm text-gray-600">Base Network</span>
          </div>
          <div className="flex items-center">
            <img src="/zora-icon.svg" alt="Zora" className="h-5 w-5 mr-2" />
            <span className="text-sm text-gray-600">Zora</span>
          </div>
        </div>
      </div>
    </div>
  );
};
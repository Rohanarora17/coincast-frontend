"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, Square2StackIcon } from "@heroicons/react/24/outline";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "How It Works",
    href: "/how-it-works",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "text-indigo-600 font-medium" : "text-gray-600"
              } hover:text-indigo-600 py-1.5 px-3 text-sm`}
            >
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center space-x-2">
        <Square2StackIcon className="h-6 w-6 text-indigo-600" />
        <span className="font-bold text-lg sm:text-xl text-gray-800">Token Reward Splitter</span>
      </div>
      
      <div className="flex items-center">
        <div className="hidden md:flex items-center space-x-4 mr-4">
          <ul className="flex space-x-2">
            <HeaderMenuLinks />
          </ul>
        </div>
        
        <RainbowKitCustomConnectButton />
        
        <div className="md:hidden dropdown ml-2" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-6 w-6" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 right-0"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
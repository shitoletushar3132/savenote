"use client";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Header = ({
  searchValue,
  setSearchValue,
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  return (
    <div className="p-4 shadow-md bg-white">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-bold text-gray-800 w-10">
          <img src="/logo.png" alt="Logo" className="rounded-lg" />
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 px-2">
          {/* Added flex-1 to ensure the search bar expands */}
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setShowSearch(false)}
            className={`px-4 py-2 rounded-lg border border-gray-300 w-24 transition-all duration-300 ease-in-out ${
              showSearch ? "w-64" : "w-32"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-1/2`} // Full width on medium screens and larger
          />
        </div>

        {/* Profile Icon and Dropdown */}
        {!showSearch && (
          <div className="relative">
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="cursor-pointer text-gray-600 hover:text-gray-900 w-10 rounded-lg ml-4" // Added ml-4 to provide spacing
            >
              <img
                src={session?.user?.image || "/default-avatar.png"}
                alt="User Avatar"
                className="rounded-full"
              />
            </div>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50 ${
                showMenu ? "block" : "hidden"
              }`}
            >
              {session ? (
                <div
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => signOut()}
                >
                  Sign Out
                </div>
              ) : (
                <div
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => signIn()}
                >
                  Sign In
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

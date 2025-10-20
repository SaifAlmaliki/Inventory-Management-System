"use client";

import { useAppSelector } from "@/app/redux";
import { useUser, useClerk } from "@clerk/nextjs";
import { ShoppingCart, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type HeaderProps = {
  name: string;
};

const Header = ({ name }: HeaderProps) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);
  const userRole = useAppSelector((state) => state.user.role);

  const handleSignOut = () => {
    signOut();
    router.push("/sign-in");
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-700">{name}</h1>
      
      <div className="flex items-center space-x-4">
        {/* Cart Icon (only for customers) */}
        {userRole === "CUSTOMER" && (
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600">
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        )}

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {userRole?.toLowerCase()}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href="/profile" className="p-2 text-gray-600 hover:text-blue-600">
              <User className="w-5 h-5" />
            </Link>
            
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:text-red-600"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

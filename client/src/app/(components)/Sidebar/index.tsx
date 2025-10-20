"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { UserRole } from "@/state/api";
import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  SlidersHorizontal,
  User,
  ShoppingCart,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Home,
  Search,
  Store,
  Shield,
  FileText,
  Car,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
        }
        hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
          isActive ? "bg-blue-200 text-white" : ""
        }
      }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />

        <span
          className={`${
            isCollapsed ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const userRole = useAppSelector((state) => state.user.role);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  // Define navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { href: "/dashboard", icon: Layout, label: "Dashboard" },
    ];

    switch (userRole) {
      case UserRole.CUSTOMER:
        return [
          ...commonItems,
          { href: "/marketplace", icon: Search, label: "Marketplace" },
          { href: "/cart", icon: ShoppingCart, label: "Cart" },
          { href: "/orders", icon: ShoppingBag, label: "My Orders" },
          { href: "/profile", icon: User, label: "Profile" },
        ];
      
      case UserRole.DEALER:
        return [
          ...commonItems,
          { href: "/products", icon: Package, label: "My Products" },
          { href: "/orders", icon: ShoppingBag, label: "Orders" },
          { href: "/inventory", icon: Archive, label: "Inventory" },
          { href: "/expenses", icon: CircleDollarSign, label: "Expenses" },
          { href: "/profile", icon: User, label: "Profile" },
        ];
      
      case UserRole.ADMIN:
        return [
          ...commonItems,
          { href: "/admin/dealers", icon: Store, label: "Dealers" },
          { href: "/admin/products", icon: Package, label: "Products" },
          { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
          { href: "/admin/users", icon: Users, label: "Users" },
          { href: "/admin/categories", icon: FileText, label: "Categories" },
          { href: "/admin/car-models", icon: Car, label: "Car Models" },
          { href: "/admin/reports", icon: BarChart3, label: "Reports" },
          { href: "/admin/settings", icon: Settings, label: "Settings" },
        ];
      
      default:
        return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <Image
          src="https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/logo.png"
          alt="car-parts-logo"
          width={27}
          height={27}
          className="rounded w-8"
        />
        <h1
          className={`${
            isSidebarCollapsed ? "hidden" : "block"
          } font-extrabold text-2xl`}
        >
          CAR PARTS
        </h1>

        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="flex-grow mt-8">
        {navigationItems.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isCollapsed={isSidebarCollapsed}
          />
        ))}
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">&copy; 2024 Car Parts Marketplace</p>
      </div>
    </div>
  );
};

export default Sidebar;

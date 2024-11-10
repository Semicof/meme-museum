"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Search } from "lucide-react";
import { truncateAddress } from "@/helper/common";

declare global {
  interface Window {
    ethereum?: any;
  }
}

function Navbar() {
  const currentPath = usePathname();
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const isActive = (path: string) => currentPath === path;

  const connectWallet = async () => {
    if (window.ethereum == null) {
      console.log("No MetaMask wallet installed!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      setAddress(walletAddress);
      localStorage.setItem("walletAddress", walletAddress);

      // Fetch balance
      const balance = await provider.getBalance(walletAddress);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
    localStorage.removeItem("walletAddress");
  };

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      connectWallet();
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        connectWallet();
      });
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="w-full flex justify-between p-8">
      <div className="flex gap-6 items-center">
        <Image src="/images/logo1.png" width={60} height={60} alt="logo" />
        <span className="text-2xl">Meme Museum</span>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input placeholder="Search meme here..." size={88} />
          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
            <Search />
          </Button>
        </div>
      </div>

      <div className="flex gap-10 items-center font-semibold text-2xl">
        <Link href="/">
          <span
            className={
              isActive("/") ? "text-yellow-500" : "hover:text-yellow-500"
            }
          >
            Marketplace
          </span>
        </Link>

        <Link href="/leader-board">
          <span
            className={
              isActive("/leader-board")
                ? "text-yellow-500"
                : "hover:text-yellow-500"
            }
          >
            Leader Board
          </span>
        </Link>

        <Link href="/create-nft">
          <span
            className={
              isActive("/create-nft")
                ? "text-yellow-500"
                : "hover:text-yellow-500"
            }
          >
            Create New NFT
          </span>
        </Link>

        {address ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="border border-yellow-500 px-4 py-2 rounded-xl cursor-pointer hover:bg-yellow-500"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-base">{truncateAddress(address)}</span>
                  {balance && (
                    <span className="text-sm text-gray-500">
                      {balance} Matic
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 text-lg">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={`/profile/${address}`}>
                  <DropdownMenuItem>
                    <User />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  <LogOut />
                  <span onClick={disconnectWallet}>Disconnect wallet</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={connectWallet}
            className="border border-yellow-500 bg-transparent text-[#333] px-4 py-2 rounded-xl cursor-pointer hover:bg-yellow-500"
          >
            Connect wallet
          </Button>
        )}
      </div>
    </div>
  );
}

export default Navbar;

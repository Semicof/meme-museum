"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="w-full bg-gray-800 text-white py-4 flex flex-col items-center justify-center gap-2">
      <Image src="/images/logo1.png" width={80} height={80} alt="logo" />
      <p className="text-xl">&copy; 2024 MemeMuseum by Semicof. All rights reserved.</p>
      <Link href="/privacy">
        <span className={"hover:text-yellow-500"}>Privacy Policy</span>
      </Link>
    </div>
  );
}

export default Footer;

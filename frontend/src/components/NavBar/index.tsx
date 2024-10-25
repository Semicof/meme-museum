import Discover from "./Discover";
import HelpCenter from "./HelpCenter";
import Notification from "./Notification";
import Profile from "./Profile";
import SideBar from "./SideBar";
import React from 'react'
import Image from "next/image";
import { Input } from "../ui/input";

function NavBar() {
  return (
    <div>
      <div className="flex items-center">
        <Image src={"/imgs/logo.png"} width={100} height={100} alt="logo"/>
        <Input/>
      </div>
    </div>
  )
}

export default NavBar
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { truncateAddress } from "@/helper/common";

interface INftCardProps {
  nftId: string;
  title: string;
  name: string;
  image: string;
  price: string;
  owner: string;
  isForSale: string;
}

function NftCard({
  nftId,
  title,
  name,
  image,
  price,
  owner,
  isForSale,
}: INftCardProps) {
  return (
    <Link href={`/nft/${nftId}`}>
      <Card className="">
        <CardHeader>
          <h2>{title}</h2>
        </CardHeader>

        <CardContent>
          <Image src={image} width={400} height={400} alt="nft card" />
          <CardContent className="">
            <div className="">
              <h2 className={""}>{name}</h2>
            </div>
            {isForSale && (
              <h6 className={""}>
                <Image src={""} width={40} height={40} alt="matic logo" />
                <span>{price}</span>
              </h6>
            )}
            <hr />
          </CardContent>

          <CardFooter className="flex justify-between">
            <span>{truncateAddress(owner)}</span>
            {isForSale && <Button>Buy</Button>}
          </CardFooter>
        </CardContent>
      </Card>
    </Link>
  );
}

export default NftCard;

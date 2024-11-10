import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";

export interface INft {
  name: string;
  description: string;
  tokenURI: string;
  tokenId: string;
  price: number;
  owner: string;
  createdAt: Date;
  listedForSale: boolean;
  tags?: string[];
}

const listNewNft: INft[] = [
  {
    name: "Meof",
    description: "Just a meof",
    tokenURI: "...",
    tokenId: "1",
    price: 4000,
    owner: "id",
    createdAt: new Date(),
    listedForSale: true,
  },
];

function index() {
  return (
    <div>
      <Carousel>
        <CarouselContent>
          {listNewNft &&
            listNewNft.map((item, index) => (
              <CarouselItem>
                <Image
                  src={item?.imageUrl}
                  height={100}
                  width={100}
                  alt="item"
                />
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default index;

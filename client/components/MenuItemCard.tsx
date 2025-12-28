'use client'

import Image from "next/image";

interface MenuItemCardProps {
    img: string;
    title: string;
    bgColor: string;
    hoverColor: string;
    handleClick?: () => void;
  }

const MenuItemCard = ({ bgColor, hoverColor , img, title, handleClick }: MenuItemCardProps) => {
    return (
        <section
            className={`${bgColor} ${hoverColor} menu-item-card shadow-2xl`}
             onClick={handleClick}
        >
          <div >
            <Image src={img} alt="meeting" width={50} height={50} />
          </div>
          
          <div className="">
            <h1 className="text-xl text-white font-black">{title}</h1>
          </div>
        </section>
      );
}

export default MenuItemCard;
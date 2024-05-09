import React from "react";
import NavItems from "../NavItems";
import DropDown from "../DropDown";

const Header = () => {
  return (
    <div className="bg-white shadow-xl sticky top-0  shadow-secondary/20">
      <div className="flex container items-center h-[75px] justify-between rounded-xl  ">
        <div className="font-bold  text-[2rem] font-poppins text-secondary">
          HUNGER
        </div>
        <NavItems />
        <div className="">
          <DropDown />
        </div>
      </div>
    </div>
  );
};

export default Header;

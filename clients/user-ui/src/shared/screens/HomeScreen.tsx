import Header from "../components/Layout/Header";
import { Button, buttonVariants } from "../components/ui/button";
import Image from "next/image";
import React from "react";
import img from "../../assets/food.png";
import Link from "next/link";
import AuthScreen from "./AuthScreen";
const HomeScreen = () => {
  return (
    <div className="">
      <Header />
      <div className="container py-8 mt-6 bg-secondary rounded-3xl flex items-center flex-col justify-center">
        <div className="h-[500px] bg-white rounded-2xl my-auto flex justify-around items-center">
          <div className=" w-[45%] ms-6">
            <h2 className="text-[4rem] text-primary  font-semibold font-poppins leading-[70px] tracking-wide">
              The Fastest <span className="text-secondary">Food</span> Delivery
              In Your <span className="text-secondary">Town</span>
            </h2>
            <div className="text-primary/50 mt-1 text-[1.2rem]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </div>
            <div className="mt-3">
              <Link href={"/"} className={buttonVariants()}>
                Order Now
              </Link>
            </div>
          </div>
          <div className=" w-[45%]">
            <Image src={img} className="w-[100%]" alt="err" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;

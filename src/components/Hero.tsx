"use client";

import React from "react";

import Link from "next/link";
import Image from "next/image";
import { BorderBeam } from "@/components/ui/border-beam";
import Preview from "../../public/Preview.png";
import { useSession } from "next-auth/react";
import ShimmerButton from "./ui/shimmer-button";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./Footer";
import { MarqueeDemo } from "./marque";
import BlurFade from "@/components/ui/blur-fade";



const Hero = () => {
  const { data: session } = useSession();

  const isLoggedIn = session?.user ? true : false;


  return (
    <>
      <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 mb-10 over-x">
        <div className="mx-4 mb-20 mt-12 hover:shadow-md transition-all duration-300 ease-in-out">
        </div>
        <BlurFade delay={0.05} inView>

        {isLoggedIn ? (
          <Link href="/write">
            <ShimmerButton>
              Write Article
            </ShimmerButton>
          </Link>
        ) : (
            <ShimmerButton
            onClick={() => {
              toast.dark("Please Login. You need to login to write the articles.", {
                autoClose: 2000,
              });
            }}
          >
      Write Article
          </ShimmerButton>
        )}
        </BlurFade>

        <BlurFade delay={0.25} inView>
        <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-6xl font-bold mb-4 sm:mb-5 text-center mt-4">
        Craft Minimalistic
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 block sm:inline sm:ml-3">
            Articles
          </span>
        </h1>
      </BlurFade>

        <BlurFade delay={0.25 * 2} inView>
            <p className="text-sm sm:text-base lg:text-lg mb-6 font-normal text-center max-w-2xl">
                Create articles effortlessly with a sleek, distraction-free interface.
            </p>
      </BlurFade>

        <BlurFade delay={0.25*3} inView>
        <div className="relative rounded-xl mx-2 mt-20 overflow-hidden">
          <Image
            src={Preview}
            alt='Preview'
            width={1015}
            height={500}
            className="border rounded-xl"
          />
          <BorderBeam size={250} duration={12} delay={0} />
        </div>
        </BlurFade>
        <MarqueeDemo/>
       <Footer/>
      </div>
        <ToastContainer />
    </>
  );
};

export default Hero;

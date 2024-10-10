"use client"
import React from "react";
import { Twitter } from "lucide-react";
import Link from 'next/link'
import { Separator } from "@/components/ui/separator"
import { PenBoxIcon } from 'lucide-react'

const Footer = () => {
  return (
    <div className="py-10 mt-6 mb-1 mx-auto w-[85%]">
      <Separator className="mb-4 w-[70%] mx-auto" />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
            <PenBoxIcon size={30} className="mr-2 text-white" />
            <span className="text-lg font-semibold">ArticleGen</span>
          </Link>
          <div>
            <Link
              href="https://twitter.com/Saurav_Pant_"
              target="_blank"
              rel="noopener noreferrer"
              className="transform hover:-translate-y-1 transition-transform duration-300"
            >
              <Twitter size={30} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

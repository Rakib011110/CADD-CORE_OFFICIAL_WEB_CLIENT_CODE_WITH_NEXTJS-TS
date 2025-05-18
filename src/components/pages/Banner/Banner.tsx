"use client"
import Image from "next/image";
import { useEffect } from "react";
import Aos from "aos";

export default function Banner() {
useEffect(() => {
    Aos.init({ duration: 1000 }); 
  }, []); 



    return (
      <section >

<div  data-aos="fade-up"  className="w-full h-full"> 
        <Image className="w-full h-full" height={1000} width={1000} src="https://res.cloudinary.com/dbkwiwoll/image/upload/v1746349680/Artboard_1_1_-Picsart-AiImageEnhancer_dccum8.png" alt="bannar"/>
      </div>
      </section>
    );
  }
  
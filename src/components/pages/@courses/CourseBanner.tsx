import Image from "next/image";

export default function CoursesBanner() {
  return (
    <div className="bg-[#b1c3d672] ">
       <div className="max-w-full ml- bg-blue-50 mx-auto"> 
           <Image className=" w-full  mx-auto h-auto" height={1000} width={1000} src="https://res.cloudinary.com/dalpf8iip/image/upload/v1747297909/website_-_autodes-k_banner-Recovered_inufaj.jpg" alt="bannar"/>
         </div>
    </div>
  );
}       

// <div className="bg-[#b1c3d672] ">
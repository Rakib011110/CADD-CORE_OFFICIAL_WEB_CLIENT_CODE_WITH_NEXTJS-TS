"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/UI/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/UI/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/UI/dialog";

export default function ClientReviews() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<any | null>(null);

  const testimonials = [
    {
      name: "Meeraj Ebrahim",
      roles: ["Trainee", "Graphic Design Mastercourse"],
      testimonial:
        "আলহামদুলিল্লাহ্ Caddcore training institute এর Graphic Design Mastercourse টি খুব ভালো ছিল। আমি অনেক কিছু শিখেছি।",
      photoUrl:
        "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105154/Screenshot-2024-10-19-121434-768x768_nvpikd.png",
    },
    {
      name: "Mahmodul Hasan Sifat",
      roles: ["Mastercourse Student", "Professional Graphics & Video Editor"],
      testimonial:
        "আলহামদুলিল্লাহ Caddcore training institute এর professional graphics design mastercourse টি আমাকে অনেক কিছু শিখিয়েছে।",
      photoUrl:
        "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105005/Mahmodul-Hasan-Sifat-600x600_nsheyu.jpg",
    },
    {
      name: "নয়ম পাঠানজুলা",
      roles: ["Mastercourse Student", "RCC Building Structural Analysis"],
      testimonial:
        "It is a great initiative of giving a hand so that engineers can develop their skills in a proficient way. In BANGLADESH, engineers are falling behind due to lack of practical knowledge as well as a gap between software knowledge & theoretical knowledge. CADD Core is the bridge between these gaps. I wish all of them best.",
      photoUrl:
        "https://cdn-ilbhfhh.nitrocdn.com/GQAjASDcQJAOSFnCNbjHAwgJDnuIafbo/assets/images/optimized/rev-f913869/caddcore.net/wp-content/uploads/2023/04/327461195_958221191816264_6894653249626631661_n.jpg",
    },
    {
      name: "Mahmodul Hasan Sifat",
      roles: ["Mastercourse Student", "Professional Graphics & Video Editor"],
      testimonial:
        "আলহামদুলিল্লাহ Caddcore training institute এর professional graphics design mastercourse টি আমাকে অনেক কিছু শিখিয়েছে।",
      photoUrl:
        "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105315/Meeraj-Ebrahim-Ebrahim-Choudhury-600x601_e6kgcq.jpg",
    },
  ];

  return (
    <section id="success-story" className="mb-8 text-justify bg-gray-50">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        কেন আমরা শিক্ষার্থীদের কাছে সেরা
      </h2>


      <div className="flex justify-center mb-6">
        <span className="inline-block w-24 h-1 bg-red-500 rounded"></span>
      </div>

      <Carousel className="w-full max-w-6xl mx-auto">
        <CarouselContent className="-ml-1">
          {testimonials.map((item, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-2">
                <Card className=" rounded-md shadow-md bg-[#dcd8c755]">
                  <CardContent className="p-4 min-h-[220px] flex flex-col justify-between">
                    <div>
                      <div className="flex items-start gap-3">
                        <img
                          src={item.photoUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.name}
                          </h3>
                          {item.roles.map((role, idx) => (
                            <p
                              key={idx}
                              className={`text-sm ${
                                idx === 0
                                  ? "text-red-500 font-medium"
                                  : "text-gray-600"
                              }`}
                            >
                              {role}
                            </p>
                          ))}
                        </div>
                      </div>

                      <p className="mt-3 text-gray-700 leading-relaxed">
                        {item.testimonial.length > 130
                          ? item.testimonial.slice(0, 130) + "..."
                          : item.testimonial}
                      </p>
                    </div>

                    <button
                      className="mt-3 text-sm text-blue-600 hover:underline font-medium self-start"
                      onClick={() => setSelectedTestimonial(item)}
                    >
                      Read More
                    </button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Modal for full details */}
      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent className="max-w-md sm:max-w-xl">
          {selectedTestimonial && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4">
                  <img
                    src={selectedTestimonial.photoUrl}
                    alt={selectedTestimonial.name}
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <div>
                    <p className="text-lg font-semibold">{selectedTestimonial.name}</p>
                    {selectedTestimonial.roles.map((role: string, idx: any) => (
                      <p
                        key={idx}
                        className={`text-sm ${
                          idx === 0 ? "text-red-500 font-medium" : "text-gray-600"
                        }`}
                      >
                        {role}
                      </p>
                    ))}
                  </div>
                </DialogTitle>
              </DialogHeader>

              <DialogDescription className="mt-3 text-gray-800 leading-relaxed whitespace-pre-wrap">
                {selectedTestimonial.testimonial}
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

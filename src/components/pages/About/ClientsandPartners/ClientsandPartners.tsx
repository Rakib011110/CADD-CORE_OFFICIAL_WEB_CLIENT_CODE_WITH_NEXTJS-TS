import Marquee from "react-fast-marquee";
import HomeSection, { Highlight } from "@/components/Home/HomeSection";

const ClientsandPartners = () => {
  const data = [
    {
      id: 1,
      title: "BRAC Institute of Skills Development",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744102009/isd-1536x864_v9ipf4.png",
    },


    
    {
      id: 2,
      title: "MILITARY ENGINEER SERVICES",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744102842/military-768x432_jl3f0m.png",
    },
    {
      id: 3,
      title: "বাংলাদেশ কারিগরি শিক্ষা বোর্ড",
      photoUrl:
        "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744100349/BANGLADESH-KARIGORI-SIKKHA-150x150_eteasq.png",
    },
    {
      id: 4,
      title: "জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744102249/JATIO-DOKKHOTA-1024x576_ioek21.png",
    },
    {
      id: 5,
      title: "Saic Institute of Management & Technology",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744103188/sAIC-INSTUTE_gqsk9b.png",
    },
    {
      id: 6,
      title: "BANGLAMARK",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744100421/bangla-mark-150x150_fkgguz.png",
    },
    {
      id: 7,
      title: "Sincos",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744103362/sincos-300x169_l6btck.png",
    },
    {
      id: 8,
      title: "Hatil",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744101872/hatil-300x169_kvsbwk.png",
    },
    {
      id: 9,
      title: "Certiport",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744100857/Certiport.bak_rktequ.png",
    },
    {
      id: 10,
      title: "Autodesk",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744100754/Autodesk-updraft-pre-smush-original_bhwqug.png",
    },
    {
      id: 11,
      title: "Bangladesh Association of Software_and Information Services",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744100565/basic-768x432_ydy7pq.png",
    },
    {
      id: 12,
      title: "Robust_3D",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744103136/Robust-1536x864_nflpwt.png",
    },
    {
      id: 13,
      title: "CADD CORE Creative Community",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744100988/craetive-community.bak_xl8ipm.png",
    },
    {
      id: 14,
      title: "Engineering_IT_Skills",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744101744/engineering-skill-it.bak_tegoye.png",
    },
    {
      id: 15,
      title: "Major_Construction",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744102331/major-768x432_mrxcvy.png",
    },
    {
      id: 16,
      title: "certify-bangladesh",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744100809/certify-bangladesh.bak_svftlw.png",
    },
    {
      id: 17,
      title: "bec",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744100673/bec-1024x576_vwwegd.png",
    },
    {
      id: 18,
      title: "Creative_consaltant",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744101060/Creative-consaltant.bak_wvbipj.png",
    },
    {
      id: 19,
      title: "Spark_steel",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744103406/Spark-steel_rc3u7j.png",
    },
    {
      id: 20,
      title: "Sda-stractural",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744103302/Sda-stractural-1024x576_ecispt.png",
    },
    {
      id: 21,
      title: "Archstone Interior",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744104461/Archstone-interirors.bak_kjuju9.png",
    },
    {
      id: 22,
      title: "SB Consultant Ltd",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744103243/Sb-consultant-ltd-768x432_f0xhrw.png",
    },
    {
      id: 23,
      title: "Onestop Design Solution",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744103013/one-stop-768x432_ag048j.png",
    },
    {
      id: 24,
      title: "Design and development solution",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744101665/Design-and-development-solution-768x432_b3xbsk.png",
    },
    {
      id: 25,
      title: "Compliance-BD-Ltd",
      photoUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744100938/Compliance-BD-Ltd-300x169_axgubr.png",
    },
  ];

  // Two rows moving in opposite directions
  const half = Math.ceil(data.length / 2);
  const rows = [data.slice(0, half), data.slice(half)];
  const nameOf = (title: string) => title.replace(/[_-]+/g, " ");

  return (
    <HomeSection
      id="partners"
      eyebrow="আমাদের জার্নি"
      title={
        <>
          আমাদের <Highlight>ক্লায়েন্ট ও পার্টনার</Highlight>
        </>
      }
      subtitle={`সরকারি প্রতিষ্ঠান, সফটওয়্যার প্রতিষ্ঠান এবং ইন্ডাস্ট্রির ${data.length.toLocaleString("bn-BD")}টিরও বেশি প্রতিষ্ঠানের সাথে আমাদের পথচলা।`}>
      <div className="space-y-4 [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        {rows.map((row, index) => (
          <Marquee key={index} pauseOnHover gradient={false} direction={index === 1 ? "right" : "left"} speed={32}>
            {row.map((item) => (
              <div
                key={item.id}
                title={nameOf(item.title)}
                className="group mx-2 my-2 flex h-32 w-52 flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_16px_36px_-20px_rgba(220,38,38,0.4)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.photoUrl}
                  alt={nameOf(item.title)}
                  loading="lazy"
                  className="h-[4.5rem] w-auto max-w-full object-contain opacity-75 grayscale transition duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                />
                <span className="w-full truncate text-center text-[11px] font-medium text-zinc-500 transition-colors group-hover:text-zinc-700">
                  {nameOf(item.title)}
                </span>
              </div>
            ))}
          </Marquee>
        ))}
      </div>
    </HomeSection>
  );
};

export default ClientsandPartners;

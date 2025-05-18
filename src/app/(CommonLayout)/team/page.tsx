import TeamMembers from "@/components/pages/Teams/TeamMember/TeamMember";


export const metadata = {
  title: "Our Team - CADD CORE",
  description: "Meet the professional team members of CADD CORE. Our expert Civil, Mechanical, Electrical, Architectural, and BIM specialists are here to guide you.",
  keywords: [
    "CADD CORE Team",
    "Civil Engineers",
    "Mechanical Experts",
    "Electrical Specialists",
    "Architectural Designers",
    "BIM Professionals",
    "Team Members",
    "Expert Trainers"
  ],
  openGraph: {
    title: "Our Team - CADD CORE",
    description: "Discover the talented team behind CADD CORE. Our experts in Civil, Mechanical, Electrical, Architectural, and BIM fields help you grow.",
    // url: "https://yourdomain.com/team", // <-- Replace with your domain
    type: "website",
   
  },
 
  authors: [{ name: "CADD CORE" }],
  creator: "CADD CORE",
  publisher: "CADD CORE",
};

export default function Team() {
  return (
    <div>
      <TeamMembers/>
    </div>
  );
}
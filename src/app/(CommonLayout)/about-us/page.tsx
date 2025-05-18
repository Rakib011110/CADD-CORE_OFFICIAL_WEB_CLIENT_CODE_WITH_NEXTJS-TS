import Head from "next/head";
import AboutStatsSection from "@/components/pages/About/AboutStatsSection/AboutStatsSection";
import AboutUsBanner from "@/components/pages/About/AboutUsBanner/AboutUsBanner";
import AboutCoreValues from "@/components/pages/About/AboutCoreValues/AboutCoreValues";
import ReviewsAboutUs from "@/components/pages/About/ReviewsAboutUs/ReviewsAboutUs";
import EventsandEngagements from "@/components/pages/About/EventsandEngagements/EventsandEngagements";
import CADDTeamSection from "@/components/pages/About/CADDTeamSection/CADDTeamSection";
import ClientsandPartners from "@/components/pages/About/ClientsandPartners/ClientsandPartners";
import OurLocations from "@/components/pages/About/OurLocations/OurLocations";


export const metadata = {
  title: "About Us - CADD CORE",
  description: "Learn more about CADD CORE, our mission, values, and team members.",
};


export default function AboutUsPage() {


return (
    <>
      <Head>
        <title>About Us - CADD Core</title>
        <meta name="description" content="Learn more about CADD Core, our team, values, and global locations." />
      </Head>

      {/* Page Content */}
      <main>
        <AboutUsBanner />

        <AboutStatsSection />
        <AboutCoreValues />
        <ReviewsAboutUs />
        <EventsandEngagements />
        <CADDTeamSection />
        <ClientsandPartners />
        <OurLocations />
      </main>
    </>
  );
}

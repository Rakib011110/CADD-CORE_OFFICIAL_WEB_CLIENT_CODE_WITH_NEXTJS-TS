import type { Metadata } from "next";
import CoursePageView from "@/components/pages/CourseDetails/CoursePage/CoursePageView";
import { API_BASE_URL } from "@/lib/apiBase";
import { TCourse } from "@/lib/courses";

const SITE_URL = "https://www.caddcore.net";

type PageProps = { params: Promise<{ slug: string }> };

// Fetched on the server so search engines and link previews get the course
// name, description, price and batch dates. Refreshed every 5 minutes.
async function getCourse(slug: string): Promise<TCourse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/courses/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return { title: "Course | CADD CORE" };

  const description = (course.overview?.overviewDescription || course.description || "").slice(0, 160);
  const image = course.courseBanner || course.photoUrl;
  return {
    title: `${course.title} | CADD CORE`,
    description,
    alternates: { canonical: `${SITE_URL}/courses/${slug}` },
    openGraph: {
      title: course.title,
      description,
      url: `${SITE_URL}/courses/${slug}`,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

const COURSE_MODE: Record<string, string> = {
  online: "online",
  offline: "onsite",
  weekend: "onsite",
  friday: "onsite",
  corporate: "onsite",
  "one-to-one": "onsite",
};

export default async function CourseDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourse(slug);

  // schema.org Course with one CourseInstance per upcoming batch
  const jsonLd = course
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.title,
        description: course.description,
        url: `${SITE_URL}/courses/${slug}`,
        provider: { "@type": "Organization", name: "CADD CORE Training Institute", url: SITE_URL },
        ...(course.courseFee
          ? { offers: { "@type": "Offer", price: course.courseFee, priceCurrency: "BDT", category: "Paid" } }
          : {}),
        ...(course.batches?.length
          ? {
              hasCourseInstance: course.batches.map((b) => ({
                "@type": "CourseInstance",
                courseMode: COURSE_MODE[b.mode] || "onsite",
                ...(b.startDate ? { startDate: b.startDate.slice(0, 10) } : {}),
                ...(b.location ? { location: b.location } : {}),
                offers: { "@type": "Offer", price: b.fee, priceCurrency: "BDT" },
              })),
            }
          : {}),
      }
    : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      ) : null}
      <CoursePageView slug={slug} />
    </>
  );
}

import { TCourse, TCourseBatch, TDeliveryMode, TPaymentPlan } from "@/lib/courses";

export const MODE_ORDER: TDeliveryMode[] = ["online", "offline", "weekend", "corporate", "one-to-one"];

export const MODE_LABEL: Record<TDeliveryMode, string> = {
  online: "অনলাইন",
  offline: "অফলাইন",
  weekend: "উইকেন্ড",
  corporate: "কর্পোরেট",
  "one-to-one": "ওয়ান-টু-ওয়ান",
};

export const MODE_HINT: Record<TDeliveryMode, string> = {
  online: "লাইভ ক্লাস, যেকোনো জায়গা থেকে",
  offline: "ক্যাম্পাসে সরাসরি ক্লাস",
  weekend: "সাপ্তাহিক ছুটির দিনে ক্লাস",
  corporate: "প্রতিষ্ঠানের টিমের জন্য ট্রেনিং",
  "one-to-one": "অফিসে বসে একক প্রশিক্ষণ",
};

// Links that were already on the course page
export const FREE_SEMINAR_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScZysZu-d44Md-KbsIPXOX-wuoobxWbcBaXN04ITkgWYNR6Fw/viewform";
export const MANUAL_PAYMENT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe27ZcsU6VdsyYPMD4JO5VwW4d9CI3_HtTG8YRxyo43gyzGWA/viewform";

const bnNumber = new Intl.NumberFormat("bn-BD");
export const toBn = (n: number) => bnNumber.format(n);
export const taka = (n: number) => `৳${bnNumber.format(Math.round(n))}`;

const parse = (value?: string | null) => {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

// "২০ অক্টোবর, ২০২৬"
export const formatDateBn = (value?: string | null) => {
  const d = parse(value);
  if (!d) return null;
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
};

// "২০ অক্টো"
export const formatShortDateBn = (value?: string | null) => {
  const d = parse(value);
  if (!d) return null;
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
};

export const seatsLeft = (b: TCourseBatch) =>
  b.seatsTotal ? Math.max(0, b.seatsTotal - (b.seatsBooked || 0)) : null;

export const batchDateText = (b: TCourseBatch) => {
  const d = formatDateBn(b.startDate);
  if (d) return d;
  if (b.mode === "corporate") return "আপনার সুবিধামতো সময়ে";
  return "তারিখ শীঘ্রই ঘোষণা করা হবে";
};

export const batchStatusText = (b: TCourseBatch) => {
  if (b.status === "full") return "আসন পূর্ণ";
  if (b.status === "running") return "ক্লাস চলছে · ভর্তি চলছে";
  const left = seatsLeft(b);
  if (left !== null && left <= 10) return `মাত্র ${toBn(left)}টি আসন বাকি`;
  return "ভর্তি চলছে";
};

export const sortModes = (modes: TDeliveryMode[]) =>
  [...new Set(modes)].sort((a, b) => MODE_ORDER.indexOf(a) - MODE_ORDER.indexOf(b));

// Courses that only offer full payment when they have no plans of their own.
// The server applies the same rule when it calculates the amount.
const FULL_PAYMENT_ONLY_MATCHES = [
  "প্রফেশনাল মেকানিক্যাল ক্যাড মাস্টারকোর্স",
  "প্রফেশনাল ইলেকট্রিক্যাল ডিজাইন মাস্টারকোর্স",
  "mechanical-cad-master-course",
  "professional-electrical-design-mastercourse",
  "মেকানিক্যাল",
  "ইলেকট্রিক্যাল",
];

/** Active payment plans for a course: its own plans, otherwise the global ones. */
export const resolvePlans = (course: TCourse, globalPlans: TPaymentPlan[] = []) => {
  const own = course.paymentPlans || [];
  if (own.length) return own.filter((p) => p.isActive !== false);
  const fullOnly = FULL_PAYMENT_ONLY_MATCHES.some(
    (m) =>
      String(course.slug || "").toLowerCase().includes(m.toLowerCase()) ||
      String(course.title || "").toLowerCase().includes(m.toLowerCase())
  );
  return globalPlans
    .filter((p) => p.isActive !== false)
    .filter((p) => !fullOnly || p.installments === 1);
};

/** Same calculation as the server. The server's amount is the one that is charged. */
export const priceForPlan = (fee: number, plan?: TPaymentPlan) => {
  const installments = plan?.installments || 1;
  const discount = plan?.discountPercent ? (fee * plan.discountPercent) / 100 : 0;
  const total = Math.max(0, fee - discount);
  let payNow = total;
  if (installments === 2) payNow = fee * 0.5;
  else if (installments === 3) payNow = fee * 0.3;
  const remaining = Math.max(0, total - payNow);
  const later = installments > 1 ? installments - 1 : 0;
  return {
    fee,
    discount,
    total,
    payNow,
    installments,
    perLaterInstallment: later ? remaining / later : 0,
    laterInstallments: later,
    discountPercent: plan?.discountPercent || 0,
  };
};

/** Lowest total price and the cheapest way to start, for the price shown on cards. */
export const priceSummary = (fee: number, plans: TPaymentPlan[]) => {
  if (!plans.length) return { best: priceForPlan(fee), installment: null };
  const priced = plans.map((p) => ({ plan: p, ...priceForPlan(fee, p) }));
  const best = priced.reduce((a, b) => (b.total < a.total ? b : a));
  const installment = priced
    .filter((p) => p.installments > 1)
    .sort((a, b) => a.payNow - b.payNow)[0] || null;
  return { best, installment };
};

// YouTube watch/short links → embed URL (other URLs are returned unchanged)
export const toEmbedUrl = (url?: string) => {
  if (!url) return "";
  const m = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
};

export const youTubeId = (url?: string) =>
  url?.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?/\s]{11})/)?.[1];

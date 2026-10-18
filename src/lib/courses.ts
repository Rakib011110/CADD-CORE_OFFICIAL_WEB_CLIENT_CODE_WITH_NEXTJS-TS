export type Category =
  | "Civil"
  | "Architectural"
  | "Mechanical"
  // | "Electrical"
  | "BIM"
  | "Project Management";

export type TSchedule = {
  startingDate: string;
  mode: string;
  days: string;
  time: string;
};

export type TOverview = {
  overviewDescription: string;
  videoUrl: string;
};

export type TCourseIncludes = {
   duration?: string;
  
    liveSessions?: string;
    certificate?: string;
    onJobTraining?: string;
    projects?: string;
    experienceLetter?: string;
};

export type TTopic = {
  id(id: any): void;
  _id: string | null;
  topicTitle: string;
  topicDescription: string;
};

export type TSoftware = {
  softwareTitle: string;
  photoUrl: string;
};

export type TAdvisor = {
  name: string;
  title: string;
  photoUrl: string;
};

export type TTeacher = {
  name: string;
  role: string;
  photoUrl: string;
};

export type TExpertPanel = {
  advisors: TAdvisor[];
  teachers: TTeacher[];
};

export type TLearningProject = {
  title: string;
  description: string;
  photoUrl: string;
};

export type TFreeTrainingSession = {
  title: string;
  videoUrl: string;
};

export type TFAQ = {
  question: string;
  answer: string;
};

export type TInternationaldemoCertificate = {
  certificateTitle: string;
  certificateOverview: string;
  photoUrl: string;
};
export type TIdemoCertificate = {
  title: string;

  photoUrl: string;
};

export type TDeliveryMode = "online" | "offline" | "weekend" | "corporate" | "one-to-one";
export type TBatchStatus = "upcoming" | "running" | "full" | "closed";

export type TCourseBatch = {
  _id: string;
  course: string | { _id: string; title: string; slug: string; courseType?: string; courseFee?: number };
  mode: TDeliveryMode;
  batchNo: string;
  startAnytime?: boolean; // no fixed date, students start when they enrol
  startDate?: string | null;
  endDate?: string | null;
  registrationDeadline?: string | null;
  classDays?: string;
  classTime?: string;
  location?: string;
  platform?: string;
  fee: number;
  seatsTotal?: number;
  seatsBooked?: number;
  minParticipants?: number;
  note?: string;
  status: TBatchStatus;
  isPublished: boolean;
  onJobTrainingStart?: string | null;
  onJobTrainingEnd?: string | null;
  certificationDate?: string | null;
  internshipStartDate?: string | null;
};

export type TPaymentPlan = {
  _id?: string;
  name: string;
  installments: number;
  discountPercent: number;
  // Share of the total paid at enrollment; empty = 2 → 50%, 3 → 30%
  payNowPercent?: number;
  isActive: boolean;
};

export type TCourse = {
  title: string;
  _id: string;
  slug: any;
  courseType?: "regular" | "one-to-one";
  categories: Category[];
  courseBanner: string;
  bannerImages?: { photoUrl: string }[];
  batch: string;

  InternationaldemoCertificate: TInternationaldemoCertificate[];
  demoCertificate: TIdemoCertificate[];
  duration: string;
  lessons: string;
  photoUrl: string;
  projects: string;
  description: string;
  schedule: TSchedule;
  overview: TOverview;
  courseIncludes: TCourseIncludes;
  topicsCovered: TTopic[];
  softwaresTaught: TSoftware[];
  expertPanel: TExpertPanel;
  learningProject: TLearningProject[];
  freeTrainingSessions: TFreeTrainingSession[];
  courseFee: number;
  faqs: TFAQ[];
  paymentPlans?: TPaymentPlan[];
  // Upcoming batches for every delivery mode, soonest first (from the API)
  batches?: TCourseBatch[];
  courseSchedules?: {
    batchNo?: string;
    onlineStartDate?: string;
    onlineFinishDate?: string;
    onJobTrainingStart?: string;
    certificationDate?: string;
    internshipStartDate?: string;
  }[];
};

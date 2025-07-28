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

export type TCourse = {
  title: string;
  _id: string;
  slug: any;
  categories: Category[];
  courseBanner: string;
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
};

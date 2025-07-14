export type TCourse = {
  _id?: any;
  title: string;
  slug: string;
  categories: string;
  duration: string;
  lessons: string;
  photoUrl: string;
  projects: string;
  description: string;
  courseFee: string;

  schedule: {
    startingDate: string;
    mode: string;
    days: string;
    time: string;
  };

  overview: {
    overviewDescription: string;
    videoUrl: string;
  };

  courseIncludes: {
    duration: string;
    weeklyLiveClasses: string;
    weeklyClassHours: string;
  };

  topicsCovered: { topicTitle: string; topicDescription: string }[];

  softwaresTaught: { softwareTitle: string; photoUrl: string }[];

  demoCertificate: { title: string; photoUrl: string }[];

  InternationaldemoCertificate: {
    certificateTitle: string;
    certificateOverview: string;
    photoUrl: string;
  }[];

  expertPanel: {
    advisors: { name: string; title: string; photoUrl: string }[];
    teachers: { name: string; role: string; photoUrl: string }[];
  };

  learningProject: { title: string; description: string; photoUrl: string }[];

  freeTrainingSessions: { title: string; videoUrl: string }[];

  faqs: { question: string; answer: string }[];
};

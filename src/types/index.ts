export interface IUser {
    _id: string;
    name: string;
    role: USER_ROLE;
    email: string;
    status: string;
    emailVerified: any
    mobileNumber: string;
    profilePhoto: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  } 

export interface IPayment {
  transactionId: string;
  _id?: string;
  user: any;
  course: any;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refund';
  createdAt?: Date;
  updatedAt?: Date;
}

  export type USER_ROLE = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    HR: 'HR',
    MARKETING_TEAM: 'MARKETING_TEAM',
    CUSTOMER_SERVICE_TEAM: 'CUSTOMER_SERVICE_TEAM',
  };
  

  export interface IInput {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: any
  required?: boolean;
  type?: string;
  label: string;
  name: string;
  disabled?: boolean; 
  placeholder?: string;
  errorMessage?: string;
} 

export type ICertificate = { 
  _id: string
  certificateId?: string;
  studentId: string;
  studentName: string;
  courseName: string;
  issueDate: string | Date;
  instructorName: string;
  status: 'pending' | 'issued' | 'revoked' | 'applied' | 'approved' | 'rejected'; 
  comment?: string;
  photoUrl?: string;
  appliedAt?: Date;
  approvedAt?: Date;
};


// Types:
export interface CertificateApplication {
  _id?: string;
  certificateId?: string;
    studentId: string;
    studentName: string;
    courseName: string;
    issueDate: string | Date;
    instructorName: string;
    status: 'pending' | 'issued' | 'revoked' | 'applied' | 'approved' | 'rejected'; 
    comment?: string;
    photoUrl?: string;
    appliedAt?: Date;
    approvedAt?: Date;
}




export interface IIndustrialOfferBanner {
  _id?: string;
  title: string;
  description: string;
  buyNowText?: string;
  learnMoreText?: string;
  date?: any; 
  time?: any; 
  remainingDays?: number;
  photoUrl: string;
  createdAt?: string;
  updatedAt?: string;
}



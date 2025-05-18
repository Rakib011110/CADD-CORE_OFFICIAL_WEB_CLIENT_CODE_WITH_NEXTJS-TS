export type  TSeminar ={
    type: any;
    topic: "",
    place: "",
    date: "",
    time: "",
    remainingDays: 0,
  }
  
  interface FormData {
    topic: string;
    place: string;
    date: string;
    time: string;
  }
  
  export interface UpdateSeminarsProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    setSelectedSeminar: React.Dispatch<React.SetStateAction<string | any>>;
    handleUpdate: () => Promise<void>;
  }
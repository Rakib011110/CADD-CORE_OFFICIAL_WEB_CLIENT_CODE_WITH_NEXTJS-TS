

import CreateSeminarForm from "@/components/pages/Seminars/createSeminars/CreateSeminar";
import ManageSeminars from "@/components/pages/Seminars/ManageSeminars/ManageSeminars";


export default function Seminar() {

  return (
    <div className="p-6">
      <div>
        <CreateSeminarForm/>
      </div>
      <ManageSeminars />  
      {/* <SeminarList/> */}
    </div>
  );
}

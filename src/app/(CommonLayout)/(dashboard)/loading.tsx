import { Progress } from "@radix-ui/react-progress";

export default function Loading() {
  return (
    <div className="mt-20 flex items-center justify-center ">
    <Progress value={50} />

    </div>
  );
}
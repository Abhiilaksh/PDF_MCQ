import { Spinner } from "@material-tailwind/react";
 
export function Loader() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Spinner className="h-12 w-12" />
    </div>
  );
}
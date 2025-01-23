import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetEmployeeDocumentQuery } from "@/redux/features/employeeDocumentApiSlice/employeeDocumentSlice";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import UploadDialog from "./upload-dialog";

export default function Document() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { data, isLoading } = useGetEmployeeDocumentQuery(employeeId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-20">
          <Loader2 className="animate-spin size-6 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="text-right mb-4">
        <UploadDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Employee Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.result ? (
            <ul className="grid grid-cols-5">
              <li className="col-span-1 rounded bg-light p-3 border-border/30 border">
                <div className="w-[196px] aspect-[16/12] bg-border/30 rounded mx-auto mb-4">
                  <img src="" />
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-text-light">ID card all.pdf</p>
                  <Popover>
                    <PopoverTrigger className="text-text-light">
                      <EllipsisVertical className="size-4" />
                    </PopoverTrigger>
                    <PopoverContent></PopoverContent>
                  </Popover>
                </div>
              </li>
            </ul>
          ) : (
            <p className="py-4">No documents uploaded</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

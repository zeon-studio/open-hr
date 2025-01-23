import FileManager from "@/components/FileManager";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MAX_SIZE } from "@/lib/constant";
import { useAddEmployeeDocumentMutation } from "@/redux/features/employeeDocumentApiSlice/employeeDocumentSlice";
import { Loader2, Upload } from "lucide-react";
import { useParams } from "next/navigation";

export default function UploadDialog() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [uploaded, { isLoading: isUploading }] =
    useAddEmployeeDocumentMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto" disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="animate-spin size-6" />
            </>
          ) : (
            <>
              <Upload className="size-4 mr-2.5" />
              Upload
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl gap-3">
        <DialogHeader>
          <DialogTitle>Choose Image</DialogTitle>
        </DialogHeader>
        <FileManager
          enable={true}
          existingFile={""}
          folder={`erp/document`}
          maxSize={MAX_SIZE}
          permission="public-read"
          setFile={(location: any) => {
            const fileName = location.split("/").pop();
            console.log({ fileName });
            uploaded({
              createdAt: new Date(),
              employee_id: employeeId,
              documents: [
                {
                  date: new Date(),
                  file: location,
                  name: fileName,
                },
              ],
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

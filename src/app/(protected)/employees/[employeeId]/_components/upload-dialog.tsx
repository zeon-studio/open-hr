import FileManager from "@/components/FileManager";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MAX_SIZE } from "@/lib/constant";
import { useAddEmployeeDocumentMutation } from "@/redux/features/employeeDocumentApiSlice/employeeDocumentSlice";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function UploadDialog({
  file,
  children,
  ...buttonProps
}: ButtonProps & { file?: string }) {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [uploaded, { isLoading: isUploading }] =
    useAddEmployeeDocumentMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={buttonProps.className}
          variant={buttonProps.variant}
          type="button"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin size-6" />
            </>
          ) : (
            <>{children}</>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl gap-3">
        <DialogHeader>
          <DialogTitle>Choose Image</DialogTitle>
        </DialogHeader>
        <FileManager
          enable={true}
          existingFile={file}
          folder={`erp/document`}
          maxSize={MAX_SIZE}
          permission="public-read"
          setFile={(location: any) => {
            const fileName = location.split("/").pop();
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

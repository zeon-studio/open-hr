import FileManager from "@/components/FileManager";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDialog } from "@/hooks/useDialog";
import { MAX_SIZE } from "@/lib/constant";
import { useAddEmployeeDocumentMutation } from "@/redux/features/employeeDocumentApiSlice/employeeDocumentSlice";
import { ErrorResponse } from "@/types";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function UploadDialog({
  file,
  children,
  ...buttonProps
}: ButtonProps & { file?: string }) {
  const { isDialogOpen, onDialogChange } = useDialog();
  const { employeeId } = useParams<{ employeeId: string }>();
  const [uploaded, { isLoading: isUploading }] =
    useAddEmployeeDocumentMutation();

  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogChange}>
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

      <DialogContent className="max-w-xl gap-3">
        <DialogHeader>
          <DialogTitle>Choose Image</DialogTitle>
        </DialogHeader>
        <FileManager
          isLoading={isUploading}
          enable={true}
          existingFile={file}
          folder={`erp/document`}
          maxSize={MAX_SIZE}
          permission="public-read"
          setFile={async (location: any) => {
            const fileName = location.split("/").pop();
            if (!fileName) return;
            try {
              await uploaded({
                createdAt: new Date(),
                employee_id: employeeId,
                documents: [
                  {
                    date: new Date(),
                    file: location,
                    name: fileName,
                  },
                ],
              }).unwrap();
              onDialogChange(false);
              toast.success("Document updated successfully!");
            } catch (error) {
              toast.error(
                (error as ErrorResponse).data.message || "Something went wrong!"
              );
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

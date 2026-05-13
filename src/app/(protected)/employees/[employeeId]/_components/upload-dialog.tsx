import FileManager from "@/components/file-manager";
import { MAX_SIZE } from "@/constants";
import { useAddEmployeeDocumentMutation } from "@/features/employee";
import { useDialog } from "@/hooks/use-dialog";
import { useSettings } from "@/hooks/use-settings";
import { cn } from "@/lib/shadcn";
import { ErrorResponse } from "@/types";
import { Button, ButtonProps } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function UploadDialog({
  file,
  children,
  modalBodyClassName = "max-w-xl",
  ...buttonProps
}: ButtonProps & { file?: string; modalBodyClassName?: string }) {
  const { data: session } = useSession();
  const { company_name } = useSettings() || {};
  const { isDialogOpen, onDialogChange } = useDialog();
  const params = useParams<{ employeeId: string }>();
  let employeeId = params?.employeeId ?? "";
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
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

      <DialogContent className={cn(`${modalBodyClassName} gap-3`)}>
        <DialogHeader className="mb-3">
          <DialogTitle>Choose Image</DialogTitle>
        </DialogHeader>
        <FileManager
          isLoading={isUploading}
          enable={true}
          existingFile={file}
          folder={`${company_name.replace(/\s/g, "-").toLowerCase()}`}
          maxSize={MAX_SIZE}
          permission="public-read"
          setFile={async (location: any) => {
            const fileName = location.split("/").pop();
            if (!fileName || file === location) return;
            try {
              await uploaded({
                createdAt: new Date(),
                employee_id: employeeId,
                documents: [
                  { date: new Date(), file: location, name: fileName },
                ],
              }).unwrap();
              onDialogChange(false);
              toast.success("Document updated successfully!");
            } catch (error) {
              toast.error(
                (error as ErrorResponse).data.message ||
                  "Something went wrong!",
              );
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

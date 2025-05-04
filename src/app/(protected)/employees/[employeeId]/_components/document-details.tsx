import ConfirmationPopup from "@/components/confirmation-popup";
import FileManager from "@/components/file-manager";
import useAxios from "@/hooks/useAxios";
import { MAX_SIZE } from "@/lib/constant";
import {
  useDeleteEmployeeDocumentMutation,
  useGetEmployeeDocumentQuery,
} from "@/redux/features/employeeDocumentApiSlice/employeeDocumentSlice";
import { useAppSelector } from "@/redux/hook";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Ellipsis, Loader2, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import UploadDialog from "./upload-dialog";

export default function Document() {
  const { company_name } =
    useAppSelector((state) => state["setting-slice"]) || {};

  const { data: session } = useSession();
  const axios = useAxios({
    data: session,
  });
  const params = useParams<{ employeeId: string }>();
  let employeeId = params?.employeeId ?? "";
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }

  const { data, isLoading } = useGetEmployeeDocumentQuery(employeeId);
  const [deleteDocument] = useDeleteEmployeeDocumentMutation();

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
      <Card>
        <CardHeader className="border-0 flex-row pb-0 w-full flex items-center justify-between">
          <CardTitle>Documents</CardTitle>
          <UploadDialog className="mt-0">
            <Upload className="size-4 mr-2" />
            Upload
          </UploadDialog>
        </CardHeader>
        <CardContent>
          {data?.result && data?.result?.documents.length! > 0 ? (
            <ul className="grid md:grid-cols-3 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
              {data.result.documents.map((document, index) => {
                return (
                  <li
                    key={index}
                    className="col-span-1 rounded bg-light p-3 border-border border flex flex-col"
                  >
                    <div className="w-full bg-border rounded mx-auto mb-4 items-center h-[160px] p-1.5 flex justify-center">
                      <FileManager
                        setFile={() => {}}
                        enable={false}
                        existingFile={document.file}
                        folder={`${company_name.replace(/\s/g, "-").toLowerCase()}`}
                        maxSize={MAX_SIZE}
                        permission="public-read"
                        className="h-[150px]"
                      />
                    </div>
                    <div className="flex justify-between mt-auto">
                      <p className="text-sm text-text-light line-clamp-1">
                        {document.name}
                      </p>

                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Ellipsis className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <UploadDialog
                              size={"sm"}
                              type="button"
                              file={document.file}
                              variant={"outline"}
                              className="h-auto p-1.5 border-none w-full justify-start bg-transparent max-w-sm"
                            >
                              Preview
                            </UploadDialog>
                          </DropdownMenuItem>
                          {(session?.user.role === "admin" ||
                            session?.user.role === "moderator") && (
                            <DropdownMenuItem asChild>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size={"sm"}
                                    className="border-none w-full bg-transparent text-left justify-start text-sm h-auto py-1.5 px-1.5 text-text-dark hover:text-white"
                                    variant={"destructive"}
                                    type="button"
                                  >
                                    Delete
                                  </Button>
                                </DialogTrigger>

                                <ConfirmationPopup
                                  handleConfirmation={async () => {
                                    const encodedKey = encodeURIComponent(
                                      document.file
                                    );
                                    const res = await axios.delete(
                                      `bucket/delete/${encodedKey}`
                                    );
                                    if (res.status !== 200) {
                                      return;
                                    }
                                    deleteDocument({
                                      documentId: document._id!,
                                      employeeId: employeeId,
                                    });
                                  }}
                                />
                              </Dialog>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-4">No documents uploaded</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

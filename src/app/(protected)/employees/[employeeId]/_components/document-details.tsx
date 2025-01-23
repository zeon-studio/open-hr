import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUCKET_URL } from "@/lib/constant";
import {
  useDeleteEmployeeDocumentMutation,
  useGetEmployeeDocumentQuery,
} from "@/redux/features/employeeDocumentApiSlice/employeeDocumentSlice";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import UploadDialog from "./upload-dialog";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Document() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { data, isLoading } = useGetEmployeeDocumentQuery(employeeId);
  const [deleteDocument, { isLoading: isDeleting }] =
    useDeleteEmployeeDocumentMutation();

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
            <ul className="grid grid-cols-5 gap-4">
              {data.result.documents.map((document, index) => {
                return (
                  <li
                    key={index}
                    className="col-span-1 rounded bg-light p-3 border-border/30 border"
                  >
                    <div className="w-[196px] aspect-[16/12] bg-border/30 rounded mx-auto mb-4 items-center flex">
                      <img
                        src={`${BUCKET_URL}/${document.file}`}
                        alt={document.name}
                        className="max-w-full w-auto h-auto mx-auto flex-none"
                      />
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-text-light line-clamp-1">
                        {document.name}
                      </p>

                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size={"sm"}
                                  className="border-none w-full bg-transparent text-left justify-start text-sm h-auto py-1.5 px-1.5"
                                  variant={"outline"}
                                  type="button"
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      deleteDocument(employeeId);
                                    }}
                                    disabled={isDeleting}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>
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

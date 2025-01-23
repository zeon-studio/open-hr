import {
  FileInput,
  FileUploader,
  FileUploaderContent,
} from "@/components/ui/file-uploader";
import useAxios from "@/hooks/useAxios";
import { BUCKET_URL } from "@/lib/constant";
import { cn } from "@/lib/shadcn";
import { Dialog } from "@radix-ui/react-dialog";
import { CloudUpload, Paperclip, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ConfirmationPopup from "./ConfirmationPopup";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";

const FileManager = ({
  enable,
  existingFile,
  folder,
  maxSize,
  permission,
  setFile,
}: {
  enable: boolean;
  existingFile: string | null | undefined;
  folder: string;
  maxSize: number;
  permission: string;
  setFile: any;
}) => {
  const session = useSession();
  const axios = useAxios(session);
  const router = useRouter();
  const [files, setFiles] = useState<File[] | null>(null);
  const [location, setLocation] = useState<string>(existingFile || "");

  const dropZoneConfig = {
    maxFiles: 1,
    maxSize: maxSize,
    multiple: false,
    disabled: !enable,
  };

  // get presigned url
  const getPresignedUrl = async (key: string) => {
    try {
      const encodedKey = encodeURIComponent(key);
      const endpoint = `/bucket/download/${encodedKey}`;

      const res = await axios.get(endpoint);
      const body = res.data;

      router.push(body.url);
    } catch (error) {
      console.error("Failed to get presigned URL", error);
    }
  };

  // handle upload
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("folder", folder);
      formData.append("permission", permission);
      if (files?.length) {
        formData.append("file", files[0]);
      }
      const res = await axios.post("bucket/upload", formData);
      const {
        result: { key },
      } = res.data;

      setLocation(key);
    } catch (error) {
      console.log(error);
    }
  };

  // handle delete
  const handleDelete = async (key: string) => {
    try {
      const encodedKey = encodeURIComponent(key);
      const res = await axios.delete(`bucket/delete/${encodedKey}`);

      if (res.status === 200) {
        setLocation("");
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        setLocation("");
      }
    }
  };

  // handle download
  const handleDownload = async (key: string) => {
    getPresignedUrl(key);
  };

  // set location
  useEffect(() => {
    setFile(location);
  }, [location]);

  return (
    <div className="text-center">
      {!location ? (
        <FileUploader
          value={files}
          onValueChange={setFiles}
          dropzoneOptions={dropZoneConfig}
          className={cn(
            "relative bg-slate-100 border border-border/30 mt-4 rounded p-8",
            !enable && "opacity-50 cursor-not-allowed outline",
            files?.length && "bg-transparent p-0 border-transparent"
          )}
        >
          <FileInput>
            <div
              className={cn(
                "flex items-center justify-center flex-col pt-3 pb-4 w-full",
                files?.length && "hidden"
              )}
            >
              <CloudUpload className="text-text-light" />
              <p className="text-text-light text-sm">
                Drag and Drop or{" "}
                <Button className="p-0" variant={"link"}>
                  Choose file
                </Button>
              </p>
            </div>
          </FileInput>
          <FileUploaderContent>
            {files &&
              files.length > 0 &&
              files.map((file, i) => (
                <React.Fragment key={i}>
                  {file.type.includes("image") && (
                    <img
                      src={`${URL.createObjectURL(file)}`}
                      alt={file.name}
                      className="object-cover aspect-video w-auto max-w-full rounded-md"
                      height={300}
                      width={400}
                    />
                  )}
                  <div className="flex justify-end space-x-3 mt-5">
                    <Button type="button" onClick={handleUpload}>
                      Upload
                    </Button>
                    <Button
                      onClick={() => {
                        setFiles(files.filter((f) => f !== file));
                      }}
                      variant={"destructive"}
                      type="button"
                    >
                      <Trash2 className="size-4 mr-2" /> Delete
                    </Button>
                  </div>
                </React.Fragment>
              ))}
          </FileUploaderContent>
        </FileUploader>
      ) : (
        <div className="flex items-center justify-center flex-col pb-4 w-full">
          {/* preview only if it's an image and permission is public-read */}
          {permission === "public-read" &&
          (location.split(".").pop() === "jpg" ||
            location.split(".").pop() === "png" ||
            location.split(".").pop() === "jpeg" ||
            location.split(".").pop() === "gif" ||
            location.split(".").pop() === "avif" ||
            location.split(".").pop() === "webp") ? (
            <div className="max-h-[300px] overflow-auto">
              <img
                src={`${BUCKET_URL}/${location}`}
                alt={location}
                className="object-cover rounded-md"
                width={400}
              />
            </div>
          ) : (
            <div className="bg-light px-4 py-4 rounded flex w-full items-center justify-center">
              <Paperclip className="h-4 w-4 mr-2 stroke-current" />
              {location.split(".").pop()}
            </div>
          )}

          <div className="space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  size={"sm"}
                  variant={"outline"}
                  className="mt-3"
                >
                  Delete
                </Button>
              </DialogTrigger>
              <ConfirmationPopup
                skipWrite={true}
                handleConfirmation={() => handleDelete(location)}
                description="Deleting will permanently delete this file from the Bucket."
              />
            </Dialog>
            <Button
              onClick={() => handleDownload(location)}
              type="button"
              size={"sm"}
              className="mt-3"
            >
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;

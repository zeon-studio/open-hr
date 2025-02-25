import useAxios from "@/hooks/useAxios";
import { BUCKET_URL } from "@/lib/constant";
import { cn } from "@/lib/shadcn";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
} from "@/ui/file-uploader";
import { CloudUpload, Loader2, Paperclip, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const FileManager = ({
  enable,
  existingFile,
  folder,
  maxSize,
  permission,
  setFile,
  isLoading,
  className,
}: {
  enable: boolean;
  existingFile: string | null | undefined;
  folder: string;
  maxSize: number;
  permission: string;
  setFile: any;
  isLoading?: boolean;
  className?: string;
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
      console.log(error);
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

  // handle download
  const handleDownload = async (key: string) => {
    getPresignedUrl(key);
  };

  // set location
  useEffect(() => {
    setFile(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className="text-center">
      {!location || isLoading ? (
        <FileUploader
          value={files}
          onValueChange={setFiles}
          dropzoneOptions={dropZoneConfig}
          className={cn(
            "relative bg-slate-100 border border-border rounded p-8",
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
                  <div className="flex justify-between space-x-3 mt-5">
                    <Button
                      onClick={() => {
                        setFiles(files.filter((f) => f !== file));
                      }}
                      variant={"destructive"}
                      type="button"
                    >
                      <Trash2 className="size-4 mr-2" /> Delete
                    </Button>
                    <Button
                      disabled={isLoading}
                      type="button"
                      onClick={handleUpload}
                    >
                      {isLoading ? (
                        <>
                          <span>Uploading</span>
                          <Loader2 className="size-4 animate-spin ml-2" />
                        </>
                      ) : (
                        "Upload"
                      )}
                    </Button>
                  </div>
                </React.Fragment>
              ))}
          </FileUploaderContent>
        </FileUploader>
      ) : (
        <div className="flex items-center justify-center flex-col w-full">
          {/* preview only if it's an image and permission is public-read */}
          {permission === "public-read" &&
          (location.split(".").pop() === "jpg" ||
            location.split(".").pop() === "png" ||
            location.split(".").pop() === "jpeg" ||
            location.split(".").pop() === "gif" ||
            location.split(".").pop() === "avif" ||
            location.split(".").pop() === "webp") ? (
            <div
              className={cn("max-h-[400px] overflow-auto rounded", className)}
            >
              <img
                src={`${BUCKET_URL}/${location}`}
                alt={location}
                className="object-cover h-full rounded-md"
                width={400}
              />
            </div>
          ) : (
            <div className="bg-light px-4 py-4 rounded flex w-full items-center justify-center">
              <Paperclip className="h-4 w-4 mr-2 stroke-current" />
              {location.split(".").pop()}
            </div>
          )}

          {enable && (
            <div className="space-x-4">
              <Button
                onClick={() => handleDownload(location)}
                type="button"
                size={"sm"}
                className="mt-3"
              >
                Download
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileManager;

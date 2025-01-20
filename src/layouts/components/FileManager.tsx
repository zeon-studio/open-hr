import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import useAxios from "@/hooks/useAxios";
import { Dialog } from "@radix-ui/react-dialog";
import { Paperclip } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ConfirmationPopup from "./ConfirmationPopup";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";

const bucket = process.env.NEXT_PUBLIC_BUCKET_URL;

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
    </>
  );
};

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
          className={`relative bg-light rounded-lg p-2 ${!enable && "opacity-50 cursor-not-allowed"}`}
        >
          <FileInput className="outline-dashed outline-1 outline-white">
            <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
              <FileSvgDraw />
            </div>
          </FileInput>
          <FileUploaderContent>
            {files &&
              files.length > 0 &&
              files.map((file, i) => (
                <React.Fragment key={i}>
                  <FileUploaderItem key={i} index={i}>
                    <Paperclip className="h-4 w-4 stroke-current" />
                    <span>{file.name}</span>
                  </FileUploaderItem>
                  {file.type.includes("image") && (
                    <img
                      src={`${URL.createObjectURL(file)}`}
                      alt={file.name}
                      className="object-cover max-w-full rounded-md"
                      height={300}
                      width={400}
                    />
                  )}
                  <Button type="button" size={"sm"} onClick={handleUpload}>
                    Upload
                  </Button>
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
                src={`${bucket}/${location}`}
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

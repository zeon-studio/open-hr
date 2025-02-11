"use client";

import ConfirmationPopup from "@/components/confirmation-popup";
import { useDialog } from "@/hooks/useDialog";
import { useDeleteToolMutation } from "@/redux/features/toolApiSlice/toolSlice";
import { TTool } from "@/redux/features/toolApiSlice/toolType";
import { Button } from "@/ui/button";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { TableCell, TableRow } from "@/ui/table";
import { Ellipsis, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";
import { toast } from "sonner";
import ToolPreview from "./tool-preview";
import ToolUpdate from "./tool-update";

const ToolPage = ({ tool }: { tool: TTool[] }) => {
  const [toolId, setToolId] = useState<string>("");

  return (
    <>
      {tool?.map((item) => (
        <MemoizedToolModal
          toolId={toolId}
          setToolId={setToolId}
          key={item._id}
          item={item}
        />
      ))}
    </>
  );
};

export default ToolPage;

const ToolModal = ({
  item,
  toolId,
  setToolId,
}: {
  item: TTool;
  toolId: string;
  setToolId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { isDialogOpen, onDialogChange } = useDialog();

  // Simulate fetching tool data
  const singleTool = useMemo(() => {
    return toolId === item._id ? item : null;
  }, [toolId, item]);

  const [deleteTool] = useDeleteToolMutation();

  const handleToolDelete = () => {
    deleteTool(item._id);
    toast("Tool deleted complete");
  };

  return (
    <DropdownMenu key={item._id}>
      <TableRow>
        <TableCell>
          <div className="flex items-center">
            <Image
              src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${item.website}&size=64`}
              alt={item.platform}
              width={50}
              height={50}
              className="rounded border object-cover shrink-0 hidden lg:block mr-2"
            />
            <p className="mb-0 font-medium">{item.platform}</p>
          </div>
        </TableCell>
        <TableCell>
          <Link
            href={item.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            {item.website}
            <ExternalLink className="inline-block ml-1 -mt-1 size-[1em]" />
          </Link>
        </TableCell>
        <TableCell>{item.organizations?.length}</TableCell>
        <TableCell className="text-right">
          <DropdownMenuTrigger>
            <Ellipsis className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* preview */}
            <DropdownMenuItem asChild>
              <Dialog modal={true}>
                <DialogTrigger asChild onClick={() => setToolId(item?._id!)}>
                  <Button
                    className="w-full justify-start"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    Preview
                  </Button>
                </DialogTrigger>
                {singleTool?._id && <ToolPreview toolData={singleTool!} />}
              </Dialog>
            </DropdownMenuItem>
            {/* edit */}
            <DropdownMenuItem asChild>
              <Dialog
                modal={true}
                open={isDialogOpen}
                onOpenChange={onDialogChange}
              >
                <DialogTrigger asChild onClick={() => setToolId(item?._id!)}>
                  <Button
                    className="w-full justify-start"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                {singleTool?._id && (
                  <ToolUpdate
                    tool={singleTool!}
                    onDialogChange={onDialogChange}
                  />
                )}
              </Dialog>
            </DropdownMenuItem>
            {/* delete */}
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger asChild onClick={() => setToolId(item?._id!)}>
                  <Button
                    className="w-full text-destructive hover:bg-destructive justify-start"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                {singleTool?._id && (
                  <ConfirmationPopup
                    handleConfirmation={handleToolDelete}
                    id={singleTool?._id!}
                  />
                )}
              </Dialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </TableCell>
      </TableRow>
    </DropdownMenu>
  );
};

const MemoizedToolModal = memo(ToolModal);

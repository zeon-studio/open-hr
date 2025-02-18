"use client";

import ConfirmationPopup from "@/components/confirmation-popup";
import UserInfo from "@/components/user-info";
import { useDialog } from "@/hooks/useDialog";
import { dateFormat } from "@/lib/date-converter";
import { employeeInfoById } from "@/lib/employee-info";
import { useDeleteAssetMutation } from "@/redux/features/assetApiSlice/assetSlice";
import { TAsset } from "@/redux/features/assetApiSlice/assetType";
import { Button } from "@/ui/button";
import { Dialog, DialogTrigger } from "@/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { TableCell, TableRow } from "@/ui/table";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { memo, useMemo, useState } from "react";
import { toast } from "sonner";
import AssetPreview from "./asset-preview";
import AssetUpdate from "./asset-update";

const AssetPage = ({ asset }: { asset: TAsset[] }) => {
  const [assetId, setAssetId] = useState<string>("");

  return (
    <>
      {asset?.map((item) => (
        <MemoizedAssetModal
          assetId={assetId}
          setAssetId={setAssetId}
          key={item.asset_id}
          item={item}
        />
      ))}
    </>
  );
};

export default AssetPage;

const AssetModal = ({
  item,
  assetId,
  setAssetId,
}: {
  item: TAsset;
  assetId: string;
  setAssetId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { isDialogOpen, onDialogChange } = useDialog();

  // Simulate fetching asset data
  const singleAsset = useMemo(() => {
    return assetId === item.asset_id ? item : null;
  }, [assetId, item]);

  const [deleteAsset] = useDeleteAssetMutation();

  const handleAssetDelete = () => {
    deleteAsset(item.asset_id);
    toast("Asset deleted complete");
  };

  return (
    <DropdownMenu key={item.asset_id}>
      <TableRow>
        <TableCell>
          <div className="flex items-center">
            <Image
              src={`/images/assets/${item.type}.png`}
              alt={item.name}
              width={50}
              height={50}
              className="rounded-md border border-border mr-2 shrink-0"
            />
            <p className="mb-0 capitalize font-medium">{item.name}</p>
          </div>
        </TableCell>
        <TableCell>
          <UserInfo user={employeeInfoById(item.user)} />
        </TableCell>
        <TableCell>{item.asset_id}</TableCell>
        <TableCell>
          {item.price} <span className="uppercase">{item.currency}</span>
        </TableCell>
        <TableCell>{dateFormat(item.purchase_date)}</TableCell>
        <TableCell className="text-right">
          <DropdownMenuTrigger>
            <Ellipsis className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* preview */}
            <DropdownMenuItem asChild>
              <Dialog modal={true}>
                <DialogTrigger
                  asChild
                  onClick={() => setAssetId(item?.asset_id!)}
                >
                  <Button
                    className="w-full justify-start"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    Preview
                  </Button>
                </DialogTrigger>
                {singleAsset?.asset_id && (
                  <AssetPreview assetData={singleAsset!} />
                )}
              </Dialog>
            </DropdownMenuItem>
            {/* edit */}
            <DropdownMenuItem asChild>
              <Dialog
                modal={true}
                open={isDialogOpen}
                onOpenChange={onDialogChange}
              >
                <DialogTrigger
                  asChild
                  onClick={() => setAssetId(item?.asset_id!)}
                >
                  <Button
                    className="w-full justify-start"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                {singleAsset?.asset_id && (
                  <AssetUpdate
                    asset={singleAsset!}
                    onDialogChange={onDialogChange}
                  />
                )}
              </Dialog>
            </DropdownMenuItem>
            {/* delete */}
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger
                  asChild
                  onClick={() => setAssetId(item?.asset_id!)}
                >
                  <Button
                    className="w-full text-destructive hover:bg-destructive justify-start"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                {singleAsset?.asset_id && (
                  <ConfirmationPopup
                    handleConfirmation={handleAssetDelete}
                    id={singleAsset?.asset_id!}
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

const MemoizedAssetModal = memo(AssetModal);

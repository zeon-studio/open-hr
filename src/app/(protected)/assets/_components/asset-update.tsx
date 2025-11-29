import { useUpdateAssetMutation } from "@/redux/features/assetApiSlice/assetSlice";
import { TAsset } from "@/redux/features/assetApiSlice/assetType";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AssetForm from "./asset-form";

const AssetUpdate = ({
  asset,
  onDialogChange,
}: {
  asset: TAsset;
  onDialogChange: (open: boolean) => void;
}) => {
  const [loader, setLoader] = useState(false);
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const [assetData, setAssetData] = useState({
    asset_id: asset.asset_id,
    name: asset.name,
    user: asset.user,
    type: asset.type,
    price: asset.price,
    currency: asset.currency,
    purchase_date: asset.purchase_date,
    serial_number: asset.serial_number,
    status: asset.status,
    note: asset.note,
    logs: asset.logs,
  });

  const [updateAsset, { isSuccess, isError, error }] = useUpdateAssetMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    updateAsset(assetData);
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      toast("Asset Update complete");
      // close modal
      onDialogChange(false);
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <DialogContent ref={dialogContentRef} className="max-w-4xl!">
      <DialogTitle className="mb-4">Update Asset</DialogTitle>
      <div className="max-h-[90vh] overflow-y-auto pr-2">
        <AssetForm
          assetData={assetData}
          setAssetData={setAssetData}
          handleSubmit={handleSubmit}
          formType="update"
          loader={loader}
          popoverContainer={dialogContentRef.current}
        />
      </div>
    </DialogContent>
  );
};

export default AssetUpdate;

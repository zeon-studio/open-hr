import { useAddAssetMutation } from "@/redux/features/assetApiSlice/assetSlice";
import { TAsset } from "@/redux/features/assetApiSlice/assetType";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AssetForm from "./asset-form";

const AssetInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  const [addAsset, { isSuccess, isError }] = useAddAssetMutation();
  const [loader, setLoader] = useState(false);
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
  const [assetData, setAssetData] = useState<TAsset>({
    name: "",
    user: "",
    type: "other",
    serial_number: "",
    price: 0,
    currency: "bdt",
    purchase_date: new Date(),
    status: "archived",
    note: "",
    logs: [],
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      addAsset(assetData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      setAssetData({
        name: "",
        user: "",
        type: "other",
        serial_number: "",
        price: 0,
        currency: "bdt",
        purchase_date: new Date(),
        status: "archived",
        note: "",
        logs: [],
      });
      toast("Asset added complete");
      // close modal/dialog
      onDialogChange(false);
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <DialogContent ref={dialogContentRef} className="max-w-4xl!">
      <DialogTitle className="mb-4">Add Asset</DialogTitle>
      <div className="max-h-[90vh] overflow-y-auto pr-2">
        <AssetForm
          assetData={assetData}
          setAssetData={setAssetData}
          handleSubmit={handleSubmit}
          loader={loader}
          formType="insert"
          popoverContainer={dialogContentRef.current}
        />
      </div>
    </DialogContent>
  );
};

export default AssetInsert;

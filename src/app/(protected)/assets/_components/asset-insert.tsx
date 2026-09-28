import { useAddAssetMutation } from "@/features/asset/api";
import type { TAsset } from "@/types/asset";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import AssetForm from "./asset-form";

const AssetInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  const [addAsset, { isSuccess, isError, error }] = useAddAssetMutation();
  const [loader, setLoader] = useState(false);
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
      toast((error as any)?.data?.message || "Something went wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <DialogContent className="max-w-4xl!">
      <DialogTitle className="mb-4">Add Asset</DialogTitle>
      <div className="max-h-[90vh] overflow-y-auto pr-2">
        <AssetForm
          assetData={assetData}
          setAssetData={setAssetData}
          handleSubmit={handleSubmit}
          loader={loader}
          formType="insert"
        />
      </div>
    </DialogContent>
  );
};

export default AssetInsert;

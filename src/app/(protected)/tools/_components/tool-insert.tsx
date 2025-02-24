import { useAddToolMutation } from "@/redux/features/toolApiSlice/toolSlice";
import { TTool } from "@/redux/features/toolApiSlice/toolType";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ToolForm from "./tool-form";

const ToolInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  const [addTool, { isSuccess, isError }] = useAddToolMutation();
  const [loader, setLoader] = useState(false);
  const [toolData, setToolData] = useState<TTool>({
    platform: "",
    website: "",
    organizations: [
      {
        name: "",
        login_id: "",
        password: "",
        price: 0,
        currency: "bdt",
        billing: "onetime",
        users: [],
      },
    ],
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      addTool(toolData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      setToolData({
        platform: "",
        website: "",
        organizations: [
          {
            name: "",
            login_id: "",
            password: "",
            price: 0,
            currency: "bdt",
            billing: "onetime",
            users: [],
          },
        ],
      });
      toast("Tool added complete");
      // close modal/dialog
      onDialogChange(false);
    } else if (isError) {
      setLoader(false);
      toast("Something went wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  return (
    <DialogContent
      className="!max-w-4xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Add New Tool Platform</DialogTitle>
      <ToolForm
        toolData={toolData}
        setToolData={setToolData}
        handleSubmit={handleSubmit}
        loader={loader}
        formType="insert"
      />
    </DialogContent>
  );
};

export default ToolInsert;

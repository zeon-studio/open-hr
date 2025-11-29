import { useAddToolMutation } from "@/redux/features/toolApiSlice/toolSlice";
import { TTool } from "@/redux/features/toolApiSlice/toolType";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ToolForm from "./tool-form";

const ToolInsert = ({
  onDialogChange,
}: {
  onDialogChange: (open: boolean) => void;
}) => {
  const [addTool, { isSuccess, isError }] = useAddToolMutation();
  const [loader, setLoader] = useState(false);
  const dialogContentRef = useRef<HTMLDivElement | null>(null);
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
        status: "active",
        logs: [],
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
            status: "active",
            logs: [],
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
    <DialogContent ref={dialogContentRef} className="max-w-4xl!">
      <DialogTitle className="mb-4">Add New Tool Platform</DialogTitle>
      <div className="max-h-[90vh] overflow-y-auto pr-2">
        <ToolForm
          toolData={toolData}
          setToolData={setToolData}
          handleSubmit={handleSubmit}
          loader={loader}
          formType="insert"
          popoverContainer={dialogContentRef.current}
        />
      </div>
    </DialogContent>
  );
};

export default ToolInsert;

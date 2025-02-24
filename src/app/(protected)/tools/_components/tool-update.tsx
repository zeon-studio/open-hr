import { useUpdateToolMutation } from "@/redux/features/toolApiSlice/toolSlice";
import { TTool } from "@/redux/features/toolApiSlice/toolType";
import { DialogContent, DialogTitle } from "@/ui/dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ToolForm from "./tool-form";

const ToolUpdate = ({
  tool,
  onDialogChange,
}: {
  tool: TTool;
  onDialogChange: (open: boolean) => void;
}) => {
  const [loader, setLoader] = useState(false);
  const [toolData, setToolData] = useState({
    _id: tool._id,
    platform: tool.platform,
    website: tool.website,
    organizations: tool.organizations,
  });

  const [updateTool, { isSuccess, isError, error }] = useUpdateToolMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    updateTool(toolData);
  };

  useEffect(() => {
    if (isSuccess) {
      setLoader(false);
      toast("Tool Update complete");
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
    <DialogContent
      className="!max-w-4xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Update Tool Platform</DialogTitle>
      <ToolForm
        toolData={toolData}
        setToolData={setToolData}
        handleSubmit={handleSubmit}
        formType="update"
        loader={loader}
      />
    </DialogContent>
  );
};

export default ToolUpdate;

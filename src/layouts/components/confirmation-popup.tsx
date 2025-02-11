import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "./ui/button";

const ConfirmationPopup = ({
  handleConfirmation,
  id,
  skipWrite = false,
  description,
}: {
  handleConfirmation: (id?: string) => void;
  id?: string;
  skipWrite?: boolean;
  description?: string;
}) => {
  const [hasConfirmed, setHasConfirmed] = useState("");

  return (
    <DialogContent>
      <DialogHeader className="mb-4">
        <DialogTitle className="mb-2">Are You Sure?</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      {!skipWrite && (
        <Input
          type="text"
          placeholder="Type CONFIRM to confirm"
          className="mb-4"
          onChange={(e) => setHasConfirmed(e.target.value)}
        />
      )}
      <div className="flex space-x-4">
        <div className="flex space-x-4">
          <DialogClose asChild>
            <Button
              disabled={!skipWrite && hasConfirmed !== "CONFIRM"}
              onClick={() => handleConfirmation(id)}
            >
              Confirm
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </div>
      </div>
    </DialogContent>
  );
};

export default ConfirmationPopup;

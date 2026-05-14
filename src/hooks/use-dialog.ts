import { useState } from "react";

export const useDialog = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const onDialogChange = (_value = !isDialogOpen) => {
    setDialogOpen(_value);
  };

  return { isDialogOpen, onDialogChange };
};

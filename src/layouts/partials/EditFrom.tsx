import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Pen } from "lucide-react";
import React, { RefObject, useEffect, useState } from "react";

export default function EditFrom<T>({
  children,
  data: initialData,
  isUpdating,
  formRef,
}: {
  children: ({
    handleChange,
  }: {
    handleChange: (value: T) => void;
    isReadOnly: boolean;
    data: T;
  }) => React.ReactNode;
  data: T;
  isUpdating?: boolean;
  formRef: RefObject<HTMLFormElement | null>;
}) {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [data, setData] = useState<T>(initialData);

  const handleChange = (value: T) => {
    setData(value);
  };

  useEffect(() => {
    if (isUpdating) {
      setIsReadOnly(false);
    }
  }, [isUpdating]);

  return (
    <Card className="border-none mb-0">
      <CardTitle className="justify-between flex items-center">
        <span>Personal Details</span>
        {isReadOnly ? (
          <Button
            onClick={() => {
              setIsReadOnly(false);
            }}
            type="button"
            size={"sm"}
            className="space-x-1"
            variant={"outline"}
          >
            <Pen className="size-4" />
            <span>Edit</span>
          </Button>
        ) : (
          <Button
            onClick={() => {
              formRef.current?.requestSubmit();
            }}
            type="button"
            size={"sm"}
            className="space-x-1"
            variant={"outline"}
            disabled={isUpdating}
          >
            {isUpdating && <Loader2 className="size-4 animate-spin" />}
            <Check className="size-4" />
            <span>Save</span>
          </Button>
        )}
      </CardTitle>
      <CardContent className="pl-0">
        {children({ handleChange, isReadOnly, data })}
      </CardContent>
    </Card>
  );
}

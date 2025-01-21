import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Check, Pen } from "lucide-react";
import React, { useState } from "react";

export default function EditFrom<T>({
  children,
  data: initialData,
}: {
  children: ({
    handleChange,
  }: {
    handleChange: (value: T) => void;
    isReadOnly: boolean;
    data: T;
  }) => React.ReactNode;
  data: T;
}) {
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [data, setData] = useState<T>(initialData);

  const handleChange = (value: T) => {
    setData(value);
  };

  return (
    <Card className="border-none">
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
              setIsReadOnly(false);
            }}
            type="button"
            size={"sm"}
            className="space-x-1"
            variant={"outline"}
          >
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

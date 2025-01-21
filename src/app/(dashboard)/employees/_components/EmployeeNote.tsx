import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateEmployeeNoteMutation } from "@/redux/features/employeeApiSlice/employeeSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { useEffect, useState } from "react";

const EmployeeNote = ({ employee }: { employee: TEmployee }) => {
  const [note, setNote] = useState<string>(employee?.note);
  const [updated, setUpdated] = useState<boolean>(false);
  const [updateEmployeeNote] = useUpdateEmployeeNoteMutation();
  const { toast } = useToast();

  useEffect(() => {
    setUpdated(false);
  }, [note]);

  useEffect(() => {
    setNote(employee?.note);
  }, [employee?.note]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateEmployeeNote({
      id: employee?.id,
      note: note,
    });
    setUpdated(true);
    toast({
      title: "Note Updated",
      variant: "success",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-base">Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Textarea
            name="note"
            id="note"
            onChange={(e) => setNote(e.target.value)}
            value={note}
          />
          <Button
            disabled={note === employee?.note || updated}
            className="w-full text-white mt-4"
            type="submit"
          >
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmployeeNote;

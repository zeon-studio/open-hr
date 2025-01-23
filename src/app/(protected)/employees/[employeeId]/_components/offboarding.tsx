import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/shadcn";
import { useAddEmployeeOffboardingMutation } from "@/redux/features/employeeOffboardingApiSlice/employeeOffboardingSlice";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Offboarding() {
  const router = useRouter();
  const date = new Date().toISOString();
  const [offboarding, { isLoading }] = useAddEmployeeOffboardingMutation();

  return (
    <div>
      <h5>Onboarding</h5>
      <Card>
        <CardHeader>
          <CardTitle>
            <Button
              className="p-0"
              type="button"
              variant={"link"}
              onClick={router.back}
            >
              <ChevronLeft className="size-4 mr-3" />
              Back
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block">Resignation Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-between text-left w-full font-normal border-border/30",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="block">Last Working day</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-between text-left w-full font-normal border-border/30",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="block">Reason</Label>
              <Textarea
                placeholder="Disable Access to Internal System & Shared
Drive"
              />
            </div>

            <div className="col-span-2">
              <Button type="button">
                <Plus className="size-5" />
                Add Document File
              </Button>
            </div>

            <div className="space-x-3">
              <Button>Save</Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

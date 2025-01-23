import { Card, CardContent } from "@/components/ui/card";
import { useGetEmployeeOffboardingQuery } from "@/redux/features/employeeOffboardingApiSlice/employeeOffboardingSlice";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function Offboarding() {
  const router = useRouter();
  const { employeeId } = useParams<{ employeeId: string }>();
  const { data, isLoading } = useGetEmployeeOffboardingQuery(employeeId);
  const task = data?.result ?? {};

  return (
    <div>
      <h5 className="mb-4">Onboarding</h5>

      <Card>
        <CardContent className={isLoading ? "py-20" : "p-0 overflow-hidden"}>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          ) : data?.result ? (
            <div className="flex flex-col gap-4">
              <ul className="space-y-3">
                <li className="row mx-0 space-y-3 lg:space-y-0 2xl:row-cols-5 items-center bg-light rounded py-3">
                  <div className="flex items-center">
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Task Name:
                      </small>
                      <strong className="text-h6 font-medium capitalize"></strong>
                    </div>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      Assign To:
                    </small>
                    <strong className="text-h6 font-medium capitalize"></strong>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      Designation:
                    </small>
                    <strong className="text-h6 font-medium"></strong>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      Due Date:
                    </small>
                    <strong className="text-h6 font-medium capitalize"></strong>
                  </div>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <p className="text-center text-muted-foreground"></p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { useGetAssetsByUserQuery } from "@/redux/features/assetApiSlice/assetSlice";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function Assets() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { data, isLoading } = useGetAssetsByUserQuery(employeeId);

  return (
    <div>
      <h5 className="mb-4">Courses</h5>
      <Card>
        <CardContent
          className={
            isLoading || !data?.result.length! ? "py-20" : "p-0 overflow-hidden"
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          ) : data?.result.length! > 0 ? (
            <div className="flex flex-col gap-4">
              <ul className="space-y-3">
                {data?.result?.map((asset) => (
                  <li
                    className="row mx-0 space-y-3 lg:space-y-0 2xl:row-cols-4 items-center bg-light rounded py-3"
                    key={asset.asset_id}
                  >
                    <div className="flex items-center">
                      <div>
                        <small className="text-xs text-muted-foreground block">
                          Name:
                        </small>
                        <strong className="text-h6 font-medium capitalize">
                          {asset.name}
                        </strong>
                      </div>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Serial No:
                      </small>
                      <strong className="text-h6 font-medium capitalize">
                        {asset.serial_number}
                      </strong>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Purchase Date:
                      </small>
                      <strong className="text-h6 font-medium capitalize">
                        {asset.purchase_date &&
                          format(new Date(asset.purchase_date), "MMM d, yyyy")}
                      </strong>
                    </div>

                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Handover Date:
                      </small>
                      <strong className="text-h6 font-medium">
                        {asset.handover.date &&
                          format(new Date(asset.handover.date), "MMM d, yyyy")}
                      </strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <p className="text-center text-muted-foreground">
                No Assets Found
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

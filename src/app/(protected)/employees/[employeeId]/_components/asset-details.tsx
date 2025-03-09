import { useGetAssetsByUserQuery } from "@/redux/features/assetApiSlice/assetSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function Assets() {
  const { data: session } = useSession();
  const params = useParams<{ employeeId: string }>();
  let employeeId = params?.employeeId ?? "";
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
  const { data, isLoading } = useGetAssetsByUserQuery(employeeId);

  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader className="border-b-transparent">
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent
          className={
            isLoading || !data?.result.length!
              ? "py-20"
              : "overflow-hidden pt-0"
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
                    className="row !mx-0 space-y-3 xl:space-y-0 xl:row-cols-4 items-center bg-light rounded py-3"
                    key={asset.asset_id}
                  >
                    <div className="flex items-center xl:space-x-3">
                      <Image
                        src={`/images/assets/${asset.type}.png`}
                        alt={asset.name}
                        width={50}
                        height={50}
                        className="hidden xl:block rounded-md border border-border mr-2 shrink-0"
                      />

                      <div>
                        <small className="text-xs text-muted-foreground block">
                          Name:
                        </small>
                        <strong className="line-clamp-1 text-sm font-medium capitalize">
                          {asset.name}
                        </strong>
                      </div>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Tag No:
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {asset.asset_id}
                      </strong>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Purchase Date:
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {asset.purchase_date &&
                          format(new Date(asset.purchase_date), "MMM d, yyyy")}
                      </strong>
                    </div>

                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Handover Date:
                      </small>
                      <strong className="text-sm font-medium">
                        {asset.handover?.date &&
                          format(new Date(asset.handover?.date), "MMM d, yyyy")}
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

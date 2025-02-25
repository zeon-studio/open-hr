import { dateFormat } from "@/lib/date-converter";
import { useGetAssetsByUserQuery } from "@/redux/features/assetApiSlice/assetSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Package } from "lucide-react";
import Image from "next/image";

const UserAssets = ({ userId }: { userId: string }) => {
  const { data } = useGetAssetsByUserQuery(userId);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <Package className="mr-2 inline-block" />
          Your Assets
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data?.result?.length === 0 ? (
          <p className="text-center text-muted-foreground">No Assets Found</p>
        ) : (
          <div className="flex flex-col gap-4">
            <ul className="space-y-3">
              {data?.result?.map((asset) => (
                <li
                  className="row !mx-0 row-cols-3 items-center bg-light rounded py-3"
                  key={asset.asset_id}
                >
                  <div className="flex items-center">
                    <Image
                      src={`/images/assets/${asset.type}.png`}
                      alt={asset.name}
                      width={50}
                      height={50}
                      className="rounded-md shrink-0"
                    />
                    <div className="ml-4">
                      <small className="text-xs text-muted-foreground block">
                        Name:
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {asset.name}
                      </strong>
                    </div>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      Tag ID:
                    </small>
                    <strong className="text-sm font-medium capitalize">
                      {asset.asset_id}
                    </strong>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      Using From:
                    </small>
                    <strong className="text-sm font-medium capitalize">
                      {dateFormat(asset.handover?.date)}
                    </strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserAssets;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAssetsByUserQuery } from "@/redux/features/assetApiSlice/assetSlice";
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
      <CardContent className="h-[300px] scroll-box">
        {data?.result?.length === 0 ? (
          <p className="text-center text-muted-foreground">No assets found</p>
        ) : (
          <div className="flex flex-col gap-4">
            <ul className="space-y-3">
              {data?.result?.map((asset) => (
                <li
                  className="flex items-center bg-light rounded p-3"
                  key={asset.asset_id}
                >
                  <Image
                    src={`/images/assets/${asset.type}.png`}
                    alt={asset.name}
                    width={50}
                    height={50}
                    className="rounded-md shrink-0"
                  />
                  <div className="ml-3">
                    <h4 className="text-h6 font-medium capitalize">
                      {asset.name}
                    </h4>
                    <small className="text-sm text-muted-foreground">
                      Asset ID: {asset.asset_id}
                    </small>
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

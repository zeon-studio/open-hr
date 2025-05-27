import { dateFormat } from "@/lib/date-converter";
import { employeeInfoById } from "@/lib/employee-info";
import { TAsset } from "@/redux/features/assetApiSlice/assetType";
import { DialogContent, DialogTitle } from "@/ui/dialog";

const AssetPreview = ({ assetData }: { assetData: Partial<TAsset> }) => {
  return (
    <DialogContent
      className="!max-w-4xl overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Asset Details</DialogTitle>
      <div className="row justify-between items-center">
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Name</div>
          <div className="p-2 bg-light rounded">{assetData.name}</div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1 capitalize">Type</div>
          <div className="p-2 bg-light rounded">{assetData.type}</div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Price</div>
          <div className="p-2 bg-light rounded">
            {assetData.price}{" "}
            <span className="uppercase">{assetData.currency}</span>
          </div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">User</div>
          <div className="p-2 bg-light rounded">
            {assetData.user ? employeeInfoById(assetData.user).name : "N/A"}
          </div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Serial Number</div>
          <div className="p-2 bg-light rounded">
            {assetData.serial_number || "N/A"}
          </div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Purchase Date</div>
          <div className="p-2 bg-light rounded">
            {assetData.purchase_date
              ? dateFormat(assetData.purchase_date)
              : "N/A"}
          </div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Status</div>
          <div className="p-2 bg-light rounded capitalize">
            {assetData.status}
          </div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Note</div>
          <div className="p-2 bg-light rounded">{assetData.note || "N/A"}</div>
        </div>

        <div className="col-12">
          <div className="font-medium mb-3">Asset Logs</div>
          {assetData.logs?.map((log, index) => (
            <div className="border border-border mb-4 p-3 rounded" key={index}>
              <div className="row">
                <div className="lg:col-6 mb-2">
                  <div className="font-medium mb-1">Type</div>
                  <div className="p-2 bg-light rounded">{log.type}</div>
                </div>
                <div className="lg:col-6 mb-2">
                  <div className="font-medium mb-1">Date</div>
                  <div className="p-2 bg-light rounded">
                    {dateFormat(log.date)}
                  </div>
                </div>
                <div className="lg:col-12 mb-2">
                  <div className="font-medium mb-1">Description</div>
                  <div className="p-2 bg-light rounded">{log.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  );
};

export default AssetPreview;

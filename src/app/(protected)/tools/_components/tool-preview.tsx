import { dateFormat } from "@/lib/date-converter";
import { employeeInfoById } from "@/lib/employee-info";
import { TTool } from "@/redux/features/toolApiSlice/toolType";
import { DialogContent, DialogTitle } from "@/ui/dialog";

const ToolPreview = ({ toolData }: { toolData: Partial<TTool> }) => {
  return (
    <DialogContent
      className="max-w-4xl! overflow-y-auto max-h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Tool Platform</DialogTitle>
      <div className="row justify-between items-center">
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Platform</div>
          <div className="p-2 bg-light rounded">{toolData.platform}</div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Website</div>
          <div className="p-2 bg-light rounded">{toolData.website}</div>
        </div>
        <div className="col-12 mb-6">
          {toolData.organizations?.map((item, index) => (
            <div className="border-t border-border mt-6 pt-6" key={index}>
              <div className="row">
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Tool Name</div>
                  <div className="p-2 bg-light rounded">{item.name}</div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Tool Price</div>
                  <div className="p-2 bg-light rounded">{item.price}</div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Tool Currency</div>
                  <div className="p-2 uppercase bg-light rounded">
                    {item.currency}
                  </div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Billing</div>
                  <div className="p-2 bg-light capitalize rounded">
                    {item.billing}
                  </div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Login ID</div>
                  <div className="p-2 bg-light rounded">{item.login_id}</div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Password</div>
                  <div className="p-2 bg-light rounded">{item.password}</div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Purchase Date</div>
                  <div className="p-2 bg-light rounded">
                    {item.purchase_date
                      ? dateFormat(item.purchase_date)
                      : "N/A"}
                  </div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Expire Date</div>
                  <div className="p-2 bg-light rounded">
                    {item.expire_date ? dateFormat(item.expire_date) : "N/A"}
                  </div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Users</div>
                  <div className="p-2 bg-light rounded">
                    {item.users
                      .map((userId) => employeeInfoById(userId).name)
                      .join(", ")}
                  </div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Status</div>
                  <div className="p-2 bg-light capitalize rounded">
                    {item.status || "N/A"}
                  </div>
                </div>
                <div className="col-12">
                  <div className="font-medium mb-3">Logs</div>
                  {item.logs?.map((log, index) => (
                    <div
                      className="border border-border mb-4 p-3 rounded"
                      key={index}
                    >
                      <div className="row">
                        <div className="lg:col-6 mb-2">
                          <div className="font-medium mb-1">Type</div>
                          <div className="p-2 bg-light rounded">{log.type}</div>
                        </div>
                        <div className="lg:col-6 mb-2">
                          <div className="font-medium mb-1">Date</div>
                          <div className="p-2 bg-light rounded">
                            {log.date ? dateFormat(log.date) : "N/A"}
                          </div>
                        </div>
                        <div className="lg:col-12 mb-2">
                          <div className="font-medium mb-1">Description</div>
                          <div className="p-2 bg-light rounded">
                            {log.description || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!item.logs || item.logs.length === 0) && (
                    <div className="p-2 bg-light rounded">N/A</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  );
};

export default ToolPreview;

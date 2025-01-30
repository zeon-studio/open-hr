import { TSetting } from "@/redux/features/settingApiSlice/settingType";

const SettingPreview = ({ settingData }: { settingData: TSetting }) => {
  return (
    <div className="row justify-between items-center">
      <div className="lg:col-6 mb-4">
        <div className="font-medium mb-1">Platform</div>
        <div className="p-2 bg-white rounded">{settingData.app_name}</div>
      </div>
      <div className="lg:col-6 mb-4">
        <div className="font-medium mb-1">Website</div>
        <div className="p-2 bg-white rounded">{settingData.company_name}</div>
      </div>
      {/* <div className="col-12 mb-6">
          {settingData.organizations?.map((item, index) => (
            <div className="border-t mt-6 pt-6" key={index}>
              <div className="row">
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Setting Name</div>
                  <div className="p-2 bg-light rounded">{item.name}</div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Setting Price</div>
                  <div className="p-2 bg-light rounded">
                    {item.price}{" "}
                    <span className="uppercase">{item.currency}</span>
                  </div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Billing</div>
                  <div className="p-2 bg-light rounded">{item.billing}</div>
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
                <div className="col-12 mb-4">
                  <div className="font-medium mb-1">Users</div>
                  <div className="p-2 bg-light rounded">
                    {item.users
                      .map((userId) => employeeInfoById(userId).name)
                      .join(", ")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> */}
    </div>
  );
};

export default SettingPreview;

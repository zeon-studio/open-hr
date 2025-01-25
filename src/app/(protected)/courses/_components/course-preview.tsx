import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { employeeInfoById } from "@/lib/employeeInfo";
import { TCourse } from "@/redux/features/courseApiSlice/courseType";

const CoursePreview = ({ courseData }: { courseData: Partial<TCourse> }) => {
  return (
    <DialogContent
      className="max-w-4xl overflow-y-auto h-[90vh]"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="mb-4">Course Platform</DialogTitle>
      <div className="row justify-between items-center">
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Platform</div>
          <div className="p-2 bg-light rounded">{courseData.platform}</div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Website</div>
          <div className="p-2 bg-light rounded">{courseData.website}</div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Email</div>
          <div className="p-2 bg-light rounded">{courseData.email}</div>
        </div>
        <div className="lg:col-6 mb-4">
          <div className="font-medium mb-1">Password</div>
          <div className="p-2 bg-light rounded">{courseData.password}</div>
        </div>
        <div className="col-12 mb-6">
          {courseData.courses?.map((item, index) => (
            <div className="border-t mt-6 pt-6" key={index}>
              <div className="row">
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Course Name</div>
                  <div className="p-2 bg-light rounded">{item.name}</div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Course Price</div>
                  <div className="p-2 bg-light rounded">
                    {item.price}{" "}
                    <span className="uppercase">{item.currency}</span>
                  </div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Purchase Date</div>
                  <div className="p-2 bg-light rounded">
                    {item.purchase_date
                      ? new Date(item.purchase_date).toDateString()
                      : "N/A"}
                  </div>
                </div>
                <div className="lg:col-6 mb-4">
                  <div className="font-medium mb-1">Expire Date</div>
                  <div className="p-2 bg-light rounded">
                    {item.expire_date
                      ? new Date(item.expire_date).toDateString()
                      : "N/A"}
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
        </div>
      </div>
    </DialogContent>
  );
};

export default CoursePreview;

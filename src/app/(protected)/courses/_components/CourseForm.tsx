import ConfirmationPopup from "@/components/ConfirmationPopup";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import options from "@/config/options.json";
import {
  employeeGroupByDepartment,
  employeeInfoById,
} from "@/lib/employeeInfo";
import { useDeleteCourseMutation } from "@/redux/features/courseApiSlice/courseSlice";
import {
  TCourse,
  TCourseItem,
} from "@/redux/features/courseApiSlice/courseType";
import { CalendarIcon, Loader2, Trash2, X } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";
import ReactSelect from "react-select";

const CourseForm = ({
  courseData,
  setCourseData,
  handleSubmit,
  loader,
  formType,
}: {
  courseData: Partial<TCourse>;
  setCourseData: SetStateAction<any>;
  handleSubmit: (e: any) => Promise<void>;
  loader: boolean;
  formType: string;
}) => {
  const [deleteCourse] = useDeleteCourseMutation();

  const [courseItems, setCourseItems] = useState<TCourseItem[]>(
    courseData.courses || []
  );

  // set product files to productData state
  useEffect(() => {
    setCourseData((prev: Partial<TCourse>) => ({
      ...prev,
      courses: courseItems.map((courseItem) => ({
        name: courseItem.name,
        price: courseItem.price,
        currency: courseItem.currency,
        users: courseItem.users,
        purchase_date: courseItem.purchase_date,
        expire_date: courseItem.expire_date,
      })),
    }));
  }, [courseItems]);

  // add new product field for upload files to bucket
  const handleAddCourseItem = () => {
    setCourseItems([
      ...courseItems,
      {
        name: "",
        price: 0,
        currency: "bdt",
        users: [],
      },
    ]);
  };

  // delete product file
  const handleDeleteCourseItem = async (index: number) => {
    setCourseItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleCourseDelete = () => {
    deleteCourse(courseData._id);
    toast({
      title: "Course deleted complete",
    });
  };

  return (
    <form className="row justify-between items-center" onSubmit={handleSubmit}>
      <div className="lg:col-6 mb-4">
        <Label>Platform</Label>
        <Input
          type="text"
          value={courseData.platform!}
          onChange={(e: any) =>
            setCourseData({ ...courseData, platform: e.target.value })
          }
          required
        />
      </div>
      <div className="lg:col-6 mb-4">
        <Label>Website</Label>
        <Input
          type="text"
          value={courseData.website!}
          onChange={(e: any) =>
            setCourseData({ ...courseData, website: e.target.value })
          }
          required
        />
      </div>
      <div className="lg:col-6 mb-4">
        <Label>Email</Label>
        <Input
          type="email"
          value={courseData.email!}
          onChange={(e: any) =>
            setCourseData({ ...courseData, email: e.target.value })
          }
          required
        />
      </div>
      <div className="lg:col-6 mb-4">
        <Label>Password</Label>
        <Input
          type="text"
          value={courseData.password!}
          onChange={(e: any) =>
            setCourseData({ ...courseData, password: e.target.value })
          }
          required
        />
      </div>
      <div className="col-12 mb-6">
        {courseItems.map((item, index) => (
          <div className="border mb-6 bg-light rounded-md p-3" key={index}>
            <div className="row">
              {/* Course Name */}
              <div className="col-12 mb-4">
                <Label className="flex justify-between items-center">
                  Course Name{" "}
                  <Button
                    type="button"
                    onClick={() => handleDeleteCourseItem(index)}
                    size={"xs"}
                    variant="outline"
                  >
                    <Trash2 size={16} />
                  </Button>
                </Label>
                <Input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const updatedCourseItems = [...courseItems];
                    updatedCourseItems[index] = {
                      ...item,
                      name: e.target.value,
                    };
                    setCourseItems(updatedCourseItems);
                  }}
                  required
                />
              </div>
              {/* Course Price */}
              <div className="lg:col-6 mb-4">
                <Label>Course Price</Label>
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => {
                    const updatedCourseItems = [...courseItems];
                    updatedCourseItems[index] = {
                      ...item,
                      price: Number(e.target.value),
                    };
                    setCourseItems(updatedCourseItems);
                  }}
                  required
                />
              </div>
              {/* Course Currency */}
              <div className="lg:col-6 mb-4">
                <Label>Course Currency</Label>
                <Select
                  value={item.currency}
                  onValueChange={(value) => {
                    const updatedCourseItems = [...courseItems];
                    updatedCourseItems[index] = {
                      ...item,
                      currency: value,
                    };
                    setCourseItems(updatedCourseItems);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.currency.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* purchase date */}
              <div className="lg:col-6 mb-4">
                <Label>Purchase Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full flex justify-between border-border/30 rounded"
                    >
                      {item.purchase_date ? (
                        new Date(item.purchase_date).toDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <span className="flex items-center">
                        {item.purchase_date && (
                          <span className="p-2">
                            <X
                              className="cursor-pointer border-box ml-auto h-4 w-4 opacity-50"
                              onClick={() =>
                                setCourseItems((prevItems) => {
                                  const updatedItems = [...prevItems];
                                  updatedItems[index] = {
                                    ...item,
                                    purchase_date: undefined,
                                  };
                                  return updatedItems;
                                })
                              }
                            />
                          </span>
                        )}
                        <span className="bg-[#cccccc] mb-2 mt-2 h-5 block w-[1px]"></span>
                        <span className="pl-2  block">
                          <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                        </span>
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        item.purchase_date
                          ? new Date(item.purchase_date)
                          : new Date()
                      }
                      onSelect={(e: any) =>
                        setCourseItems((prevItems) => {
                          const updatedItems = [...prevItems];
                          updatedItems[index] = {
                            ...item,
                            purchase_date: e,
                          };
                          return updatedItems;
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* expire date */}
              <div className="lg:col-6 mb-4">
                <Label>Expire Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full flex justify-between border-border/30 rounded"
                    >
                      {item.expire_date ? (
                        new Date(item.expire_date).toDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <span className="flex items-center">
                        {item.expire_date && (
                          <span className="p-2">
                            <X
                              className="cursor-pointer border-box ml-auto h-4 w-4 opacity-50"
                              onClick={() =>
                                setCourseItems((prevItems) => {
                                  const updatedItems = [...prevItems];
                                  updatedItems[index] = {
                                    ...item,
                                    expire_date: undefined,
                                  };
                                  return updatedItems;
                                })
                              }
                            />
                          </span>
                        )}
                        <span className="bg-[#cccccc] mb-2 mt-2 h-5 block w-[1px]"></span>
                        <span className="pl-2  block">
                          <CalendarIcon className="ml-auto border-box h-4 w-4 opacity-50" />
                        </span>
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        item.expire_date
                          ? new Date(item.expire_date)
                          : new Date()
                      }
                      onSelect={(e: any) =>
                        setCourseItems((prevItems) => {
                          const updatedItems = [...prevItems];
                          updatedItems[index] = {
                            ...item,
                            expire_date: e,
                          };
                          return updatedItems;
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* users */}
              <div className="col-12 mb-4">
                <Label htmlFor="organization" className="col-span-4">
                  Users
                </Label>
                <ReactSelect
                  required
                  value={item.users.map((user) => ({
                    label: employeeInfoById(user).name,
                    value: user,
                  }))}
                  defaultValue={item.users.map((user) => ({
                    label: employeeInfoById(user).name,
                    value: user,
                  }))}
                  isSearchable={true}
                  options={employeeGroupByDepartment()}
                  isMulti
                  closeMenuOnSelect={false}
                  classNamePrefix={"rs"}
                  menuPlacement="auto"
                  onChange={(value) => {
                    const updatedCourseItems = [...courseItems];
                    updatedCourseItems[index] = {
                      ...item,
                      users: (value as { label: string; value: string }[]).map(
                        (user) => user.value
                      ),
                    };
                    setCourseItems(updatedCourseItems);
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: "black",
                    },
                  })}
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      borderColor: "#e2e4e8",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#e2e4e8",
                      },
                    }),
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          onClick={handleAddCourseItem}
          size={"sm"}
          className="w-full"
          variant="outline"
        >
          Add Course
        </Button>
      </div>

      {/* for insert */}
      {formType === "insert" && (
        <div className="col-12 text-right">
          <Button disabled={loader}>
            {loader ? (
              <>
                Please wait
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              </>
            ) : (
              "Add Platform"
            )}
          </Button>
        </div>
      )}

      {/* for update */}
      {formType === "update" && (
        <div className="col-12 text-right">
          <Dialog>
            <DialogTrigger className="mr-2" asChild>
              <Button className="border-red-700 text-red-700" variant="outline">
                Delete Course Platform
              </Button>
            </DialogTrigger>
            <ConfirmationPopup
              handleConfirmation={handleCourseDelete}
              id={courseData.platform!}
            />
          </Dialog>
          <Button type="submit" disabled={loader}>
            {loader ? (
              <>
                Please wait
                <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              </>
            ) : (
              "Update Course Platform"
            )}
          </Button>
        </div>
      )}
    </form>
  );
};

export default CourseForm;

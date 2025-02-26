import options from "@/config/options.json";
import MultipleSelector from "@/layouts/components/ui/multiple-selector";
import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import {
  employeeGroupByDepartment,
  employeeInfoById,
} from "@/lib/employee-info";
import {
  TCourse,
  TCourseItem,
} from "@/redux/features/courseApiSlice/courseType";
import { Button } from "@/ui/button";
import { Calendar } from "@/ui/calendar";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { CalendarIcon, Loader2, Trash2, X } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";

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
  const [courseItems, setCourseItems] = useState<TCourseItem[]>(
    courseData.courses || []
  );

  // set course items
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseItems]);

  // add new course item
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

  // delete course item
  const handleDeleteCourseItem = async (index: number) => {
    setCourseItems((prevItems) => prevItems.filter((_, i) => i !== index));
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
          <div
            className="border border-border mb-6 relative bg-light rounded-md p-3"
            key={index}
          >
            <div className="absolute right-3 top-3">
              <Button
                type="button"
                onClick={() => handleDeleteCourseItem(index)}
                size={"xs"}
                variant="outline"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <div className="row">
              {/* Course Name */}
              <div className="col-12 mb-4">
                <Label>Course Name</Label>
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
                      variant={"input"}
                      className="w-full flex justify-between"
                    >
                      {item.purchase_date ? (
                        dateFormat(item.purchase_date)
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
                        <span className="bg-border mb-2 mt-2 h-5 block w-[1px]"></span>
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
                      onSelect={(date) =>
                        setCourseItems((prevItems) => {
                          const updatedItems = [...prevItems];
                          updatedItems[index] = {
                            ...item,
                            purchase_date: formatDateWithTime(date!),
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
                      variant={"input"}
                      className="w-full flex justify-between"
                    >
                      {item.expire_date ? (
                        dateFormat(item.expire_date)
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
                        <span className="bg-border mb-2 mt-2 h-5 block w-[1px]"></span>
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
                      onSelect={(date) =>
                        setCourseItems((prevItems) => {
                          const updatedItems = [...prevItems];
                          updatedItems[index] = {
                            ...item,
                            expire_date: formatDateWithTime(date!),
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
                <MultipleSelector
                  value={item.users.map((user) => ({
                    label: employeeInfoById(user).name || "Unknown",
                    value: user,
                  }))}
                  options={employeeGroupByDepartment().flatMap(
                    (group) => group.options
                  )}
                  placeholder="Select users"
                  hidePlaceholderWhenSelected={true}
                  onChange={(value) => {
                    const updatedCourseItems = [...courseItems];
                    updatedCourseItems[index] = {
                      ...item,
                      users: value.map((user) => user.value),
                    };
                    setCourseItems(updatedCourseItems);
                  }}
                  className="border-border"
                  groupBy="department"
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

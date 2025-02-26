import options from "@/config/options.json";
import MultipleSelector from "@/layouts/components/ui/multiple-selector";
import { dateFormat, formatDateWithTime } from "@/lib/date-converter";
import {
  employeeGroupByDepartment,
  employeeInfoById,
} from "@/lib/employee-info";
import { TOrganization, TTool } from "@/redux/features/toolApiSlice/toolType";
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

const ToolForm = ({
  toolData,
  setToolData,
  handleSubmit,
  loader,
  formType,
}: {
  toolData: Partial<TTool>;
  setToolData: SetStateAction<any>;
  handleSubmit: (e: any) => Promise<void>;
  loader: boolean;
  formType: string;
}) => {
  const [toolItems, setToolItems] = useState<TOrganization[]>(
    toolData.organizations || []
  );

  // set tool items
  useEffect(() => {
    setToolData((prev: Partial<TTool>) => ({
      ...prev,
      organizations: toolItems.map((toolItem) => ({
        name: toolItem.name,
        price: toolItem.price,
        billing: toolItem.billing,
        login_id: toolItem.login_id,
        password: toolItem.password,
        currency: toolItem.currency,
        users: toolItem.users,
        purchase_date: toolItem.purchase_date,
        expire_date: toolItem.expire_date,
      })),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolItems]);

  // add new tool item
  const handleAddToolItem = () => {
    setToolItems([
      ...toolItems,
      {
        name: "",
        price: 0,
        billing: "onetime",
        login_id: "",
        password: "",
        currency: "bdt",
        users: [],
      },
    ]);
  };

  // delete tool item
  const handleDeleteToolItem = async (index: number) => {
    setToolItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <form className="row justify-between items-center" onSubmit={handleSubmit}>
      <div className="lg:col-6 mb-4">
        <Label>Platform</Label>
        <Input
          type="text"
          value={toolData.platform!}
          onChange={(e: any) =>
            setToolData({ ...toolData, platform: e.target.value })
          }
          required
        />
      </div>
      <div className="lg:col-6 mb-4">
        <Label>Website</Label>
        <Input
          type="text"
          value={toolData.website!}
          onChange={(e: any) =>
            setToolData({ ...toolData, website: e.target.value })
          }
          required
        />
      </div>
      <div className="col-12 mb-6">
        {toolItems.map((item, index) => (
          <div
            className="border border-border relative mb-6 bg-light rounded-md p-3"
            key={index}
          >
            <div className="absolute right-3 top-3">
              <Button
                type="button"
                onClick={() => handleDeleteToolItem(index)}
                size={"xs"}
                variant="outline"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <div className="row">
              {/* Tool Name */}
              <div className="lg:col-6 mb-4">
                <Label>Tool Name</Label>
                <Input
                  type="text"
                  value={item.name}
                  onChange={(e) => {
                    const updatedToolItems = [...toolItems];
                    updatedToolItems[index] = {
                      ...item,
                      name: e.target.value,
                    };
                    setToolItems(updatedToolItems);
                  }}
                  required
                />
              </div>
              {/* Tool Price */}
              <div className="lg:col-6 mb-4">
                <Label>Tool Price</Label>
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => {
                    const updatedToolItems = [...toolItems];
                    updatedToolItems[index] = {
                      ...item,
                      price: Number(e.target.value),
                    };
                    setToolItems(updatedToolItems);
                  }}
                  required
                />
              </div>
              {/* Tool Currency */}
              <div className="lg:col-6 mb-4">
                <Label>Tool Currency</Label>
                <Select
                  value={item.currency}
                  onValueChange={(value) => {
                    const updatedToolItems = [...toolItems];
                    updatedToolItems[index] = {
                      ...item,
                      currency: value,
                    };
                    setToolItems(updatedToolItems);
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

              {/* Tool Billing */}
              <div className="lg:col-6 mb-4">
                <Label>Tool Billing</Label>
                <Select
                  value={item.billing}
                  onValueChange={(value) => {
                    const updatedToolItems = [...toolItems];
                    updatedToolItems[index] = {
                      ...item,
                      billing: value as TOrganization["billing"],
                    };
                    setToolItems(updatedToolItems);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.billing.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* login id */}
              <div className="lg:col-6 mb-4">
                <Label>Login ID</Label>
                <Input
                  type="text"
                  value={item.login_id}
                  onChange={(e) => {
                    const updatedToolItems = [...toolItems];
                    updatedToolItems[index] = {
                      ...item,
                      login_id: e.target.value,
                    };
                    setToolItems(updatedToolItems);
                  }}
                  required
                />
              </div>

              {/* password */}
              <div className="lg:col-6 mb-4">
                <Label>Password</Label>
                <Input
                  type="text"
                  value={item.password}
                  onChange={(e) => {
                    const updatedToolItems = [...toolItems];
                    updatedToolItems[index] = {
                      ...item,
                      password: e.target.value,
                    };
                    setToolItems(updatedToolItems);
                  }}
                  required
                />
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
                                setToolItems((prevItems) => {
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
                        setToolItems((prevItems) => {
                          const updatedItems = [...prevItems];
                          if (date) {
                            updatedItems[index] = {
                              ...prevItems[index],
                              purchase_date: formatDateWithTime(date),
                            };
                          }
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
                                setToolItems((prevItems) => {
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
                        setToolItems((prevItems) => {
                          const updatedItems = [...prevItems];
                          if (date) {
                            updatedItems[index] = {
                              ...prevItems[index],
                              expire_date: formatDateWithTime(date),
                            };
                          }
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
                    const updatedToolItems = [...toolItems];
                    updatedToolItems[index] = {
                      ...item,
                      users: value.map((user) => user.value),
                    };
                    setToolItems(updatedToolItems);
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
          onClick={handleAddToolItem}
          size={"sm"}
          className="w-full"
          variant="outline"
        >
          Add Tool
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
              "Update Tool Platform"
            )}
          </Button>
        </div>
      )}
    </form>
  );
};

export default ToolForm;

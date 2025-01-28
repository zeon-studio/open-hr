import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import options from "@/config/options.json";
import { employeeGroupByDepartment } from "@/lib/employeeInfo";
import { TAsset, TAssetLog } from "@/redux/features/assetApiSlice/assetType";
import { CalendarIcon, Loader2, Trash2 } from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";

const AssetForm = ({
  assetData,
  setAssetData,
  handleSubmit,
  loader,
  formType,
}: {
  assetData: Partial<TAsset>;
  setAssetData: SetStateAction<any>;
  handleSubmit: (e: any) => Promise<void>;
  loader: boolean;
  formType: string;
}) => {
  const [assetLogs, setAssetLogs] = useState<TAssetLog[]>(assetData.logs || []);

  // set asset logs
  useEffect(() => {
    setAssetData((prev: Partial<TAsset>) => ({
      ...prev,
      logs: assetLogs.map((assetItem) => ({
        type: assetItem.type,
        description: assetItem.description,
        date: assetItem.date,
      })),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetLogs]);

  // add new product field for upload files to bucket
  const handleAddAssetItem = () => {
    setAssetLogs([
      ...assetLogs,
      {
        type: "handover",
        description: "",
        date: new Date(),
      },
    ]);
  };

  // delete product file
  const handleDeleteAssetLog = async (index: number) => {
    setAssetLogs((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <form className="row justify-between items-center" onSubmit={handleSubmit}>
      {/* name */}
      <div className="lg:col-6 mb-4">
        <Label>Name</Label>
        <Input
          type="text"
          value={assetData.name}
          onChange={(e: any) =>
            setAssetData({ ...assetData, name: e.target.value })
          }
          required
        />
      </div>
      {/* type */}
      <div className="lg:col-6 mb-4">
        <Label>Type</Label>
        <Select
          value={assetData.type}
          onValueChange={(value) => setAssetData({ ...assetData, type: value })}
          required
          disabled={formType === "update"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            {options.asset_type.map((item) => (
              <SelectItem value={item.value} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* price */}
      <div className="lg:col-6 mb-4">
        <Label>Price</Label>
        <Input
          type="number"
          value={assetData.price}
          onChange={(e: any) =>
            setAssetData({ ...assetData, price: e.target.value })
          }
          required
        />
      </div>
      {/* currency */}
      <div className="lg:col-6 mb-4">
        <Label>Currency</Label>
        <Select
          value={assetData.currency}
          onValueChange={(value) => {
            setAssetData({ ...assetData, currency: value });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {options.currency.map((item) => (
              <SelectItem value={item.value} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* user */}
      <div className="lg:col-6 mb-4">
        <Label>User</Label>
        <Select
          value={assetData.user || "none"}
          onValueChange={(value) =>
            setAssetData({
              ...assetData,
              user: value === "none" ? null : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select User" />
          </SelectTrigger>
          <SelectContent>
            {employeeGroupByDepartment().map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.options.map(
                  (option: { value: string; label: string }) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* serial number */}
      <div className="lg:col-6 mb-4">
        <Label>Serial Number</Label>
        <Input
          type="text"
          value={assetData.serial_number}
          onChange={(e: any) =>
            setAssetData({ ...assetData, serial_number: e.target.value })
          }
          required
        />
      </div>
      {/* purchase date */}
      <div className="lg:col-6 mb-4">
        <Label>Purchase Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"input"} className="w-full flex justify-between">
              {assetData.purchase_date ? (
                new Date(assetData.purchase_date).toDateString()
              ) : (
                <span>Pick a date</span>
              )}
              <span className="flex items-center">
                <span className="bg-border/30 mb-2 mt-2 h-5 block w-[1px]"></span>
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
                assetData.purchase_date
                  ? new Date(assetData.purchase_date)
                  : new Date()
              }
              onSelect={(e: any) =>
                setAssetData({
                  ...assetData,
                  purchase_date: e,
                })
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* status */}
      <div className="lg:col-6 mb-4">
        <Label>Status</Label>
        <Select
          value={assetData.status}
          onValueChange={(value) =>
            setAssetData({ ...assetData, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {options.asset_status.map((item) => (
              <SelectItem value={item.value} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* note */}
      <div className="lg:col-12 mb-4">
        <Label>Note</Label>
        <Input
          type="text"
          value={assetData.note}
          onChange={(e: any) =>
            setAssetData({ ...assetData, note: e.target.value })
          }
        />
      </div>
      {/* logs */}
      <div className="col-12 mb-6">
        {assetLogs.map((item, index) => (
          <div
            className="border relative mb-6 bg-light rounded-md p-3"
            key={index}
          >
            <div className="absolute right-3 top-3">
              <Button
                type="button"
                onClick={() => handleDeleteAssetLog(index)}
                size={"xs"}
                variant="outline"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <div className="row">
              {/* Log Type */}
              <div className="col-12 mb-4">
                <Label>Log Type</Label>
                <Select
                  value={item.type}
                  onValueChange={(value) => {
                    const updatedAssetItems = [...assetLogs];
                    updatedAssetItems[index] = {
                      ...item,
                      type: value as
                        | "handover"
                        | "return"
                        | "repair"
                        | "lost"
                        | "damaged",
                    };
                    setAssetLogs(updatedAssetItems);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Log Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.asset_log_type.map((item) => (
                      <SelectItem value={item.value} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Log Description */}
              <div className="lg:col-6 mb-4">
                <Label>Description</Label>
                <Input
                  type="text"
                  value={item.description}
                  onChange={(e) => {
                    const updatedAssetItems = [...assetLogs];
                    updatedAssetItems[index] = {
                      ...item,
                      description: e.target.value,
                    };
                    setAssetLogs(updatedAssetItems);
                  }}
                  required
                />
              </div>
              {/* Log Date */}
              <div className="lg:col-6 mb-4">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"input"}
                      className="w-full flex justify-between"
                    >
                      {item.date ? (
                        new Date(item.date).toDateString()
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={item.date ? new Date(item.date) : new Date()}
                      onSelect={(e: any) =>
                        setAssetLogs((prevItems) => {
                          const updatedItems = [...prevItems];
                          updatedItems[index] = {
                            ...item,
                            date: e,
                          };
                          return updatedItems;
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          onClick={handleAddAssetItem}
          size={"sm"}
          className="w-full"
          variant="outline"
        >
          Add Log
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
              "Update Asset Platform"
            )}
          </Button>
        </div>
      )}
    </form>
  );
};

export default AssetForm;

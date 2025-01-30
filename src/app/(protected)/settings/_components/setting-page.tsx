import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EditFrom from "@/partials/EditFrom";
import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/redux/features/settingApiSlice/settingSlice";
import { TSetting } from "@/redux/features/settingApiSlice/settingType";
import { Loader2, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

export default function SettingPage() {
  const { data, isLoading } = useGetSettingQuery(undefined);
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-20 text-center">
          <Loader2 className="animate-spin size-5 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (!isLoading && !data?.result) {
    notFound();
  }

  const handleSubmit = (data: TSetting) => {
    updateSetting(data);
  };

  return (
    <div className="space-y-10">
      {/* configure */}
      <EditFrom<TSetting>
        isUpdating={isUpdating}
        data={data?.result!}
        title="Settings"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(data);
              }}
              className="row gap-y-4"
            >
              <div className="lg:col-6">
                <Label>App Name:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.app_name || ""}
                  name="app_name"
                  placeholder="App Name"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="lg:col-6">
                <Label>App URL:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.app_url || ""}
                  name="app_url"
                  placeholder="App URL"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="lg:col-6">
                <Label>Favicon URL:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.favicon_url || ""}
                  name="favicon_url"
                  placeholder="Favicon URL"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="lg:col-6">
                <Label>Logo URL:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.logo_url || ""}
                  name="logo_url"
                  placeholder="Logo URL"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="lg:col-6">
                <Label>Logo Width:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="number"
                  value={data.logo_width || ""}
                  name="logo_width"
                  placeholder="Logo Width"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="lg:col-6">
                <Label>Logo Height:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="number"
                  value={data.logo_height || ""}
                  name="logo_height"
                  placeholder="Logo Height"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="lg:col-6">
                <Label>Company Name:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.company_name || ""}
                  name="company_name"
                  placeholder="Company Name"
                  readOnly={isReadOnly}
                />
              </div>
              <div className="lg:col-6">
                <Label>Company Website:</Label>
                <Input
                  onChange={(e) => {
                    const { name, value } = e.target;
                    handleChange({
                      ...data,
                      [name]: value,
                    });
                  }}
                  type="text"
                  value={data.company_website || ""}
                  name="company_website"
                  placeholder="Company Website"
                  readOnly={isReadOnly}
                />
              </div>
            </form>
          );
        }}
      </EditFrom>

      {/* menu */}
      <EditFrom<TSetting>
        isUpdating={isUpdating}
        data={data?.result!}
        title="Menu"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(data);
              }}
              className="row gap-y-4"
            >
              <div className="lg:col-12">
                <Label>Menus:</Label>
                {data.menus.map((menu, index) => (
                  <div key={index} className="row lg:row-cols-3 relative">
                    {!isReadOnly && (
                      <div className="lg:col-span-2 absolute right-5 top-3">
                        <Button
                          type="button"
                          size={"xs"}
                          variant="outline"
                          onClick={() => {
                            handleChange({
                              ...data,
                              menus: data.menus.filter((_, i) => i !== index),
                            });
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    )}
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          menus: data.menus.map((menu, i) =>
                            i === index ? { ...menu, [name]: value } : menu
                          ),
                        });
                      }}
                      type="text"
                      value={menu.name || ""}
                      name="name"
                      placeholder="Menu Name"
                      readOnly={isReadOnly}
                    />
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          menus: data.menus.map((menu, i) =>
                            i === index ? { ...menu, [name]: value } : menu
                          ),
                        });
                      }}
                      type="text"
                      value={menu.url || ""}
                      name="url"
                      placeholder="Menu URL"
                      readOnly={isReadOnly}
                    />
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          menus: data.menus.map((menu, i) =>
                            i === index
                              ? { ...menu, [name]: value.split(",") }
                              : menu
                          ),
                        });
                      }}
                      type="text"
                      value={menu.access.join(", ") || ""}
                      name="access"
                      placeholder="Access (comma separated)"
                      readOnly={isReadOnly}
                    />
                  </div>
                ))}
                {!isReadOnly && (
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => {
                      handleChange({
                        ...data,
                        menus: [
                          ...data.menus,
                          { name: "", url: "", access: [] },
                        ],
                      });
                    }}
                  >
                    Add Menu
                  </Button>
                )}
              </div>
            </form>
          );
        }}
      </EditFrom>

      {/* leaves and weekends */}
      <EditFrom<TSetting>
        isUpdating={isUpdating}
        data={data?.result!}
        title="Leaves and Weekends"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(data);
              }}
              className="row gap-y-4"
            >
              <div className="lg:col-12">
                <Label>Weekends:</Label>
                {data.weekends.map((weekend, index) => (
                  <div key={index} className="relative mb-4">
                    {!isReadOnly && (
                      <div className="absolute right-5 top-3">
                        <Button
                          type="button"
                          size={"xs"}
                          variant="outline"
                          onClick={() => {
                            handleChange({
                              ...data,
                              weekends: data.weekends.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    )}
                    <Input
                      onChange={(e) => {
                        const { value } = e.target;
                        handleChange({
                          ...data,
                          weekends: data.weekends.map((weekend, i) =>
                            i === index ? value : weekend
                          ),
                        });
                      }}
                      type="text"
                      value={weekend || ""}
                      name="weekend"
                      placeholder="Weekend"
                      readOnly={isReadOnly}
                    />
                  </div>
                ))}
                {!isReadOnly && (
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => {
                      handleChange({
                        ...data,
                        weekends: [...data.weekends, ""],
                      });
                    }}
                  >
                    Add Weekend
                  </Button>
                )}
              </div>
              <div className="lg:col-12">
                <Label>Conditional Weekends:</Label>
                {data.conditional_weekends.map((weekend, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4 mb-4 relative"
                  >
                    {!isReadOnly && (
                      <div className="lg:col-span-2 absolute right-5 top-3">
                        <Button
                          type="button"
                          size={"xs"}
                          variant="outline"
                          onClick={() => {
                            handleChange({
                              ...data,
                              conditional_weekends:
                                data.conditional_weekends.filter(
                                  (_, i) => i !== index
                                ),
                            });
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    )}
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          conditional_weekends: data.conditional_weekends.map(
                            (weekend, i) =>
                              i === index
                                ? { ...weekend, [name]: value }
                                : weekend
                          ),
                        });
                      }}
                      type="text"
                      value={weekend.name || ""}
                      name="name"
                      placeholder="Weekend Name"
                      readOnly={isReadOnly}
                    />
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          conditional_weekends: data.conditional_weekends.map(
                            (weekend, i) =>
                              i === index
                                ? {
                                    ...weekend,
                                    [name]: value.split("|").map(Number),
                                  }
                                : weekend
                          ),
                        });
                      }}
                      type="text"
                      value={weekend.pattern.join("|") || ""}
                      name="pattern"
                      placeholder="Pattern (pipe separated)"
                      readOnly={isReadOnly}
                    />
                  </div>
                ))}
                {!isReadOnly && (
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => {
                      handleChange({
                        ...data,
                        conditional_weekends: [
                          ...data.conditional_weekends,
                          { name: "", pattern: [] },
                        ],
                      });
                    }}
                  >
                    Add Conditional Weekend
                  </Button>
                )}
              </div>
              <div className="lg:col-12">
                <Label>Leaves:</Label>
                {data.leaves.map((leave, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4 mb-4 relative"
                  >
                    {!isReadOnly && (
                      <div className="lg:col-span-2 absolute right-5 top-3">
                        <Button
                          type="button"
                          size={"xs"}
                          variant="outline"
                          onClick={() => {
                            handleChange({
                              ...data,
                              leaves: data.leaves.filter((_, i) => i !== index),
                            });
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    )}
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          leaves: data.leaves.map((leave, i) =>
                            i === index ? { ...leave, [name]: value } : leave
                          ),
                        });
                      }}
                      type="text"
                      value={leave.name || ""}
                      name="name"
                      placeholder="Leave Name"
                      readOnly={isReadOnly}
                    />
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          leaves: data.leaves.map((leave, i) =>
                            i === index
                              ? { ...leave, [name]: Number(value) }
                              : leave
                          ),
                        });
                      }}
                      type="number"
                      value={leave.days || ""}
                      name="days"
                      placeholder="Days"
                      readOnly={isReadOnly}
                    />
                  </div>
                ))}
                {!isReadOnly && (
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => {
                      handleChange({
                        ...data,
                        leaves: [...data.leaves, { name: "", days: 0 }],
                      });
                    }}
                  >
                    Add Leave
                  </Button>
                )}
              </div>
            </form>
          );
        }}
      </EditFrom>

      {/* onboarding tasks */}
      <EditFrom<TSetting>
        isUpdating={isUpdating}
        data={data?.result!}
        title="Onboarding Tasks"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(data);
              }}
              className="row gap-y-4"
            >
              <div className="lg:col-12">
                <Label>Onboarding Tasks:</Label>
                {data.onboarding_tasks.map((task, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 mb-4 relative"
                  >
                    {!isReadOnly && (
                      <div className="lg:col-span-2 absolute right-5 top-3">
                        <Button
                          type="button"
                          size={"xs"}
                          variant="outline"
                          onClick={() => {
                            handleChange({
                              ...data,
                              onboarding_tasks: data.onboarding_tasks.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    )}
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          onboarding_tasks: data.onboarding_tasks.map(
                            (task, i) =>
                              i === index ? { ...task, [name]: value } : task
                          ),
                        });
                      }}
                      type="text"
                      value={task.name || ""}
                      name="name"
                      placeholder="Task Name"
                      readOnly={isReadOnly}
                    />
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          onboarding_tasks: data.onboarding_tasks.map(
                            (task, i) =>
                              i === index ? { ...task, [name]: value } : task
                          ),
                        });
                      }}
                      type="text"
                      value={task.assigned_to || ""}
                      name="assigned_to"
                      placeholder="Assigned To"
                      readOnly={isReadOnly}
                    />
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          onboarding_tasks: data.onboarding_tasks.map(
                            (task, i) =>
                              i === index
                                ? {
                                    ...task,
                                    [name]: value as "pending" | "completed",
                                  }
                                : task
                          ),
                        });
                      }}
                      type="text"
                      value={task.status || ""}
                      name="status"
                      placeholder="Status"
                      readOnly={isReadOnly}
                    />
                  </div>
                ))}
                {!isReadOnly && (
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => {
                      handleChange({
                        ...data,
                        onboarding_tasks: [
                          ...data.onboarding_tasks,
                          { name: "", assigned_to: "", status: "pending" },
                        ],
                      });
                    }}
                  >
                    Add Onboarding Task
                  </Button>
                )}
              </div>
            </form>
          );
        }}
      </EditFrom>

      {/* offboarding tasks */}
      <EditFrom<TSetting>
        isUpdating={isUpdating}
        data={data?.result!}
        title="Offboarding Tasks"
      >
        {({ handleChange, isReadOnly, data, formRef }) => {
          return (
            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(data);
              }}
              className="row gap-y-4"
            >
              <div className="lg:col-12">
                <Label>Offboarding Tasks:</Label>
                {data.offboarding_tasks.map((task, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 mb-4 relative"
                  >
                    {!isReadOnly && (
                      <div className="lg:col-span-2 absolute right-5 top-3">
                        <Button
                          type="button"
                          size={"xs"}
                          variant="outline"
                          onClick={() => {
                            handleChange({
                              ...data,
                              offboarding_tasks: data.offboarding_tasks.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    )}
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          offboarding_tasks: data.offboarding_tasks.map(
                            (task, i) =>
                              i === index ? { ...task, [name]: value } : task
                          ),
                        });
                      }}
                      type="text"
                      value={task.name || ""}
                      name="name"
                      placeholder="Task Name"
                      readOnly={isReadOnly}
                    />
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          offboarding_tasks: data.offboarding_tasks.map(
                            (task, i) =>
                              i === index ? { ...task, [name]: value } : task
                          ),
                        });
                      }}
                      type="text"
                      value={task.assigned_to || ""}
                      name="assigned_to"
                      placeholder="Assigned To"
                      readOnly={isReadOnly}
                    />
                    <Input
                      onChange={(e) => {
                        const { name, value } = e.target;
                        handleChange({
                          ...data,
                          offboarding_tasks: data.offboarding_tasks.map(
                            (task, i) =>
                              i === index
                                ? {
                                    ...task,
                                    [name]: value as "pending" | "completed",
                                  }
                                : task
                          ),
                        });
                      }}
                      type="text"
                      value={task.status || ""}
                      name="status"
                      placeholder="Status"
                      readOnly={isReadOnly}
                    />
                  </div>
                ))}
                {!isReadOnly && (
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    onClick={() => {
                      handleChange({
                        ...data,
                        offboarding_tasks: [
                          ...data.offboarding_tasks,
                          { name: "", assigned_to: "", status: "pending" },
                        ],
                      });
                    }}
                  >
                    Add Offboarding Task
                  </Button>
                )}
              </div>
            </form>
          );
        }}
      </EditFrom>
    </div>
  );
}

import options from "@/config/options.json";
import EditForm from "@/partials/edit-from";
import { TEmployeeEducation } from "@/redux/features/employeeEducationApiSlice/employeeEducationType";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Separator } from "@/ui/separator";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";

interface EducationFormProps {
  data: TEmployeeEducation;
  isUpdating: boolean;
  onSubmit: (data: TEmployeeEducation) => void;
}

export default function EducationForm({
  data,
  isUpdating,
  onSubmit,
}: EducationFormProps) {
  return (
    <EditForm<TEmployeeEducation>
      isUpdating={isUpdating}
      data={data}
      title="Educational Details"
    >
      {(props) => <EducationFormFields {...props} onSubmit={onSubmit} />}
    </EditForm>
  );
}

function EducationFormFields({
  handleChange,
  isReadOnly,
  data,
  formRef,
  onSubmit,
}: {
  handleChange: (value: TEmployeeEducation) => void;
  isReadOnly: boolean;
  data: TEmployeeEducation;
  formRef: React.RefObject<HTMLFormElement | null>;
  onSubmit: (data: TEmployeeEducation) => void;
}) {
  useEffect(() => {
    if (!isReadOnly && (!data?.educations || data.educations.length === 0)) {
      handleChange({
        ...data,
        educations: [
          {
            degree: "",
            major: "",
            result: 0,
            result_type: "gpa",
            institute: "",
            passing_year: 0,
          },
        ],
      });
    }
  }, [isReadOnly, data, handleChange]);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(data);
      }}
      className="space-y-4"
    >
      {data?.educations.length > 0 ? (
        data?.educations?.map((education, index, educations) => {
          return (
            <div
              className={`${isReadOnly ? "bg-white" : "bg-light px-5 pt-5"} rounded relative`}
              key={index}
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
                        educations: data.educations.filter(
                          (education, i) => i !== index
                        ),
                      });
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              )}
              <div className="row gx-3">
                <div className="lg:col-6 mb-4">
                  <Label>Degree:</Label>
                  <Input
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange({
                        ...data,
                        educations: educations.map((education, i) => {
                          if (index === i) {
                            return { ...education, [name]: value };
                          }
                          return education;
                        }),
                      });
                    }}
                    required
                    value={education.degree || ""}
                    readOnly={isReadOnly}
                    name="degree"
                    placeholder="Degree"
                  />
                </div>
                <div className="lg:col-6 mb-4">
                  <Label>Name of Institution:</Label>
                  <Input
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange({
                        ...data,
                        educations: educations.map((education, i) => {
                          if (index === i) {
                            return { ...education, [name]: value };
                          }
                          return education;
                        }),
                      });
                    }}
                    required
                    readOnly={isReadOnly}
                    value={education.institute || ""}
                    name="institute"
                    placeholder="Institute name"
                  />
                </div>
                <div className="lg:col-6 mb-4">
                  <Label>Passing Year:</Label>
                  <Input
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange({
                        ...data,
                        educations: educations.map((education, i) => {
                          if (index === i) {
                            return { ...education, [name]: value };
                          }
                          return education;
                        }),
                      });
                    }}
                    type="number"
                    required
                    readOnly={isReadOnly}
                    name="passing_year"
                    value={education.passing_year || ""}
                    placeholder="Passing year"
                  />
                </div>
                <div className="lg:col-6 mb-4">
                  <Label>Major:</Label>
                  <Input
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange({
                        ...data,
                        educations: educations.map((education, i) => {
                          if (index === i) {
                            return { ...education, [name]: value };
                          }
                          return education;
                        }),
                      });
                    }}
                    required
                    readOnly={isReadOnly}
                    value={education.major || ""}
                    name="major"
                    placeholder="Science"
                  />
                </div>
                <div className="lg:col-6 mb-4">
                  <Label>Result:</Label>
                  <Input
                    onChange={(e) => {
                      const { name, value } = e.target;
                      handleChange({
                        ...data,
                        educations: educations.map((education, i) => {
                          if (index === i) {
                            return { ...education, [name]: value };
                          }
                          return education;
                        }),
                      });
                    }}
                    type="number"
                    value={education.result || 0}
                    readOnly={isReadOnly}
                    name="result"
                    required
                  />
                </div>
                <div className="lg:col-6 mb-4">
                  <Label>Result Type:</Label>
                  {isReadOnly ? (
                    <p className="text-sm uppercase">
                      {data.educations[index].result_type || "Not Available"}
                    </p>
                  ) : (
                    <Select
                      onValueChange={(value) => {
                        handleChange({
                          ...data,
                          educations: educations.map((education, i) => {
                            if (index === i) {
                              return {
                                ...education,
                                result_type: value as
                                  | "gpa"
                                  | "cgpa"
                                  | "percentage",
                              };
                            }
                            return education;
                          }),
                        });
                      }}
                      defaultValue={education.result_type}
                      disabled={isReadOnly}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Result Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.education_result_type.map(
                          ({ label, value }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
              {isReadOnly && educations.length - 1 !== index && (
                <Separator className="my-6 lg:col-span-2" />
              )}
            </div>
          );
        })
      ) : (
        <p className="py-4">No Education information available. </p>
      )}

      {!isReadOnly && (
        <Button
          variant="outline"
          className="w-full mt-6"
          onClick={() => {
            handleChange({
              ...data,
              educations: [
                ...(data?.educations ?? []),
                {
                  degree: "",
                  major: "",
                  result: 0,
                  result_type: "gpa",
                  institute: "",
                  passing_year: 0,
                },
              ],
            });
          }}
          type="button"
          disabled={isReadOnly}
        >
          Add Education
        </Button>
      )}
    </form>
  );
}

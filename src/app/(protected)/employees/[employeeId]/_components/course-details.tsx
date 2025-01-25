import { Card, CardContent } from "@/components/ui/card";
import { useGetCoursesByUserQuery } from "@/redux/features/courseApiSlice/courseSlice";
import { format } from "date-fns";
import { ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Courses() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const { data, isLoading } = useGetCoursesByUserQuery(employeeId);

  return (
    <div>
      <h5 className="mb-4">Courses</h5>
      <Card className="overflow-hidden">
        <CardContent
          className={
            isLoading || !data?.result.length! ? "py-20" : "p-0 overflow-hidden"
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          ) : data?.result.length! > 0 ? (
            <div className="flex flex-col gap-4">
              <ul className="space-y-3">
                {data?.result?.map((course, index) => (
                  <li
                    className="row mx-0 space-y-3 lg:space-y-0 2xl:row-cols-5 items-center bg-light rounded py-3"
                    key={index}
                  >
                    <div className="flex items-center">
                      <Image
                        src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${course.website}&size=64`}
                        alt={course.name}
                        width={50}
                        height={50}
                        className="rounded-md shrink-0 hidden lg:block mr-4"
                      />
                      <div>
                        <small className="text-xs text-muted-foreground block">
                          Platform:
                        </small>
                        <strong className="text-h6 font-medium capitalize">
                          <Link
                            target="_blank"
                            rel="noopener nofollow noreferrer"
                            href={course.website}
                          >
                            {course.platform}
                            <ExternalLink className="inline-block ml-1 -mt-1 size-[1em]" />
                          </Link>
                        </strong>
                      </div>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Course Name:
                      </small>
                      <strong className="text-h6 font-medium capitalize">
                        {course.name}
                      </strong>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        User ID:
                      </small>
                      <strong className="text-h6 font-medium">
                        {course.email}
                      </strong>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Date:
                      </small>
                      <strong className="text-h6 font-medium capitalize">
                        {course.purchase_date &&
                          format(new Date(course.purchase_date), "MMM d, yyyy")}
                      </strong>
                    </div>

                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Price:
                      </small>
                      <strong className="text-h6 font-medium">
                        {course.price}
                      </strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <p className="text-center text-muted-foreground">
                No Courses Found
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

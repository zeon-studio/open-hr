import CopyText from "@/components/copy-text";
import { useGetCoursesByUserQuery } from "@/redux/features/courseApiSlice/courseSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { ExternalLink, SquareLibrary } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const UserCourses = ({ userId }: { userId: string }) => {
  const { data } = useGetCoursesByUserQuery(userId);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <SquareLibrary className="mr-2 inline-block" />
          Your Courses
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data?.result?.length === 0 ? (
          <p className="text-center text-muted-foreground">No Courses Found</p>
        ) : (
          <div className="flex flex-col gap-4">
            <ul className="space-y-3">
              {data?.result?.map((course, index) => (
                <li
                  className="row !mx-0 space-y-3 lg:space-y-0 lg:row-cols-4 items-center bg-light rounded py-3"
                  key={`course-${index}`}
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
                      <strong className="text-sm font-medium capitalize">
                        <Link
                          target="_blank"
                          rel="noopener nofollow noreferrer"
                          href={course.website}
                        >
                          <span className="inline-block mr-1">
                            {course.platform}
                          </span>
                          <ExternalLink className="inline-block -mt-1 size-[1em]" />
                        </Link>
                      </strong>
                    </div>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      Course Name:
                    </small>
                    <strong className="text-sm font-medium capitalize">
                      {course.name}
                    </strong>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      User ID:
                    </small>
                    <strong className="text-sm font-medium">
                      <CopyText text={course.email} />
                    </strong>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      Password:
                    </small>
                    <strong className="text-sm font-medium capitalize">
                      <CopyText text={course.password} isPassword={true} />
                    </strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCourses;

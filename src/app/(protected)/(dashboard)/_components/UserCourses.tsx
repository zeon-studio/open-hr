import PasswordCopy from "@/components/PasswordCopy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCoursesByUserQuery } from "@/redux/features/courseApiSlice/courseSlice";
import { SquareLibrary } from "lucide-react";
import Image from "next/image";

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
              {data?.result?.map((course) => (
                <li
                  className="row mx-0 row-cols-4 items-center bg-light rounded py-3"
                  key={course._id}
                >
                  <div className="flex items-center">
                    <Image
                      src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${course.website}&size=64`}
                      alt={course.name}
                      width={50}
                      height={50}
                      className="rounded-md shrink-0"
                    />
                    <div className="ml-4">
                      <small className="text-xs text-muted-foreground block">
                        Platform:
                      </small>
                      <strong className="text-h6 font-medium capitalize">
                        {course.platform}
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
                    <strong className="text-h6 font-medium capitalize">
                      {course.email}
                    </strong>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      Password:
                    </small>
                    <strong className="text-h6 font-medium capitalize">
                      <PasswordCopy text={course.password} />
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

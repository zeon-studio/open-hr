import { useGetToolsByUserQuery } from "@/redux/features/toolApiSlice/toolSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { ExternalLink, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Tools() {
  const { data: session } = useSession();
  const params = useParams<{ employeeId: string }>();
  let employeeId = params?.employeeId ?? "";
  if (!employeeId) {
    employeeId = session?.user.id as string;
  }
  const { data, isLoading } = useGetToolsByUserQuery(employeeId);

  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader className="border-b-transparent">
          <CardTitle>Tools</CardTitle>
        </CardHeader>
        <CardContent
          className={
            isLoading || !data?.result.length!
              ? "py-20"
              : "overflow-hidden pt-0"
          }
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin size-5" />
            </div>
          ) : data?.result.length! > 0 ? (
            <div className="flex flex-col gap-4">
              <ul className="space-y-3">
                {data?.result?.map((tool, index) => (
                  <li
                    className="row !mx-0 space-y-3 xl:space-y-0 xl:row-cols-3 items-center bg-light rounded py-3"
                    key={`tool-${index}`}
                  >
                    <div className="flex items-center xl:space-x-3">
                      <Image
                        src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${tool.website}&size=64`}
                        alt={tool.name}
                        width={50}
                        height={50}
                        className="rounded-md shrink-0 hidden lg:block mr-4"
                      />

                      <div>
                        <small className="text-xs text-muted-foreground block">
                          Platform:
                        </small>
                        <strong className="line-clamp-1 text-sm font-medium capitalize">
                          {tool.platform}
                        </strong>
                      </div>
                    </div>
                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Organization:
                      </small>
                      <strong className="text-sm font-medium capitalize">
                        {tool.name}
                      </strong>
                    </div>

                    <div>
                      <small className="text-xs text-muted-foreground block">
                        Website:
                      </small>
                      <strong className="line-clamp-1 text-sm font-medium">
                        <Link
                          target="_blank"
                          rel="noopener nofollow noreferrer"
                          href={tool.website}
                        >
                          <span className="inline-block mr-1">
                            {tool.website}
                          </span>
                          <ExternalLink className="inline-block -mt-1 size-[1em]" />
                        </Link>
                      </strong>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              <p className="text-center text-muted-foreground">
                No Tools Found
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

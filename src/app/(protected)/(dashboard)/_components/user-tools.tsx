import CopyText from "@/components/copy-text";
import { useGetToolsByUserQuery } from "@/redux/features/toolApiSlice/toolSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { BookKey, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const UserTools = ({ userId }: { userId: string }) => {
  const { data } = useGetToolsByUserQuery(userId);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          <BookKey className="mr-2 inline-block" />
          Your Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data?.result?.length === 0 ? (
          <p className="text-center text-muted-foreground">No Tools Found</p>
        ) : (
          <div className="flex flex-col gap-4">
            <ul className="space-y-3">
              {data?.result?.map((tool, index) => (
                <li
                  className="row !mx-0 space-y-3 lg:space-y-0 lg:row-cols-4 items-center bg-light rounded py-3"
                  key={`tool-${index}`}
                >
                  <div className="flex items-center">
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
                      <strong className="text-sm font-medium capitalize">
                        <Link
                          target="_blank"
                          rel="noopener nofollow noreferrer"
                          href={tool.website}
                        >
                          <span className="inline-block mr-1">
                            {tool.platform}
                          </span>
                          <ExternalLink className="inline-block -mt-1 size-[1em]" />
                        </Link>
                      </strong>
                    </div>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      Organization
                    </small>
                    <strong className="text-sm font-medium capitalize">
                      {tool.name}
                    </strong>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      User ID:
                    </small>
                    <strong className="text-sm font-medium">
                      <CopyText text={tool.login_id} />
                    </strong>
                  </div>
                  <div>
                    <small className="text-xs text-muted-foreground block">
                      Password:
                    </small>
                    <strong className="text-sm font-medium capitalize">
                      <CopyText text={tool.password} isPassword={true} />
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

export default UserTools;

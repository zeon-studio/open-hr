import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import Link from "next/link";
import { JSX } from "react";
import Gravatar from "react-gravatar";

const UserInfo = ({
  user,
  className,
  description,
  imgSize = 50,
}: {
  user: Partial<TEmployee>;
  className?: string;
  description?: string;
  imgSize?: number;
}): JSX.Element => {
  return (
    <>
      {user.id && (
        <div className={`flex relative items-center ${className}`}>
          <div className={`shrink-0`}>
            {user?.image ? (
              <img
                className="object-cover rounded-full"
                src={user?.image}
                height={imgSize}
                width={imgSize}
                alt="user image"
              />
            ) : (
              <Gravatar
                email={user?.work_email || "unknown@mail.com"}
                size={imgSize}
                default="mp"
                className="rounded-full"
              />
            )}
          </div>
          <div className="ml-3">
            <h6 className={`font-medium mb-1.5 text-sm line-clamp-1`}>
              <Link className="stretched-link" href={`/employees/${user.id}`}>
                {user?.name || "UNKNOWN"}
              </Link>
            </h6>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {description ? description : user?.designation}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;

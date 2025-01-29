import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import Link from "next/link";
import { JSX } from "react";
import Gravatar from "react-gravatar";

const UserInfo = ({
  user,
  className,
  description,
  imgSize = 50,
  link,
}: {
  user: Partial<TEmployee & { designation?: string }>;
  className?: string;
  description?: string;
  imgSize?: number;
  link?: string;
}): JSX.Element => {
  return (
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
            email={user?.work_email ?? user.personal_email}
            size={imgSize}
            default="mp"
            className="rounded-full"
          />
        )}
      </div>
      <div className="ml-3">
        <h6
          className={`font-medium mb-1.5 text-sm cursor-pointer line-clamp-1`}
        >
          {link ? (
            <Link className="stretched-link" href={link}>
              {user?.name}
            </Link>
          ) : (
            user?.name
          )}
        </h6>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {description ? description : user?.designation}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;

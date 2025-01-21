import { filterEmployee } from "@/redux/features/customSlice/customSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { useAppDispatch } from "@/redux/hook";
import { JSX } from "react";
import Gravatar from "react-gravatar";

const UserInfo = ({
  user,
  className,
  description,
  imgSize = 50,
}: {
  user: Partial<TEmployee & { department: string; designation: string }>;
  className?: string;
  description?: string;
  imgSize?: number;
}): JSX.Element => {
  const dispatch = useAppDispatch();

  return (
    <div
      className={`flex items-center ${className}`}
      onClick={() => dispatch(filterEmployee(user?.id!))}
    >
      <div className={`shrink-0`}>
        {user.image ? (
          <img
            className="object-cover rounded-full"
            src={user?.image}
            height={imgSize}
            width={imgSize}
            alt="user image"
          />
        ) : (
          <Gravatar
            email={user?.work_email}
            size={imgSize}
            default="mp"
            className="rounded-full"
          />
        )}
      </div>
      <div className="ml-3">
        <h6 className={`font-medium mb-1.5 text-sm cursor-pointer`}>
          {user?.name}
        </h6>
        <p className="text-xs text-muted-foreground">
          {description ? description : user?.designation}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;

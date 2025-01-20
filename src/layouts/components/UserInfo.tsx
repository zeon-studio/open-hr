import { filterEmployee } from "@/redux/features/customSlice/customSlice";
import { TEmployee } from "@/redux/features/employeeApiSlice/employeeType";
import { useAppDispatch } from "@/redux/hook";
import { JSX } from "react";
import Gravatar from "react-gravatar";

const UserInfo = ({
  user,
  className,
}: {
  user: Partial<TEmployee>;
  className?: string;
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
            height={70}
            width={70}
            alt="user image"
          />
        ) : (
          <Gravatar
            email={user?.work_email}
            size={70}
            default="mp"
            className="rounded-full"
          />
        )}
      </div>
      <div className="ml-3">
        <h6 className={`font-medium text-sm cursor-pointer`}>{user?.name}</h6>
      </div>
    </div>
  );
};

export default UserInfo;

import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import useCookie, { getCookie } from "react-use-cookie";

const ClearCache = () => {
  // name
  const UPDATE_DATE = "26Nov2025";

  // cookie bar
  const [_announcementClose, setAnnouncementClose] = useCookie(UPDATE_DATE, "");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to avoid the lint warning about synchronous setState
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // cookie handler
  const cookieHandler = () => {
    // clear local storage of `employees` and `assets`
    localStorage.removeItem("hr-assets");
    localStorage.removeItem("hr-calendar");
    localStorage.removeItem("hr-courses");
    localStorage.removeItem("hr-employees");
    localStorage.removeItem("hr-employees-basics");
    localStorage.removeItem("hr-leave-requests");
    localStorage.removeItem("hr-my-leave-requests");
    localStorage.removeItem("hr-leaves");
    localStorage.removeItem("hr-payrolls");
    localStorage.removeItem("hr-tools");
    localStorage.removeItem("hr-settings");

    // set cookie
    setAnnouncementClose(UPDATE_DATE, {
      days: 999,
      SameSite: "Strict",
      Secure: true,
    });
  };

  // Don't render anything until component is mounted on client
  if (!isMounted) {
    return null;
  }

  const shouldShowAnnouncement = getCookie(UPDATE_DATE) === "";

  return (
    <>
      {shouldShowAnnouncement && (
        <button
          className="p-4 bg-yellow-100 w-full mb-4 text-center rounded border border-yellow-200"
          onClick={cookieHandler}
        >
          <Info className="mr-2 inline-block" size={20} />
          App updated! Click here to see the changes.
        </button>
      )}
    </>
  );
};

export default ClearCache;

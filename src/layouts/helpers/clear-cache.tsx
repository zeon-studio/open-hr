import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import useCookie, { getCookie } from "react-use-cookie";

const ClearCache = () => {
  // name
  const UPDATE_DATE = "19Aug2024";

  // cookie bar
  const [announcementClose, setAnnouncementClose] = useCookie(UPDATE_DATE, "");
  const [announcementCloseState, setAnnouncementCloseState] = useState(true);

  // cookie check from browser
  useEffect(() => {
    setAnnouncementCloseState(getCookie(UPDATE_DATE) === "" ? false : true);
  }, [announcementClose]);

  // cookie handler
  const cookieHandler = () => {
    // clear local storage of `users` and `orders`
    localStorage.removeItem("uih-users");
    localStorage.removeItem("uih-orders");
    localStorage.removeItem("uih-user-logs");

    // set cookie
    setAnnouncementClose(UPDATE_DATE, {
      days: 999,
      SameSite: "Strict",
      Secure: true,
    });
  };

  return (
    <>
      {!announcementCloseState && (
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

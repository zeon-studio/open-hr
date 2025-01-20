import { useEffect, useState } from "react";
interface Data<T> {
  data: T[];
}

const useLocalCacheHook = <T>(data: Data<T>, name: string) => {
  const [localData, setLocalData] = useState<T[]>([]);

  useEffect(() => {
    if (data.data?.length) {
      localStorage.setItem(
        name,
        JSON.stringify(Array.isArray(data?.data) && data?.data.slice(0, 100))
      );
    } else {
      localStorage.removeItem(name);
    }
  }, [data]);

  useEffect(() => {
    const storedData = localStorage.getItem(name);
    if (storedData) {
      setLocalData(JSON.parse(storedData));
    }
  }, []);

  return {
    localData: localData,
  };
};

export default useLocalCacheHook;

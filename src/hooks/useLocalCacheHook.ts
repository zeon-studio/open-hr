/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
interface Data<T> {
  data: T[];
}

const useLocalCacheHook = <T>(data: Data<T>, name: string) => {
  const [localData, setLocalData] = useState<T[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem(name);
    if (storedData) {
      setLocalData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (data.data?.length > 0) {
      localStorage.setItem(name, JSON.stringify(data.data));
    }
  }, [data]);

  return {
    localData: localData,
  };
};

export default useLocalCacheHook;

import { useEffect, useState } from "react";

interface Data<T> {
  data: T[];
}

// Hydrate from localStorage on mount, then mirror RTK Query data back into
// it so a page reload has cached data while the network call is in flight.
//
// Performance note: callers pass `{ data: result }` constructed as an inline
// object literal on every render, so depending on `data` (the wrapper) ran
// the write effect every render. Depend on `data.data` (the inner array)
// instead — RTK Query keeps the same array reference across renders for
// cached data, so the effect now fires only when the data actually changes.
const useLocalCacheHook = <T>(data: Data<T>, name: string) => {
  const [localData, setLocalData] = useState<T[]>([]);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(name);
      if (storedData) setLocalData(JSON.parse(storedData));
    } catch {
      // private mode / quota / corrupt JSON — ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data.data?.length) return;
    try {
      localStorage.setItem(name, JSON.stringify(data.data));
    } catch {
      // quota exceeded — keep going, in-memory copy is still good
    }
  }, [data.data, name]);

  return {
    localData: localData,
  };
};

export default useLocalCacheHook;

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const useQuerySelector = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const onSelect = (queryParam: string, params: string) => {
    if (!searchParams) return;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const value = queryParam.trim();
    if (!value) {
      current.delete(params);
    } else {
      current.set(params, queryParam);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };
  return { onSelect: onSelect };
};

export default useQuerySelector;

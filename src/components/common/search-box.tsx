import { Input } from "@/ui/input";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const SearchBox = ({
  className = "mr-2",
  onSearch,
}: {
  className?: string;
  onSearch?: (value: string) => void;
}) => {
  const pathname = usePathname();
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(ref.current?.value || "");
    if (ref.current?.value) {
      router.push(`?search=${ref.current?.value}`);
    } else {
      if (pathname) {
        router.push(pathname);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <form onSubmit={handleSearch} className={className}>
      <Input ref={ref} type="text" placeholder="Search" />
    </form>
  );
};

export default SearchBox;

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const SearchBox = ({
  className,
  searchBy = "search",
  onSearch,
}: {
  className?: string;
  searchBy?: string;
  onSearch?: (value: string) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(ref.current?.value || "");
    router.push(`?${searchBy}=${ref.current?.value}`);
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

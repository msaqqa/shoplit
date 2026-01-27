"use client";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState(searchParams.get("search") || "");
  const [debouncedValue] = useDebounce(value, 400);

  // const handleSearch = (value: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set("search", value);
  //   router.push(`/products?${params.toString()}`, { scroll: false });
  // };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (!debouncedValue.trim()) {
      params.delete("search");
    } else {
      params.set("search", debouncedValue);
      router.push(`/products?${params.toString()}`, {
        scroll: false,
      });
    }
  }, [debouncedValue]);

  return (
    <div className="hidden md:flex items-center gap-2 rounded-md ring-1 ring-gray-200 px-2 py-1">
      <Search className="w-4 h-4 text-gray-500" />
      <input
        type="text"
        placeholder="Search..."
        // className="bg-transparent border-none focus:outline-none w-full"
        className="text-sm outline-0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;

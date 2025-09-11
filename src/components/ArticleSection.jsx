import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const categories = ["Highlight", "Cat", "Inspiration", "General"];

export default function ArticlesFilter() {
  const [category, setCategory] = useState("Highlight");
  const [search, setSearch] = useState("");

  return (
    <div className="w-full space-y-2 bg-[#F9F8F6] px-20 py-4">
      <h2 className="text-2xl font-semibold">Latest articles</h2>

      {/* Mobile layout */}
      <div className="flex flex-col gap-2 lg:hidden p-3 rounded-xl bg-[#EFEEEB]">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          <p className="text-sm mb-1">Category</p>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="pt-4 pb-4 px-6 hidden lg:flex items-center justify-between rounded-xl bg-[#EFEEEB]">
        <div className="flex gap-2">
          {categories.map((c) => (
            <Button
              key={c}
              variant={c === category ? "secondary" : "ghost"}
              className="rounded-xl"
              onClick={() => setCategory(c)}
            >
              {c}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>
    </div>
  );
}

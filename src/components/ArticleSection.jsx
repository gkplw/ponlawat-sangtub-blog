import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogPost";
import authorImage from "../assets/author-image.jpg";

function BlogCard(props) {
  const { image, category, title, description, author, date } = props
  return (
    <div className="flex flex-col gap-4">
      <a href="#" className="relative h-[212px] sm:h-[360px]">
        <img className="w-full h-full object-cover rounded-md" src={ image } alt={ title }/>
      </a>
      <div className="flex flex-col">
        <div className="flex">
          <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">{ category }
          </span>
        </div>
        <a href="#" >
          <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
          { title }
          </h2>
        </a>
        <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
          { description }
        </p>
        <div className="flex items-center text-sm">
          <img className="w-8 h-8 rounded-full mr-2" src={ authorImage } alt={ author } />
          <span>{ author }</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{ date }</span>
        </div>
      </div>
    </div>
  );
}

const categories = ["Highlight", "Cat", "Inspiration", "General"];

export function ArticlesFilter() {
  const [category, setCategory] = useState("Highlight");
  const [search, setSearch] = useState("");

  return (
    <div className="w-full space-y-2 bg-[#F9F8F6] px-19 py-4">
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

      {/* Blog posts grid */}
      <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
        {blogPosts.map((post) => (
          <BlogCard
            key={post.id}
            image={post.image}
            category={post.category}
            title={post.title}
            description={post.description}
            author={post.author}
            date={post.date}
          />
        ))}
      </article>
    </div>
  );
}

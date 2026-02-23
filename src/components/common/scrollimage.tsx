"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../components/ui/carousel";
import { Card } from "../../components/ui/card";
import { Link } from "react-router-dom";
import { colors } from "../../theme/colors";
import type { Blog } from "../../interface/Blog";

export default function BlogCarousel({ blogs }: { blogs: Blog[] }) {
  const [api, setApi] = React.useState<EmblaCarouselType | undefined>();
  const [current, setCurrent] = React.useState(0);

  const autoplay = React.useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
    }),
  );

  /* ---------- Sync Current Slide ---------- */
  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect(); // initialize
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="max-w-[1700px] relative left-1/2 -translate-x-1/2 mb-24">
      <Carousel
        setApi={setApi}
        plugins={[autoplay.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {blogs.map((blog) => (
            <CarouselItem key={blog.slug} className="basis-full">
              <div className="px-6">
                <Link to={`/blog/${blog.slug}`}>
                  <Card className="overflow-hidden rounded-3xl border bg-background shadow-sm hover:shadow-2xl transition-all duration-500">
                    {/* IMAGE */}
                    <div className="relative h-[700px] w-full overflow-hidden">
                      <img
                        src={
                          blog.coverImage?.url ||
                          "https://via.placeholder.com/1600x900"
                        }
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/50 to-transparent pointer-events-none" />

                      {/* CONTENT */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-4">
                        {blog.category?.name && (
                          <span className="inline-block bg-white/20 backdrop-blur-md text-xs px-3 py-1 rounded-full">
                            {blog.category.name}
                          </span>
                        )}

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl">
                          {blog.title}
                        </h2>

                        <p className="hidden sm:block max-w-3xl text-sm sm:text-base text-white/80 line-clamp-2">
                          {blog.excerpt}
                        </p>

                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs bg-white/20 px-2 py-1 rounded-md"
                              >
                                #{tag.name}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-white/80 pt-2">
                          {blog.author?.name && (
                            <>
                              <span>By {blog.author.name}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* DOTS */}
      <div className="flex justify-center gap-3 mt-6">
        {blogs.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index
                ? `w-8 ${colors.primary.base}`
                : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

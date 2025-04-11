import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { BlurFade } from "./blur-fade";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  stickyContent?: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 first:pt-0 md:gap-10"
          >
            <BlurFade delay={0.3 + index * 0.2} className="hidden md:flex sticky flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <div className="hidden md:flex flex-col md:pl-20 gap-4">
                <h3 className="text-xl md:text-5xl font-bold  ">
                  {item.title}
                </h3>
                {item.stickyContent}
              </div>
            </BlurFade>
            <BlurFade delay={0.4 + index * 0.1} >
              <div className="relative px-4 w-full">
                <div className="md:hidden flex justify-between items-center">
                  <h3 className="text-2xl mb-4 text-left font-bold ">
                    {item.title}
                  </h3>
                  {item.stickyContent}
                </div>
                {item.content}{" "}
              </div>
            </BlurFade>

          </div>
        ))}
          <BlurFade
            delay={0.25}
            inView
            style={{
              height: height + "px",
            }}
            className="hidden md:block absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
          >
            <motion.div
              style={{
                height: heightTransform,
                opacity: opacityTransform,
              }}
              className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
            />
          </BlurFade>
      </div>
    </div>
  );
};

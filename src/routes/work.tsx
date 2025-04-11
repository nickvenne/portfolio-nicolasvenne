import { createFileRoute } from "@tanstack/react-router";
import { DirectionAwareHover } from "~/components/ui/direction-hover";
import { Timeline, TimelineEntry } from "~/components/ui/timeline";
import { basehub } from "basehub";
import { RichText } from "basehub/react-rich-text";
import { createServerFn } from "@tanstack/react-start";
import type { TimelineItem as TimelineType } from ".basehub/schema";
import { LinkPreview } from "~/components/ui/link-preview";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { BlurFade } from "~/components/ui/blur-fade";

const workQuery = createServerFn({ method: "GET" }).handler(async () => {
  const data = await basehub().query({
    changelog: {
      timeline: {
        items: {
          date: true,
          timelineTag: true,
          description: {
            html: true,
            json: {
              content: true,
            },
          },
          work: {
            employer: true,
            logo: true,
          },
          images: {
            items: {
              image: {
                url: true,
              },
              description: true,
            },
          },
        },
      },
    },
    __typename: true,
  });
  return data;
});

export const Route = createFileRoute("/work")({
  component: RouteComponent,
  loader: async () => await workQuery(),
});

const convertTimeline = (timeline: TimelineType): TimelineEntry => {
  return {
    title: timeline.timelineTag ?? "",
    content: (
      <div className="flex flex-col gap-8">
        {timeline.description && (
          <section className="prose text-white">
            <RichText components={{ 
              a: (props) => <LinkPreview {...props} />,
            }} >{timeline.description.json.content}</RichText>
          </section>
        )}
        {timeline.images && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {timeline.images.items.map(
              (image, index) =>
                image.image?.url && (
                  <DirectionAwareHover
                    imageUrl={image.image.url}
                    key={index}
                    className="w-full h-auto"
                  >
                    {image.description}
                  </DirectionAwareHover>
                )
            )}
          </div>
        )}
      </div>
    ),
    stickyContent: timeline.work && (
      <div className="flex gap-4 items-center">
        {timeline.work.logo && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  dangerouslySetInnerHTML={{ __html: timeline.work.logo }}
                  className="w-8 h-8"
                />
              </TooltipTrigger>
              <TooltipContent>
                For: {timeline.work.employer}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    ),
  };
};

function RouteComponent() {
  const state = Route.useLoaderData();
  const data = state.changelog.timeline.items
    .map((item => convertTimeline(item as TimelineType)))
    .sort((a, b) => {
      const dateA = new Date(a.title);
      const dateB = new Date(b.title);
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <main className="flex flex-col max-w-7xl mx-auto items-center pt-32 mb-32">
      <BlurFade delay={0.2} inView>
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 self-center mb-24">
          Work changelog
        </h1>
      </BlurFade>
      <Timeline data={data} />
    </main>
  );
}

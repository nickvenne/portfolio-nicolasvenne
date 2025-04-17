import { createFileRoute } from '@tanstack/react-router'
import { WobbleCard } from "~/components/ui/wobble-card"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "~/components/ui/button"
import { PerlinNoiseTexture } from "~/components/ui/noise-texture"
import { createServerFn } from '@tanstack/react-start'
import { basehub } from '.basehub'
import { BlurFade } from '~/components/ui/blur-fade'
import { Marquee } from '~/components/ui/marquee'
import TechTag from '~/components/tech-tag'
import { Image } from '~/components/Image'

const stuffQuery = createServerFn({method: "GET"}).handler(async () => {
  const data = await basehub().query({
    projects: {
      items: {
        _title: true,
        summary: true,
        startDate: true,
        endDate: true,
        images: {
          items: {
            image: {
              url: true
            }
          }
        },
        video: {
          url: true
        },
        technologies: {
          name: true
        },
        githubLink: true,
        viewLink: true,
        cardColor: {
          hex: true
        }
      }
    },
    __typename: true,
  })
  return data
})

export const Route = createFileRoute('/stuff')({
  component: StuffIndexComponent,
  loader: async () => await stuffQuery(),
  
})

function StuffIndexComponent() {
  const data = Route.useLoaderData()
  const projects = data.projects.items;
  return <main className="flex flex-col max-w-screen-xl px-4 items-center self-center py-8 mb-32">
    <BlurFade delay={0.25} inView>
      <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 mb-24 mt-32">Projects</h1>
    </BlurFade>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full py-8">
      {projects.map((project, index) => (
        <BlurFade key={index} delay={0.25 + index * 0.1} inView className="col-span-1 min-h-[400px] relative h-full">
          <WobbleCard
            key={index}
            containerClassName={` overflow-hidden bg-[${project.cardColor.hex}]`}
            className="flex flex-col justify-between h-full py-12"
          >
            {/* Programmatically generated noise texture */}
            <PerlinNoiseTexture opacity={0.2} color={project.cardColor.hex} />

            <div className="relative z-10">
              <h2 className="text-left text-balance text-xl lg:text-2xl font-semibold tracking-tight text-white">
                {project._title}
              </h2>
              {project.startDate && <span className="mt-2 text-neutral-200">{new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>}
              <p className="mt-4 text-left text-sm/6 text-neutral-200">{project.summary}</p>
            </div>

            <div className="mt-6 relative z-10 gap-4 flex flex-col">
              {project.images?.items?.length > 0 && <Marquee pauseOnHover reverse={index % 2 === 0} className="[--duration:20s] -ml-10 -mr-10 mb-4">
                {project.images.items.map((image, index) => (
                  <Image
                    key={index}
                    file={image.image}
                    width={1280}
                    className="rounded-lg object-cover w-80 h-60 mr-4"
                  />
                ))}
              </Marquee>}
              {project.video?.url && <video className="object-cover h-60 -ml-10 -mr-10 mb-4 max-w-none" autoPlay loop muted playsInline>
                <source src={project.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>}
              {project.technologies && <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  tech?.name && <TechTag key={index} name={tech.name} />
                ))}
              </div>}
              <div className="flex gap-2">
                {project.viewLink && <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                  <a href={project.viewLink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    View
                  </a>
                </Button>}
                {project.githubLink && <Button size="sm" variant="outline" className="flex items-center gap-1" asChild>
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    Code
                  </a>
                </Button>}
              </div>
            </div>
          </WobbleCard>
        </BlurFade>
      ))}
    </div>
  </main>
}

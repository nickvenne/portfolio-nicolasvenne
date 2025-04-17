import { createFileRoute, useRouter } from '@tanstack/react-router'
import React, { useEffect } from 'react'
import ExperienceList from '~/components/ExperienceList'
import { BlurFade } from '~/components/ui/blur-fade'
import { TypingAnimation } from '~/components/ui/typing-animation'
import CanvasCursor from '~/components/ui/canvas-cursor'
import { ShootingStars } from '~/components/ui/shooting-stars'
import { Spotlight } from '~/components/ui/spotlight'
import { StarsBackground } from '~/components/ui/stars-background'
import { basehub } from 'basehub'
import { createServerFn } from '@tanstack/react-start'
import { Button } from '~/components/ui/button'
import { url } from 'inspector'
import EducationCard from '~/components/EducationCard'
import { BlockImage, EducationItem } from '.basehub/schema'
import { Image } from '~/components/Image'


const homeQuery = createServerFn({method: "GET"}).handler(async () => {
  const data = await basehub().query({
    workExperience: {
      items: {
        employer: true,
        jobTitle: true,
        startDate: true,
        description: true,
        endDate: true,
        techStack: {
          name: true
        },
        logo: true
      },
    },
    index: {
      blurb: true,
      aboutMe: {
        html: true
      },
      avatar: {
        url: true,
        alt: true,
      },
      education: {
        items: {
          name: true,
          degree: true,
          startDate: true,
          endDate: true,
          description: true,
          logo: true,
          location: true
        }
      }
    },
    __typename: true,
  })
  return data
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await homeQuery(),
})

function Home() {
  const state = Route.useLoaderData()
 
  return (
    <main className="flex flex-col flex-1 items-center mb-32">
      <div className="fixed left-4 top-4">
        <span></span>
      </div>
      <div className="max-w-screen-md flex flex-col py-12 px-6">
        <div className="flex mt-[40dvh] gap-8 ">
          <div className="flex flex-col">
            <BlurFade delay={0.25} inView>
              <h1 className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                Hi! I'm Nick.
              </h1>
            </BlurFade>
            <BlurFade delay={0.5} inView>
              <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg">
                {state.index.blurb} 
              </p>
            </BlurFade>
          </div>
          <div className="max-w-32 max-h-32 h-full w-full rounded-full overflow-hidden flex-1 min-w-16 min-h-16">
            <BlurFade delay={0.3} inView>
              <Image file={state.index.avatar} width={256}/>
            </BlurFade>
          </div>
        </div>

        <BlurFade delay={1.5} inView className="mt-32 self-center mb-[40dvh]">
          <a className="scroll-down" href="#about">
            <div className="scroll"> </div>
          </a>
        </BlurFade>
        
        <BlurFade delay={0.1} inView>
          <div className="mb-10 mt-6">
            <h2 id="about" className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-6">About Me</h2>
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 prose max-w-none text-white" dangerouslySetInnerHTML={{ __html: state.index.aboutMe?.html || "" }} />
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="mb-10 mt-6">
            <h2 id="about" className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 ">Work Experience</h2>
          </div>
          <ExperienceList />
        </BlurFade>

        <BlurFade delay={0.1} inView>
          <div className="mb-10">
            <h2 id="about" className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 ">Education</h2>
          </div>
          {state.index.education.items.map((education, index) => (
            <EducationCard key={index} education={education as EducationItem} />
          ))}
        </BlurFade> 
      </div>
    </main>
  )
}

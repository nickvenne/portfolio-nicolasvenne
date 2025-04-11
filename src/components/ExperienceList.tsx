import type React from "react"
import { Route as HomeRoute } from "~/routes/index"
import { GlowingEffect } from "~/components/ui/glowing-effect"
import TechTag from "./tech-tag"

interface Experience {
  company: string
  logo: React.ReactNode
  title: string
  period: string
  description?: string
  technologies: string[]
}

// Type for the data from the API
interface WorkExperienceItem {
  employer: string
  jobTitle: string
  startDate: string
  endDate: string | null
  description?: string
  logo: string
  techStack?: { name: string }[]
}

export default function ExperienceList() {
  // Get the data from the route loader
  const data = HomeRoute.useLoaderData()
  const apiExperiences = data?.workExperience?.items || []
  
  // Transform API data to our component format
  const experiences = apiExperiences.map((item) => {
    // Format the date period
    const startDate = new Date(item.startDate)
    const startYear = startDate.getFullYear()
    const endYear = item.endDate ? new Date(item.endDate).getFullYear() : "Present"
    
    // Return the formatted experience
    return {
      company: item.employer,
      logo: (
        <div 
          dangerouslySetInnerHTML={{ __html: item.logo ?? "" }} 
          className="w-10 h-10"
        />
      ),
      title: item.jobTitle,
      period: `${startYear} - ${endYear}`,
      technologies: item.techStack?.map(tech => tech.name),
      description: item.description || "No description available."
    }
  })
  
  // Use sample data if no API data is available
  const fallbackExperiences: Experience[] = [
    {
      company: "Klipfolio",
      logo: (
        <div
          dangerouslySetInnerHTML={{ 
            __html: `<svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 51 51"
              width="40"
              height="40"
            >
              <path
                d="M45.53.37h-40a5 5 0 0 0-5 5v40a5 5 0 0 0 5 5h40a5 5 0 0 0 5-5v-40a5 5 0 0 0-5-5Z"
                fill="#fff"
              />
              <path
                d="M8 15.36a.84.84 0 0 1 .85-.83h4.63a.84.84 0 0 1 .85.83v10.19c0 .46.19.51.43.11L21 15.25a1.64 1.64 0 0 1 1.28-.72H27c.47 0 .63.31.37.69l-6.3 9a1.66 1.66 0 0 0-.14 1.45l7.19 16.39a.51.51 0 0 1-.51.76h-4.9a1.33 1.33 0 0 1-1.15-.78l-4.48-11.45c-.17-.43-.52-.47-.78-.09l-1.45 2.06a3.12 3.12 0 0 0-.48 1.52v8a.84.84 0 0 1-.85.83H8.88A.839.839 0 0 1 8 42V15.36Z"
                fill="#000"
              />
              <path
                d="M41.41 21a1 1 0 0 0 1.59-.61V9.05a1.18 1.18 0 0 0-1.18-1.18h-11.3a1 1 0 0 0-.64 1.57L41.41 21Z"
                fill="#ED1C24"
              />
            </svg>` 
          }}
        />
      ),
      title: "Senior Full-Stack Developer",
      period: "2020 - Present",
      description: "Leading development on core product features, implementing modern React patterns and optimizing performance.",
      technologies: ["React", "TypeScript", "Node.js"]
    }
  ]

  // Use API data if available, otherwise use fallback
  const displayExperiences = experiences.length > 0 ? experiences : fallbackExperiences
  
  return (
    <div className="w-full mb-16">
      <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
        {displayExperiences.map((experience, index) => (
          <ExperienceCard key={index} experience={experience as Experience} />
        ))}
      </div>
    </div>
  )
}

interface ExperienceCardProps {
  experience: Experience
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <div className="relative w-full">
      <div className="relative rounded-2xl border border-neutral-800 p-2 md:p-3">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
        <div className="relative flex flex-col overflow-hidden bg-black/20 rounded-xl border-0.75 border-neutral-800 p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 rounded-lg border border-neutral-700 bg-neutral-800 p-2">
              {experience.logo}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-white">{experience.company}</h3>
                <span className="text-sm text-neutral-400">{experience.period}</span>
              </div>
              <h4 className="mt-1 text-lg text-neutral-200">{experience.title}</h4>
              {experience.description && (
                <p className="mt-3 text-neutral-400">{experience.description}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {experience.technologies.map((tech, index) => (
                  <TechTag key={index} name={tech} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



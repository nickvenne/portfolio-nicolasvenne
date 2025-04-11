import { EducationItem } from ".basehub/schema"
import { GlowingEffect } from "./ui/glowing-effect"

const EducationCard = ({ education }: {education: EducationItem}) => {
  const startDate = new Date(education.startDate ?? "")
  const startYear = startDate.getFullYear()
  const endYear = education.endDate ? new Date(education.endDate).getFullYear() : "Present"

  return (
    <div className="relative w-full">
      <div className="relative rounded-2xl border border-neutral-800 p-2 md:p-3">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
        <div className="relative flex flex-col overflow-hidden bg-black/20 rounded-xl border-0.75 border-neutral-800 p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="flex items-start gap-4">
            {education.logo && <div className="flex-shrink-0 rounded-lg border border-neutral-700 bg-neutral-800 p-2">
              <div 
                dangerouslySetInnerHTML={{ __html: education.logo }} 
                className="w-10 h-10"
              />
            </div>}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-white">{education.name}</h3>
                <span className="text-sm text-neutral-400">{startYear} - {endYear}</span>
              </div>
              <h4 className="mt-1 text-lg text-neutral-200">{education.degree}</h4>
              {education.description && (
                <p className="mt-3 text-neutral-400">{education.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EducationCard

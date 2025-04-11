interface TechTagProps {
  name: string
}

const TechTag = ({ name }: TechTagProps) => {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs font-medium text-neutral-200 border border-neutral-700 transition-colors hover:bg-neutral-700 hover:text-white">
      {name}
    </span>
  )
}

export default TechTag
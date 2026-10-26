export function PageHeader({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}

export function StatusPill({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'info' | 'warn' | 'good'
  children: React.ReactNode
}) {
  const tones = {
    neutral: 'bg-secondary text-secondary-foreground',
    info: 'bg-primary/15 text-primary',
    warn: 'bg-chart-5/15 text-chart-5',
    good: 'bg-chart-2/15 text-chart-2',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  )
}

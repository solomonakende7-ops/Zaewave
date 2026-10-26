import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import {
  AudioWaveform,
  Disc3,
  Globe2,
  LayoutDashboard,
  Library,
  Menu,
  Radio,
  Settings,
  Wand2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { LogoMark, Wordmark } from '@/components/brand'
import { artist } from '@/lib/fixtures'

export const Route = createFileRoute('/dashboard')({
  head: () => ({ meta: [{ title: 'Dashboard · ZaeWave' }] }),
  component: DashboardLayout,
})

const items = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/studio', label: 'Studio', icon: AudioWaveform },
  { to: '/dashboard/remake', label: 'Remake My Song', icon: Wand2 },
  { to: '/dashboard/music', label: 'My Music', icon: Library },
  { to: '/dashboard/releases', label: 'Releases', icon: Disc3 },
  { to: '/dashboard/distribution', label: 'Distribution', icon: Globe2 },
  { to: '/channels', label: 'Channels', icon: Radio },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
] as const

function NavList({ onNavigate }: { onNavigate?: boolean }) {
  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-1">
      {items.map(({ to, label, icon: Icon, ...rest }) => {
        const link = (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: 'exact' in rest }}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground data-[status=active]:bg-primary/15 data-[status=active]:text-primary motion-reduce:transition-none"
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        )
        return onNavigate ? (
          <SheetClose asChild key={to}>
            {link}
          </SheetClose>
        ) : (
          link
        )
      })}
    </nav>
  )
}

function DashboardLayout() {
  return (
    <div className="min-h-svh bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-svh flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Wordmark to="/dashboard" className="mb-8 px-2" />
        <NavList />
        <div className="mt-auto rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3">
          <p className="text-sm font-semibold">{artist.displayName}</p>
          <p className="text-xs text-muted-foreground">
            {artist.accountType} · {artist.plan}
          </p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur lg:hidden">
          <Wordmark to="/dashboard" size={30} />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <LogoMark size={28} /> ZaeWave
                </SheetTitle>
                <SheetDescription>Signed in as {artist.displayName} (preview)</SheetDescription>
              </SheetHeader>
              <div className="px-4">
                <NavList onNavigate />
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <div className="border-b border-primary/20 bg-primary/10 px-4 py-2 text-center text-xs text-foreground/90 sm:px-6">
          Preview workspace. Sample catalog data is shown until accounts and storage are connected.
        </div>
        <main className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

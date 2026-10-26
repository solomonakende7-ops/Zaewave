import { Link } from '@tanstack/react-router'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Wordmark } from '@/components/brand'

const nav = [
  { href: '/#features', label: 'Features' },
  { href: '/#studio', label: 'Studio' },
  { href: '/#ai-studio', label: 'AI studio' },
  { href: '/#artists', label: 'Artists' },
  { href: '/#how', label: 'How it works' },
  { href: '/#pricing', label: 'Pricing' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 sm:px-6">
        <Wordmark />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
          <Link
            to="/channels"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Channels
          </Link>
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="ghost" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">Open dashboard</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>ZaeWave</SheetTitle>
              <SheetDescription>
                Studio, remakes and distribution.
              </SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="rounded-md px-3 py-2.5 font-medium hover:bg-accent"
                >
                  {n.label}
                </a>
              ))}
              <Link
                to="/channels"
                className="rounded-md px-3 py-2.5 font-medium hover:bg-accent"
              >
                Channels
              </Link>
              <Link
                to="/login"
                className="rounded-md px-3 py-2.5 font-medium hover:bg-accent"
              >
                Sign in
              </Link>
              <Button className="mt-3" asChild>
                <Link to="/dashboard">Open dashboard</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <Wordmark size={28} />
          <p className="mt-2 text-sm text-muted-foreground">
            A Zae Digital Hub product. Created by Zae Lilith.
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
        >
          <Link to="/channels" className="hover:text-foreground">
            Channels
          </Link>
          <Link to="/dashboard/distribution" className="hover:text-foreground">
            Distribution
          </Link>
          <a
            href="https://zaedigital.wordpress.com"
            className="hover:text-foreground"
            rel="noopener"
          >
            About Zae Digital
          </a>
        </nav>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} ZaeWave
        </p>
      </div>
    </footer>
  )
}

import { Link, useNavigate } from '@tanstack/react-router'
import { Info } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogoArtwork } from '@/components/brand'

export function AuthCard({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const isLogin = mode === 'login'

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    toast.info('Preview mode', {
      description:
        'Accounts are being connected next. Explore the dashboard now. Nothing you enter here is stored.',
    })
    void navigate({ to: '/dashboard' })
  }

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-brand-navy p-10 lg:flex">
        <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          ← Back to ZaeWave
        </Link>
        <LogoArtwork className="mx-auto max-w-lg" />
        <p className="max-w-sm text-sm text-muted-foreground">
          Create, remake and release music from one studio.
        </p>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 overflow-hidden rounded-2xl bg-brand-navy lg:hidden">
            <LogoArtwork />
          </div>
          <h1 className="text-3xl font-bold">
            {isLogin ? 'Welcome back' : 'Create your artist account'}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin
              ? 'Sign in to your ZaeWave studio.'
              : 'Free to start. Upgrade whenever you need more credits.'}
          </p>
          <div className="mt-6 flex gap-2 rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs text-foreground/90">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <p>ZaeWave accounts are coming soon. Continuing opens the preview dashboard.</p>
          </div>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="stage">Stage name</Label>
                <Input id="stage" name="stage" autoComplete="nickname" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={8}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              {isLogin ? 'Sign in' : 'Create account'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? 'New to ZaeWave? ' : 'Already have an account? '}
            <Link
              to={isLogin ? '/register' : '/login'}
              className="font-semibold text-primary hover:underline"
            >
              {isLogin ? 'Create an account' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/page-header'
import { artist } from '@/lib/fixtures'

export const Route = createFileRoute('/dashboard/settings')({
  head: () => ({ meta: [{ title: 'Settings · ZaeWave' }] }),
  component: Settings,
})

const KEY = 'zaewave.profile'
const defaults = { displayName: artist.displayName, legalName: artist.legalName, country: artist.country, bio: '' }

function Settings() {
  const [profile, setProfile] = useState(defaults)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved) setProfile({ ...defaults, ...JSON.parse(saved) })
    } catch {
      /* ignore corrupt local data */
    }
  }, [])

  function onSave(e: React.FormEvent) {
    e.preventDefault()
    localStorage.setItem(KEY, JSON.stringify(profile))
    toast.success('Profile saved on this device', { description: 'It syncs to your account once sign-in is live.' })
  }

  const field = (k: keyof typeof defaults) => ({
    value: profile[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setProfile((p) => ({ ...p, [k]: e.target.value })),
  })

  return (
    <>
      <PageHeader title="Settings" description="Manage your artist profile and account preferences." />
      <form onSubmit={onSave} className="max-w-2xl space-y-6 rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="displayName">Stage name</Label>
            <Input id="displayName" required {...field('displayName')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="legalName">Legal name (for royalties)</Label>
            <Input id="legalName" {...field('legalName')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...field('country')} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Artist bio</Label>
          <Textarea id="bio" rows={4} maxLength={1000} {...field('bio')} />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    </>
  )
}

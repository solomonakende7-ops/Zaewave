import { createFileRoute } from '@tanstack/react-router'
import { AuthCard } from '@/components/auth-card'

export const Route = createFileRoute('/register')({
  head: () => ({ meta: [{ title: 'Create account · ZaeWave' }] }),
  component: () => <AuthCard mode="register" />,
})

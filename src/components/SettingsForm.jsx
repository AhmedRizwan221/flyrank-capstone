import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm Password is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword']
})

export default function SettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting }
  } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(data)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="name">Full Name</label>
        <input
          {...register('name')}
          type="text"
          id="name"
          placeholder="John Doe"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <span role="alert">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          {...register('email')}
          type="email"
          id="email"
          placeholder="john@example.com"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <span role="alert">{errors.email.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          {...register('password')}
          type="password"
          id="password"
          placeholder="•••••••••"
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <span role="alert">{errors.password.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          {...register('confirmPassword')}
          type="password"
          id="confirmPassword"
          placeholder="•••••••••"
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <span role="alert">{errors.confirmPassword.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting || isFormSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
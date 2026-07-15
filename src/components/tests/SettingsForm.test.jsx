import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SettingsForm from '../SettingsForm'

describe('SettingsForm', () => {
  beforeEach(() => {
    render(<SettingsForm />)
  })

  it('renders all form fields correctly', () => {
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('shows validation errors on submit when form is empty', async () => {
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert', { name: /name is required/i })).toBeInTheDocument()
      expect(screen.getByRole('alert', { name: /email is required/i })).toBeInTheDocument()
      expect(screen.getByRole('alert', { name: /invalid email/i })).toBeInTheDocument()
      expect(screen.getByRole('alert', { name: /password must be at least 8 characters/i })).toBeInTheDocument()
      expect(screen.getByRole('alert', { name: /confirm password is required/i })).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    fireEvent.input(screen.getByPlaceholderText('john@example.com'), {
      target: { value: 'invalid-email' }
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert', { name: /invalid email/i })).toBeInTheDocument()
    })
  })

  it('validates password length', async () => {
    fireEvent.input(screen.getByPlaceholderText('•••••••••'), {
      target: { value: '123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert', { name: /password must be at least 8 characters/i })).toBeInTheDocument()
    })
  })

  it('validates password match', async () => {
    fireEvent.input(screen.getByLabelText(/^password$/i), {
      target: { value: 'password123' }
    })
    fireEvent.input(screen.getByLabelText(/confirm password/i), {
      target: { value: 'different123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert', { name: /passwords must match/i })).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    fireEvent.input(nameInput, { target: { value: formData.name } })
    fireEvent.input(emailInput, { target: { value: formData.email } })
    fireEvent.input(passwordInput, { target: { value: formData.password } })
    fireEvent.input(confirmPasswordInput, { target: { value: formData.confirmPassword } })

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /submitting.../i })).toBeInTheDocument()
    })
  })
})
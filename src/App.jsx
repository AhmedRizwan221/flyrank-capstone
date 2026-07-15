import { useState } from 'react'
import './App.css'

function App() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    notifications: true,
    newsletter: false
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = (field, value) => {
    const newErrors = { ...errors }

    switch (field) {
      case 'username':
        if (!value.trim()) newErrors.username = 'Username is required'
        else if (value.length < 3) newErrors.username = 'Username must be at least 3 characters'
        else if (!/^[a-zA-Z0-9_]+$/.test(value)) newErrors.username = 'Username can only contain letters, numbers, and underscores'
        else delete newErrors.username
        break

      case 'email':
        if (!value.trim()) newErrors.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = 'Please enter a valid email address'
        else delete newErrors.email
        break

      case 'password':
        if (!value) newErrors.password = 'Password is required'
        else if (value.length < 8) newErrors.password = 'Password must be at least 8 characters'
        else if (!/[A-Z]/.test(value)) newErrors.password = 'Password must contain at least one uppercase letter'
        else if (!/[0-9]/.test(value)) newErrors.password = 'Password must contain at least one number'
        else delete newErrors.password
        break

      case 'confirmPassword':
        if (!value) newErrors.confirmPassword = 'Please confirm your password'
        else if (value !== form.password) newErrors.confirmPassword = 'Passwords do not match'
        else delete newErrors.confirmPassword
        break

      case 'bio':
        if (value.length > 200) newErrors.bio = 'Bio must be under 200 characters'
        else delete newErrors.bio
        break

      default:
        break
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setForm(prev => ({ ...prev, [name]: newValue }))

    if (touched[name]) {
      setErrors(prev => validate(name, newValue))
    }
  }

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => validate(name, newValue))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const allTouched = {
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      bio: true
    }
    setTouched(allTouched)

    const newErrors = {}
    Object.keys(form).forEach(key => {
      const fieldErrors = validate(key, form[key])
      Object.assign(newErrors, fieldErrors)
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true)
    }
  }

  return (
    <div className="app">
      <div className="settings-container">
        <h1 className="title">Account Settings</h1>

        {submitted ? (
          <div className="success-message">
            <h2>Settings saved successfully!</h2>
            <button onClick={() => setSubmitted(false)}>Edit Settings</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="form-section">
              <h2 className="section-title">Profile</h2>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.username && touched.username ? 'input-error' : ''}
                />
                {errors.username && touched.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email ? 'input-error' : ''}
                />
                {errors.email && touched.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio (optional)</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="3"
                  maxLength="200"
                  className={errors.bio && touched.bio ? 'input-error' : ''}
                />
                <span className="char-count">{form.bio.length}/200</span>
                {errors.bio && touched.bio && (
                  <span className="error-message">{errors.bio}</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Security</h2>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password && touched.password ? 'input-error' : ''}
                />
                {errors.password && touched.password && (
                  <span className="error-message">{errors.password}</span>
                )}
                <p className="password-hint">
                  Must be at least 8 characters with one uppercase letter and one number
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Notifications</h2>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={form.notifications}
                    onChange={handleChange}
                  />
                  <span>Email notifications</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={form.newsletter}
                    onChange={handleChange}
                  />
                  <span>Weekly newsletter</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default App

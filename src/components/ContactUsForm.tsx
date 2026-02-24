import { useState } from 'preact/hooks'
import { useForm } from 'react-hook-form'

type ContactUsFormProps = {
  id?: string
  subject?: string
  eventName?: string
  variant?: 'light' | 'dark'
  transparentInputs?: boolean
  submitLabelColor?: string
  successTitle?: string
  successMessage?: string
}

export function ContactUsForm(props: ContactUsFormProps) {
  const {
    id = 'form',
    subject = 'New Contact Us Submission',
    eventName = 'XT26',
    variant = 'light',
    transparentInputs = false,
    submitLabelColor,
    successTitle = 'Thank you for getting in touch',
    successMessage = "We'll get back to you shortly."
  } = props

  const isDark = variant === 'dark'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm()

  const [isSubmitError, setIsSubmitError] = useState<boolean>(false)

  function submitContactForm(data: Record<string, unknown>) {
    const json = JSON.stringify(data)

    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: json
    }).catch((error) => {
      console.error(error)
      setIsSubmitError(true)
    })
  }

  const hasErrors = Object.keys(errors).length > 0

  const baseInputClasses = 'w-full px-4 py-3 text-sm border border-juxt/40 focus:outline-none focus:border-juxt transition-colors'

  const inputClasses = transparentInputs
    ? `${baseInputClasses} bg-transparent ${isDark ? 'text-white placeholder:text-gray-400' : 'text-gray-900 placeholder:text-gray-400'}`
    : isDark
      ? `${baseInputClasses} bg-white text-gray-900 placeholder:text-gray-400`
      : `${baseInputClasses} bg-gray-50 text-gray-900 placeholder:text-gray-400`

  if (isSubmitSuccessful && !isSubmitError) {
    return (
      <div className='py-12 text-center'>
        <div className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-green-50'}`}>
          <svg className={`w-8 h-8 ${isDark ? 'text-juxt' : 'text-green-500'}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        </div>
        <h3 className={`text-2xl font-light mb-3 justify-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {successTitle}
        </h3>
        <p className={`font-light mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {successMessage}
        </p>
      </div>
    )
  }

  if (isSubmitError) {
    return (
      <div className='py-12 text-center'>
        <div className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-red-50'}`}>
          <svg className='w-8 h-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </div>
        <h3 className={`text-2xl font-light mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Something went wrong
        </h3>
        <p className={`font-light ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Please reach us directly at{' '}
          <a href='mailto:info@juxt.pro' className='text-juxt hover:underline'>
            info@juxt.pro
          </a>
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(submitContactForm)}
      id={id}
      className='space-y-8'
    >
      <input type='hidden' {...register('subject')} value={subject} />
      <input
        type='hidden'
        {...register('access_key')}
        value='c2bf653a-2baa-466d-bbcc-390272663918'
      />

      {/* Row 1: Name fields */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
        <input
          {...register('firstName', { required: true })}
          placeholder='First Name'
          className={inputClasses}
        />
        <input
          {...register('lastName', { required: true })}
          placeholder='Last Name'
          className={inputClasses}
        />
      </div>

      {/* Row 2: Email and Company */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
        <input
          {...register('email', { required: true })}
          type='email'
          placeholder='Email Address'
          className={inputClasses}
        />
        <input
          {...register('company', { required: true })}
          placeholder='Company'
          className={inputClasses}
        />
      </div>

      {/* Row 3: Job Title and Country */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
        <input
          {...register('jobTitle', { required: true })}
          placeholder='Job Title'
          className={inputClasses}
        />
        <input
          {...register('country', { required: true })}
          placeholder='Country'
          className={inputClasses}
        />
      </div>

      {hasErrors && (
        <div className='text-red-400 text-sm pt-1'>All fields are required</div>
      )}

      {/* Footer: Submit + Privacy */}
      <div className='flex flex-col items-center gap-6 pt-4'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-juxt px-10 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-juxt/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          style={submitLabelColor ? { color: submitLabelColor } : undefined}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <p className={`text-xs font-light text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          By submitting you agree to our{' '}
          <a
            href='/privacy-policy'
            target='_blank'
            className={`underline transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </form>
  )
}

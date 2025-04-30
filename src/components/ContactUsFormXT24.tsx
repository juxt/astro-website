import { useState } from 'preact/hooks'
import { useForm } from 'react-hook-form'

const inputProps = {
  type: 'text',
  className:
    'flex-grow-1 bg-gray-50 border border-juxt text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2.5'
}

export default function ContactUsFormXT24(props) {
  const { id = 'form', subject = 'New Contact Us Submission' } = props

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm()

  const [isSubmitError, setIsSubmitError] = useState<boolean>(false)

  const isSubmitted = isSubmitSuccessful || isSubmitError

  function submitContactForm(data) {
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

  const isSubmitSuccessfulComponent = (
    <div className='pt-10 text-center text-xl md:text-xl text-black'>
      Thank you for your interest in XT25!
      <br />
      We'll reach out if spots become available.
      <br />
      <br />
      <b class='bold'>
        Please note: <br /> This is not a ticket confirmation
      </b>
    </div>
  )

  const isSubmitErrorComponent = (
    <div className='md:px-8 text-xl md:text-2xl text-red-600'>
      Mmm.. It seems there's a problem.. Anyways, you can reach us directly at{' '}
      <strong>info@juxt.pro</strong>
    </div>
  )

  return (
    <>
      {isSubmitSuccessful && !isSubmitError && isSubmitSuccessfulComponent}
      {isSubmitError && isSubmitErrorComponent}

      {!isSubmitted && (
        <div className='text-center'>
          <span className='text-center font-semibold'>
            Interested in receiving an invite? Leave us your details, and we'll
            get back to you.
            <br />
            <br />
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(submitContactForm)}
        id={id}
        class={'flex flex-col gap-4 ' + (isSubmitted ? 'hidden' : '')}
      >
        <input type='hidden' {...register('subject')} value={subject} />
        <input
          type='hidden'
          {...register('access_key')}
          value='c2bf653a-2baa-466d-bbcc-390272663918'
        />

        <div className='flex flex-row gap-4'>
          <input
            {...inputProps}
            {...register('firstName', { required: true })}
            placeholder='First Name'
          />
          <input
            {...inputProps}
            {...register('lastName', { required: true })}
            placeholder='Last Name'
          />
        </div>

        <input
          {...inputProps}
          {...register('email', { required: true })}
          placeholder='Email'
          type='email'
        />

        <div className='flex flex-row gap-4'>
          <input
            {...inputProps}
            {...register('jobTitle', { required: true })}
            placeholder='Job Title'
          />
        </div>

        <div className='flex flex-row gap-4'>
          <input
            {...inputProps}
            {...register('company', { required: true })}
            placeholder='Company'
          />
          <input
            {...inputProps}
            {...register('country', { required: true })}
            placeholder='Country'
          />
        </div>

        <div className='text-xs font-light'>
          By submitting your details you agree to JUXT's{' '}
          <a href='/privacy-policy' target='_blank' className='underline'>
            Privacy Policy
          </a>
        </div>

        {hasErrors && (
          <div className='text-red-500'>All fields are required</div>
        )}

        <div className='grid grid-cols-5 gap-4 mb-[-20px]'>
          <div className='col-span-3'></div>
          <div className='col-span-2'>
            <input
              type='submit'
              value='Submit'
              disabled={isSubmitting}
              className='bg-black px-4 py-2 text-white hover:bg-orange-100 hover:text-juxt font-bold shadow rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm w-full'
            />
          </div>
          <div class='flex-grow' style='min-height: 10px;'></div>
        </div>
      </form>
    </>
  )
}

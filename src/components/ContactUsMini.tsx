import { useState } from 'preact/hooks'
import { useForm } from 'react-hook-form'

const inputProps = {
  type: 'text',
  className:
    'flex-grow-1 bg-gray-50 border border-juxt text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2.5'
}

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm()

  const [isSubmitError, setIsSubmitError] = useState<boolean>(false)

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

  const isSubmittingComponent = (
    <div className='md:px-8 text-black text-xl md:text-2xl'>Sending...</div>
  )

  const isSubmitSuccessfulComponent = (
    <div className='md:px-8 text-center text-xl md:text-2xl text-juxt'>
      Thanks for leaving your details.
      <br />
      We'll be in touch very soon.
    </div>
  )

  const isSubmitErrorComponent = (
    <div className='md:px-8 text-xl md:text-2xl text-red-600'>
      Mmm... It seems there's a problem.
      <br />
      Please reach out to us at <strong>info@juxt.pro</strong>
    </div>
  )

  return (
    <>
      {isSubmitting ? (
        isSubmittingComponent
      ) : isSubmitError ? (
        isSubmitErrorComponent
      ) : isSubmitSuccessful ? (
        isSubmitSuccessfulComponent
      ) : (
        <form
          onSubmit={handleSubmit(submitContactForm)}
          id='form'
          className='flex flex-col gap-4'
        >
          <input
            type='hidden'
            {...register('subject')}
            value='New contact submission from the homepage at juxt.pro'
          />
          <input
            type='hidden'
            {...register('access_key')}
            value='c2bf653a-2baa-466d-bbcc-390272663918'
          />
          <div className='flex flex-col md:flex-row gap-4'>
            <input
              {...inputProps}
              {...register('name', { required: true })}
              placeholder='Name'
            />
          </div>
          <input
            {...inputProps}
            {...register('email', { required: true })}
            placeholder='Email'
            type='email'
          />
          <textarea
            rows={6}
            {...inputProps}
            {...register('description', { required: true })}
            placeholder='How can we help?'
          />
          <div className='text-xs'>
            By submitting your details you agree to JUXT’s{' '}
            <a href='/privacy-policy' target='_blank' className='underline'>
              Privacy Policy.
            </a>
          </div>

          {hasErrors && (
            <div className='text-red-500'>All fields are required</div>
          )}

          <button
            type='submit'
            className='bg-juxt px-4 py-3 text-white hover:text-zinc-800 font-bold hover:shadow-lg visited:text-white active:text-white text-md rounded-sm'
          >
            Send &gt;&gt;
          </button>
        </form>
      )}
    </>
  )
}

export default function ContactUsMini() {
  return (
    <div class='flex justify-center gap-10'>
      <div>
        <div>
          <div class='text-4xl md:text-5xl font-bold'>Contact Us</div>
        </div>
        <div className='flex flex-col-reverse lg:flex-row gap-10 p-12 lg:pb-0'>
          <div>
            <div class='text-2xl md:text-3xl font-light'>info@juxt.pro</div>
            <div class='text-2xl md:text-3xl font-light'>
              +44 (0) 333 93 98 309 <br /> +1 (332) 867 0718
            </div>
          </div>
          <img
            src='/images/site/airplane.png'
            class='hidden lg:block'
            style='width: 200px; height: 200px;'
            alt='contact us'
          />
        </div>
        <div class='text-4xl md:text-5xl font-bold'>Or Message Us</div>
        <div class='p-8'>
          <Form />
        </div>
      </div>
    </div>
  )
}

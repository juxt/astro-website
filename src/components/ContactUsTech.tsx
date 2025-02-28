import jdt from '@assets/people/jdt.jpg'
import { TickIcon } from '@components/Icons'
import { useState } from 'preact/hooks'
import { useForm } from 'react-hook-form'

const inputProps = {
  type: 'text',
  className:
    'flex-grow-1 bg-gray-50 border border-juxt text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2.5'
}

function TickBox({ text }: { text: string }) {
  return (
    <div className='flex gap-4 items-center'>
      <div className='bg-juxt w-8 h-8 shrink-0 border border-white hover:shadow-lg'>
        <TickIcon className={'fill-white'} />
      </div>
      <p className='text-lg'>{text}</p>
    </div>
  )
}

const techLogos = [
  'kotlin.svg',
  'iceberg.svg',
  'apache-arrow.svg',
  'kafka.svg',
  'kubernetes.svg',
  'trino.svg',
  'duckDB.svg',
  'parquet.svg',
  'clickhouse.svg'
]

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm()

  const [isSubmitError, setIsSubmitError] = useState<boolean>(false)

  function submitContactForm(data) {
    setIsSubmitError(false)
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
    <div className='md:px-8 text-black text-xl md:text-2xl'>
      Submitting your form...
    </div>
  )

  const isSubmitSuccessfulComponent = (
    <div className='md:px-8 text-center text-xl md:text-2xl text-juxt'>
      Thanks for your submission! We'll be in touch shortly.
    </div>
  )

  const isSubmitErrorComponent = (
    <div className='md:px-8 text-xl md:text-2xl text-red-600'>
      Mmm.. It seems there's a problem.. Anyways, you can directly reach out to
      Jeremy at <strong>jdt@juxt.pro </strong>
    </div>
  )

  return (
    <>
      <form
        onSubmit={handleSubmit(submitContactForm)}
        id='form'
        className={
          isSubmitting || isSubmitSuccessful ? 'hidden' : 'flex flex-col gap-4'
        }
      >
        <div className='text-black text-2xl md:text-3xl font-bold'>
          Book Your Roundtable Session
        </div>
        <input
          type='hidden'
          {...register('subject')}
          value='New Submission from Tech Roundtable with Jeremy Taylor'
        />
        <input
          type='hidden'
          {...register('access_key')}
          value='c2bf653a-2baa-466d-bbcc-390272663918'
        />
        <div className='flex flex-col md:flex-row gap-4'>
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
          placeholder='Work Email'
          type='email'
        />
        <div className='flex flex-col md:flex-row gap-4'>
          <input
            {...inputProps}
            {...register('jobTitle', { required: true })}
            placeholder='Job Title'
          />
          <input
            {...inputProps}
            {...register('companyName', { required: true })}
            placeholder='Company Name'
          />
        </div>
        <div className='flex flex-col md:flex-row gap-4'>
          <input
            {...inputProps}
            {...register('phone')}
            placeholder='Phone (Optional)'
          />
          <input
            {...inputProps}
            {...register('country', { required: true })}
            placeholder='Country'
          />
        </div>
        <div className='text-xs'>
          By submitting your details you agree to JUXT’s{' '}
          <a href='/privacy-policy' target='_blank' className='underline'>
            Privacy Policy.
          </a>
        </div>

        {hasErrors && (
          <div className='text-red-500'>
            All fields but 'Phone' are required
          </div>
        )}

        <button
          type='submit'
          className='bg-juxt px-4 py-3 text-white hover:text-zinc-800 font-bold hover:shadow-lg visited:text-white active:text-white text-md rounded-sm'
        >
          Submit
        </button>
        <div className='flex flex-row gap-6 text-xs items-center max-w-[350px]'>
          <div className='flex flex-col gap-2 leading-snug'>
            What happens after you submit your details? Usually within 48
            business hours, Jeremy will be in touch to talk about the event and
            secure a date.
          </div>
        </div>
      </form>
      {isSubmitting && isSubmittingComponent}
      {isSubmitSuccessful && !isSubmitError && isSubmitSuccessfulComponent}
      {isSubmitError && isSubmitErrorComponent}
    </>
  )
}

export default function ContactUs() {
  return (
    <div className='min-h-screen flex justify-center bg-zinc-800'>
      <div className='p-8 py-8 px-8 lg:py-14 lg:px-16 max-w-7xl'>
        <a href='/' className='block pb-8'>
          <img width={300} src='/images/logo.svg' alt='Juxt Logo' />
        </a>
        <div className='flex flex-col lg:justify-between lg:flex-row gap-3 pb-14'>
          <div className='flex flex-col lg:gap-6 lg:w-2/3 gap-8'>
            <div className='text-3xl md:text-4xl font-bold leading-snug text-left text-white uppercase'>
              Technology Roundtable{' '}
            </div>
            <div className='text-medium md:text-2xl text-white leading-snug uppercase'>
              Dedicated event with Jeremy Taylor, Head of Product, XTDB
            </div>
          </div>

          <div className='flex items-center lg:items-stretch flex-col gap-4 lg:pr-2'>
            <img src={jdt.src} alt='Jdt' width='150' />
            <div className='text-sm text-left font-light text-juxt'>
              Jeremy Taylor <br /> Head of Product, XTDB
            </div>
          </div>
        </div>
        <div className='flex flex-col-reverse lg:flex-row bg-zinc-800 gap-16'>
          <div className='flex flex-col gap-10 text-left lg:w-1/2'>
            <div className='text-lg text-white md-text-3xl font-light leading-snug'>
              Looking to explore new tech with your team? JUXT wants to take you
              on a tour through some of the latest open source software
              innovations that are relevant for you!
            </div>
            <div className='flex flex-col gap-10 text-left'>
              <div className='text-lg text-white md-text-3xl font-light leading-snug'>
                In as little as one hour, either virtually or at your offices,
                let Jeremy get you up-to-speed on new technologies that can and
                probably will impact your work in your near future.{' '}
              </div>
              <div className='flex flex-col gap-10 text-white'>
                <TickBox text='Learn about recent advances in data and cloud infrastructure' />
                <TickBox text='Hear examples from your industry on the impact of new technologies' />
                <TickBox text='Compare & contrast the state of the art in off-the-shelf software' />
              </div>
            </div>
          </div>
          <div className='flex flex-col lg:w-1/2 bg-white py-6 px-2 md:px-0'>
            <div className='flex flex-col items-center gap-8'>
              <Form />
            </div>
          </div>
        </div>
        <div className='text-xl text-center text-white leading-snug pt-16 pb-4'>
          A few of our favourite technologies:
        </div>
        <div className='py-2'>
          <div className='flex flex-wrap justify-center lg:w-1/2 mx-auto'>
            {techLogos.map((logo) => (
              <img
                src={`/images/tech-logos/${logo}`}
                alt={`Logo of ${logo.split('.')[0]}`}
                className='w-24 md:w-32 flex-shrink-0'
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

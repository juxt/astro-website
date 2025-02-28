import joe from '@assets/people/joe.jpg'
import morganRoss from '@assets/site/morgan-ross-onthemarket.jpeg'
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

const clientLogos = [
  'credit-suisse.svg',
  'citi.svg',
  'vodafone.svg',
  'on-the-market.svg',
  'mail-online.svg'
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
      Hmm.. It seems there's a problem.. Anyways, you can directly reach out to
      Joe at <strong>joe@juxt.pro </strong>
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
        <input
          type='hidden'
          {...register('subject')}
          value='New Submission from Better Call Joe'
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
            Privacy Policy
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
            What happens after you hit “send”? Joe will be in touch with you to
            secure a call within 48 hours.
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
        <div className='flex flex-col lg:justify-between lg:flex-row gap-8 pb-14'>
          <div className='flex flex-col lg:justify-between lg:gap-0 lg:w-2/3 gap-8'>
            <div className='text-3xl md:text-4xl font-bold leading-snug text-left text-white uppercase'>
              Get started{' '}
            </div>
            <div className='text-medium md:text-2xl text-white leading-snug'>
              Book a
              <span className='text-juxt'> 30-minute discovery call </span>
              with our Chief Delivery Officer, and discover how JUXT can help
              bring your vision to market, on time and on budget.
            </div>
          </div>

          <div className='flex items-center lg:items-stretch flex-col gap-4'>
            <img src={joe.src} alt='Joe' width='150' />
            <div className='text-sm text-left font-light text-juxt'>
              Joe Littlejohn <br /> JUXT Chief Delivery Officer
            </div>
          </div>
        </div>
        <div className='flex flex-col-reverse lg:flex-row bg-zinc-800 gap-16'>
          <div className='flex flex-col gap-10 text-left lg:w-1/2'>
            <div className='text-lg text-white md-text-3xl font-light leading-snug'>
              Our Chief Delivery Officer, Joe Littlejohn, has worked in software
              development and technical advisory roles for two decades, shipping
              systems at scale for companies ranging from global banks to
              early-stage startups.
            </div>
            <div className='text-lg text-white md-text-3xl font-light leading-snug'>
              A 30-minute conversation with Joe will allow you to benefit from
              his experience:
            </div>
            <div className='flex flex-col gap-10 text-white'>
              <TickBox text='Discuss challenges to your project, and learn about solutions that come from experience in the field' />
              <TickBox text='Review your key milestones, and find opportunities to de-risk' />
              <TickBox text='Learn about how JUXT uses technical and delivery expertise to ensure success' />
            </div>
          </div>
          <div className='flex flex-col lg:w-1/2 bg-white py-6 px-2 md:px-0'>
            <div className='flex flex-col items-center gap-8'>
              <div className='text-black text-2xl md:text-3xl font-bold'>
                Book time with Joe
              </div>
              <Form />
            </div>
          </div>
        </div>
        <div className='text-xl text-center text-white leading-snug py-16'>
          For over a decade, JUXT has been a trusted partner of the world’s
          biggest brands:
        </div>
        <div className='flex flex-col lg:flex-row py-6 gap-6'>
          <div className='flex flex-wrap justify-center lg:w-1/2'>
            {clientLogos.map((logo) => (
              <img
                src={`/images/client-logos/${logo}`}
                alt={`Client logo for ${logo.split('.')[0]}`}
                className='h-24 md:h-20'
              />
            ))}
          </div>
          <div className='flex flex-col md:flex-row gap-6 md:items-center p-6 bg-juxt bg-opacity-90 shadow-xl lg:w-1/2'>
            <img src={morganRoss.src} alt='testimonial' width='150' />
            <div className='font-extralight text-sm'>
              "The web applications exceeded our expectations on functionality
              and time to market. JUXT led the development team through this
              period of incredible achievements." <br />
              <br />
              Morgan Ross <br />
              Product & Technology Director <br />
              OnTheMarket
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

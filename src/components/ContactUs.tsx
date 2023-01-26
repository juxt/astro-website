import { useState } from 'preact/hooks'
import { TickIcon } from '../components/Icons'
import joe from '../assets/people/joe.jpg'
import europeanInvestment from '../assets/case-studies/european-investment-bank.jpg'

function Input({
  label,
  type = 'text',
  placeholder
}: {
  label: string
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label
        for='first_name'
        className='block mb-2 text-sm font-medium text-gray-900'
      >
        {label}
      </label>
      <input
        type={type}
        id='first_name'
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-1/2 py-3 px-2.5 '
        placeholder={placeholder}
        required
      />
    </div>
  )
}

function TickBox({ text }: { text: string }) {
  return (
    <div className='flex gap-4 items-center'>
      <div className='bg-juxt w-8 h-8 shrink-0 border border-white hover:shadow-lg'>
        <TickIcon className={'fill-white'} />
      </div>
      <p className='text-xl font-medium'>{text}</p>
    </div>
  )
}

export default function ContactUs() {
  const [state, setState] = useState()

  return (
    <>
      <div className='flex flex-col xl:flex-row text-left'>
        <div className='bg-zinc-100 p-8 w-1/2 py-20 px-16'>
          <a href='/' className='block pb-8'>
            <img width='100' src='/images/logo-on-white.svg' alt='Juxt Logo' />
          </a>
          <div className='text-2xl md:text-4xl font-bold leading-snug mb-6 text-center'>
            Better Call Joe
          </div>
          <div className='justify-center'>
            <div className='flex flex-col gap-6'>
              <Input label='First Name*' />
              <Input label='Last Name*' />
              <Input label='Work Email*' type='email' />
              <Input label='Job Title*' type='job title' />
              <Input label='Company Name*' type='company name' />
              <Input label='Phone' type='phone' />
              <Input label='Country*' type='country' />
              <div className='flex flex-col mt-3 text-xs italic items-center'>
                By submitting your details you agree to JUXT’s Privacy Policy
              </div>
            </div>
            <button className=' bg-gray-900 px-4 py-3 w-full text-white hover:text-juxt font-bold hover:shadow-lg visited:text-white active:text-white text-base text-md mt-8 rounded-sm'>
              Send this form to Joe
            </button>
          </div>
          <div className='flex flex-col gap-4 mt-8 text-sm leading-snug'>
            <div>
              What happens after you hit “send”? Usually within 48 hours, Joe
              will be in touch to secure 30 minutes with you.
            </div>
            <div>
              Don’t want to wait? Book your 30-minutes with Joe via his Calendly
              link here.
            </div>
            <div>Or you can always call us: (UK/ US #)</div>
          </div>
          <div className='flex flex-row gap-5 mt-8 items-center p-6 bg-zinc-200 bg-opacity-90 shadow-xl'>
            <img src={joe.src} alt='Joe' width='100' />
            <div className='text-lg font-light'>
              Joe Littlejohn, JUXT Head of Delivery
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 text-left w-1/2 bg-juxt py-20 px-16'>
          <div className='text-3xl md:text-3xl font-medium leading-snug mb-6 mt-8'>
            Secure your{' '}
            <span className='font-bold'> free 30-minute consultation </span>{' '}
            with a seasoned delivery executive, and discover how to bring your
            vision to market, on time and on budget:
          </div>
          <hr className='border-black' />
          <div className='text-lg md-text3xl font-light leading-snug mb6 mt-8'>
            Our Head of Delivery, Joe Littlejohn, has over a decade of senior
            software development and technical advisory roles under his belt,
            successfully shipping large-scale software projects for companies
            ranging from global banks to early-stage startups.
          </div>
          <div className='text-lg md-text3xl font-light leading-snug mb6 mt-4'>
            30-minute call with Joe will allow you to benefit from his vast
            experience:
          </div>
          <div className='flex flex-col gap-10 mt-6'>
            <TickBox text='Discover little-known challenges in the development process — and discuss potential suitable solutions' />
            <TickBox text='Formulate initial project requirements, timeline, and budgets ' />
            <TickBox text='Assess your overall fit with JUXT’s methodology and processes ' />
          </div>

          <div className='flex flex-row gap-5 mt-8 items-center p-6 bg-juxt bg-opacity-90 shadow-xl'>
            <img src={europeanInvestment.src} alt='bank' width='200' />
            <div className='text-lg font-extralight italic'>
              "The JUXT team are tremendously technically capable - delivering
              elegant solutions to complex problems" <br />
              <br />
              Managing Director, T1 Investment Bank
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

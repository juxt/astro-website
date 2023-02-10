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
        className='bg-gray-50 border border-juxt text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2.5'
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
      <p className='text-md md:text-xl font-medium'>{text}</p>
    </div>
  )
}

const clientLogos = [
  'credit-suisse.svg',
  'citi.svg',
  'vodafone.svg',
  'on-the-market.svg',
  'mail-online.svg',
  'bbc.svg'
]

export default function ContactUs() {
  const [state, setState] = useState()

  async function submitContactForm(e) {
    e.preventDefault()
    const form = document.getElementById('contact-form') as HTMLFormElement
    function extractValue(idx: number): string {
      return (form.elements[idx] as HTMLInputElement).value
    }
    const response = await fetch(
      '/.netlify/functions/send-contact-form-to-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: extractValue(0),
          last_name: extractValue(1),
          email: extractValue(2),
          job_title: extractValue(3),
          company_name: extractValue(4),
          phone: extractValue(5),
          country: extractValue(6)
        })
      }
    )
    const data = await response.json()
    console.log(data)
  }

  return (
    <>
      <div className='bg-zinc-800 p-8 py-8 px-8 lg:py-14 lg:px-16'>
        <a href='/' className='block pb-8'>
          <img width='100' src='/images/logo-on-dark.svg' alt='Juxt Logo' />
        </a>
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='flex flex-col lg:w-2/3 gap-4 mb-6'>
            <div className='text-4xl md:text-6xl font-bold leading-snug py-8 text-left text-white uppercase'>
              Better Call Joe
            </div>
            <div className='text-2xl md:text-3xl text-white leading-snug'>
              Secure your
              <span className='text-juxt'> free 30-minute </span>
              consultation with a seasoned delivery executive, and discover how
              to bring your vision to market, on time and on budget.
            </div>
          </div>

          <div className='flex items-center lg:items-stretch flex-col gap-4 mb-6'>
            <img src={joe.src} alt='Joe' width='250' />
            <div className='text-xl text-left font-light text-juxt'>
              Joe Littlejohn, <br /> JUXT Head of Delivery
            </div>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row bg-zinc-800 gap-16'>
          <div className='flex flex-col gap-12 justify-center text-left lg:w-1/2'>
            <div className='text-lg text-white md-text3xl font-light leading-snug'>
              Our Head of Delivery, Joe Littlejohn, has over a decade of senior
              software development and technical advisory roles under his belt,
              successfully shipping large-scale software projects for companies
              ranging from global banks to early-stage startups.
            </div>
            <div className='text-lg text-white md-text3xl font-light leading-snug'>
              30-minute call with Joe will allow you to benefit from his vast
              experience:
            </div>
            <div className='flex flex-col gap-10 text-white'>
              <TickBox text='Discover little-known challenges in the development process — and discuss potential suitable solutions' />
              <TickBox text='Formulate initial project requirements, timeline, and budgets ' />
              <TickBox text='Assess your overall fit with JUXT’s methodology and processes ' />
            </div>
          </div>
          <div className='flex flex-col lg:w-1/2 bg-white py-6 px-2 md:px-0'>
            <div className='flex flex-col items-center gap-8'>
              <div className='text-black text-2xl md:text-3xl font-bold'>
                Book your free consultation
              </div>
              <form
                onSubmit={submitContactForm}
                id='contact-form'
                className='flex flex-col gap-6'
              >
                <div className='flex flex-col md:flex-row gap-6'>
                  <Input label='First Name*' />
                  <Input label='Last Name*' />
                </div>
                <Input label='Work Email*' type='email' />
                <div className='flex flex-col md:flex-row gap-6'>
                  <Input label='Job Title*' type='job title' />
                  <Input label='Company Name*' type='company name' />
                </div>
                <div className='flex flex-col md:flex-row gap-6'>
                  <Input label='Phone' type='phone' />
                  <Input label='Country*' type='country' />
                </div>
                <div className='text-xs text-center'>
                  By submitting your details you agree to JUXT’s Privacy Policy
                </div>
                <button className='bg-juxt px-4 py-2.5 text-white hover:text-zinc-800 font-bold hover:shadow-lg visited:text-white active:text-white text-md rounded-sm'>
                  Send This Form to Joe
                </button>

                <div className='flex flex-row gap-6 text-xs items-center max-w-[350px]'>
                  <div className='flex flex-col gap-2 leading-snug'>
                    <div>What happens after you hit “send”?</div>
                    <div className='leading-snug '>
                      Usually within{' '}
                      <span className='text-juxt'> 48 hours, </span> Joe will be
                      in touch to secure 30 minutes with you.
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className='text-2xl text-center text-white leading-snug py-10'>
          For over a decade, JUXT has been a trusted partner of the world’s
          biggest brands:
        </div>
        <div className='flex flex-col-reverse lg:flex-row py-6 gap-6'>
          <div className='flex flex-wrap justify-center lg:w-1/2'>
            {clientLogos.map((logo) => (
              <img
                src={`/images/client-logos/${logo}`}
                alt=''
                className='h-24 md:h-20'
              />
            ))}
          </div>
          <div className='flex flex-col md:flex-row gap-6 md:items-center p-6 bg-juxt bg-opacity-90 shadow-xl lg:w-1/2'>
            <img src={europeanInvestment.src} alt='bank' width='200' />
            <div className='font-extralight'>
              "The JUXT team are tremendously technically capable - delivering
              elegant solutions to complex problems" <br />
              <br />
              <span className='uppercase'>
                Managing Director, T1 Investment Bank
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

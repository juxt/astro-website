import { useState } from 'preact/hooks'
import { TickIcon } from '../components/Icons'
import joe from '../assets/people/joe.jpg'

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
        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-3 px-2.5'
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
      <div className='flex flex-col xl:flex-row gap-20 text-left'>
        <div className='bg-zinc-100 p-8'>
          <div className='text-2xl md:text-4xl font-bold leading-snug mb-6'>
            Book a Discovery Call with Joe, our Head of Delivery
          </div>
          <div className='flex flex-col gap-6'>
            <Input label='First Name' />
            <Input label='Last Name' />
            <Input label='Email*' type='email' />
            <Input label='Company Name' type='company name' />
          </div>
          <button className=' bg-juxt px-4 py-3 w-full text-white hover:shadow-lg visited:text-white active:text-white font-medium text-md mt-4 rounded-sm'>
            Submit
          </button>
        </div>

        <div className='flex flex-col gap-4 text-left'>
          <div className='text-2xl md:text-4xl font-bold leading-snug mb-6 mt-8'>
            Give us 30 minutes of your time and we'll:
          </div>
          <hr className='border-black' />
          <div className='flex flex-col gap-10 mt-6'>
            <TickBox text='Answer all your questions and clear your doubts' />
            <TickBox text='Identify a clear roadmap and define the next steps' />
            <TickBox text='Schedule our next meeting and get ready to start!' />
          </div>
          <div className='flex flex-row gap-5 mt-8 items-center p-6 bg-juxt bg-opacity-90 shadow-xl'>
            <img src={joe.src} alt='Joe' width='150' />
            <div className='text-lg font-light'>
              "I'll listen to your needs and help you discover how JUXT can help
              you overcome your challenges and meet your expectations!" <br />
              <br />
              Joe Littlejohn, JUXT Head of Delivery
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import { useState } from 'preact/hooks'
import { TickIcon } from '../components/Icons'

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

export default function ContactUs() {
  const [state, setState] = useState()

  return (
    <>
      <div className='flex flex-col gap-4 text-left'>
        <div className='text-2xl md:text-6xl font-bold leading-snug mb-6'>
          Book a Discovery Call with Joe, <br /> our Head of Delivery
        </div>
        <div className='flex flex-col gap-6'>
          <Input label='First Name' />
          <Input label='Last Name' />
          <Input label='Email*' type='email' />
          <Input label='Company Name' type='company name' />
        </div>
        <button className=' bg-juxt px-4 py-3 w-full hover:bg-juxt transition-colors cursor-pointer text-white hover:shadow-lg visited:text-white active:text-white font-medium text-md mt-4 rounded-sm'>
          Submit
        </button>
        <div className='text-2xl md:text-6xl font-bold leading-snug mb-6 mt-10'>
          Give us 30 minutes of your time and we'll:
        </div>
        <div class='flex gap-4 items-center'>
          <div class='bg-gray-800 w-6 h-6 shrink-0 border border-juxt'>
            <TickIcon className={'fill-white'} />
          </div>
          <p>Answer all your questions and clear your doubts</p>
        </div>
        <div class='flex gap-4 items-center'>
          <div class='bg-gray-800 w-6 h-6 shrink-0 border border-juxt'>
            <TickIcon className={'fill-white'} />
          </div>
          <p>Define a clear roadmap and next steps</p>
        </div>
        <div class='flex gap-4 items-center'>
          <div class='bg-gray-800 w-6 h-6 shrink-0 border border-juxt'>
            <TickIcon className={'fill-white'} />
          </div>
          <p>Schedule our next meeting and get ready to start!</p>
        </div>
      </div>
    </>
  )
}

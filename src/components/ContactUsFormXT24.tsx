import { useState } from 'preact/hooks'
import { useForm } from 'react-hook-form'

const inputProps = {
    type: 'text',
    className:
        'flex-grow-1 bg-gray-50 border border-juxt text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-2.5'
}

export default function ContactUsFormXT24(props) {
    const {
        id = "form",
        subject = "New Contact Us Submission",
    } = props;

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
            Mmm.. It seems there's a problem.. Anyways, you can reach us directly at <strong>info@juxt.pro</strong>
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
                    id={id}
                    className='flex flex-col gap-4'
                >

                    <input
                        type='hidden'
                        {...register('subject')}
                        value={subject}
                    />
                    <input
                        type='hidden'
                        {...register('access_key')}
                        value='c2bf653a-2baa-466d-bbcc-390272663918'
                    />

                    <div class="flex flex-row gap-4">
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

                    <div class="flex flex-row gap-4">
                        <input
                            {...inputProps}
                            {...register('jobTitle', { required: true })}
                            placeholder='Job Title'
                        />
                        <input
                            {...inputProps}
                            {...register('company', { required: true })}
                            placeholder='Company'
                        />
                    </div>

                    <div class="flex flex-row gap-4">
                        <input
                            {...inputProps}
                            {...register('phone')}
                            placeholder='Phone (optional)'
                        />
                        <input
                            {...inputProps}
                            {...register('country', { required: true })}
                            placeholder='Country'
                        />
                    </div>

                    <div className='text-xs font-light'>
                        By submitting your details you agree to JUXT’s{' '}
                        <a href='/privacy-policy' target='_blank' className='underline'>
                            Privacy Policy
                        </a>
                    </div>

                    {hasErrors && (
                        <div className='text-red-500'>
                            All fields are required
                        </div>
                    )}

                    <button
                        type='submit'
                        className='bg-juxt px-4 py-3 text-white hover:text-zinc-800 font-bold hover:shadow-lg visited:text-white active:text-white text-md rounded-sm'
                    >
                        Submit Form
                    </button>
                </form>
            )}
        </>
    )
}

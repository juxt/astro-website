import 'preact/jsx-runtime'
import classNames from 'classnames'
import { useEffect, useState } from 'preact/hooks'
import logo from '/images/logo.svg'
import { useOutsideClick } from '../utils'
import DarkModeSwitch from './DarkModeSwitch'

type NavLinkProp = {
  href: string
  label: string
  target?: string
  active?: boolean
}

function NavLink({ label, href, target, active }: NavLinkProp) {
  const targetProp = target ? { target } : {}

  return (
    <a
      {...targetProp}
      className={classNames(
        'hover:text-juxt transition-colors first-of-type:pt-4 md:first-of-type:pt-0',
        active ? 'text-juxt' : 'text-white'
      )}
      href={href}
    >
      {label}
    </a>
  )
}

export default function Navbar({ navLinks, enableDarkMode, navbarNoBg }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const ref = useOutsideClick(() => setIsMenuOpen(false))
  const linkClasses = 'items-center gap-8 uppercase tracking-widest text-xs'

  useEffect(() => {
    function updateNavBg() {
      if (window.scrollY > 0) {
        ref.current.classList.add('bg-black')
      } else {
        ref.current.classList.remove('bg-black')
      }
    }
    navbarNoBg && updateNavBg()
    navbarNoBg && window.addEventListener('scroll', updateNavBg)
    return () => {
      navbarNoBg && window.removeEventListener('scroll', updateNavBg)
    }
  }, [])

  return (
    <nav
      className={classNames('w-full fixed transition-all z-50 md:py-4 h-14', {
        'bg-black': !navbarNoBg
      })}
      ref={ref}
    >
      <div className='container mx-auto px-4 sm:px-12 2xl:px-0 max-w-7xl flex flex-wrap items-center justify-between h-full'>
        <a href='/' class='flex items-center w-20 z-10'>
          <img src={logo} alt='Juxt Logo' />
        </a>
        <button
          data-collapse-toggle='navbar-default'
          type='button'
          className='z-10 inline-flex items-center p-2 ml-3 text-sm text-white rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600'
          aria-controls='navbar-default'
          aria-expanded='false'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className='sr-only'>Open main menu</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            class='w-6 h-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='white'
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='M4 6h16M4 12h16m-7 6h7'
            ></path>
          </svg>
        </button>
        {/* desktop */}
        <div className={classNames('hidden md:flex', linkClasses)}>
          {navLinks.map((page) => (
            <NavLink
              href={page.href}
              label={page.label}
              target={page.target}
              active={page.active}
            />
          ))}
          {enableDarkMode && <DarkModeSwitch />}
        </div>

        {/* mobile */}
        <div
          className={classNames(
            'absolute left-0 flex bg-black w-full flex-col md:hidden overflow-hidden transition-all',
            linkClasses,
            {
              'top-0': navbarNoBg,
              'top-14': !navbarNoBg,
              'pt-14': navbarNoBg && isMenuOpen,
              'max-h-0': !isMenuOpen,
              'max-h-screen pb-4': isMenuOpen
            }
          )}
        >
          {navLinks.map((page) => (
            <NavLink
              href={page.href}
              label={page.label}
              target={page.target}
              active={page.active}
            />
          ))}
          {enableDarkMode && <DarkModeSwitch />}
        </div>
      </div>
    </nav>
  )
}

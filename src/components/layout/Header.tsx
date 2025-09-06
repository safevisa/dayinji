import { useState, Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
  ChevronDownIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'

const navigation = {
  categories: [
    {
      id: 'printers',
      name: 'products.3d_printers',
      featured: [
        { name: 'Phrozen 普羅森', href: '/products/phrozen' },
        { name: 'Formlabs 風雷', href: '/products/formlabs' },
        { name: 'Bambu Lab 拓竹', href: '/products/bambu-lab' },
      ],
    },
    {
      id: 'materials',
      name: 'products.printing_materials',
      featured: [
        { name: 'Phrozen 樹脂', href: '/products/phrozen-resin' },
        { name: 'Formlabs 材料', href: '/products/formlabs-materials' },
        { name: '線材耗材', href: '/products/filaments' },
      ],
    },
    {
      id: 'equipment',
      name: 'products.post_processing',
      featured: [
        { name: '固化/清洗系統', href: '/products/curing-washing' },
        { name: '空氣清淨系統', href: '/products/air-filtration' },
        { name: '電動打磨系統', href: '/products/sanding' },
      ],
    },
  ],
}

export default function Header() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const { getItemCount } = useCartStore()

  const cartItemCount = getItemCount()

  const changeLanguage = (locale: string) => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, { locale })
  }

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {navigation.categories.map((category) => (
                    <div key={category.name} className="flow-root">
                      <p className="-m-2 block p-2 font-medium text-gray-900">
                        {t(category.name)}
                      </p>
                      <div className="mt-2 space-y-2">
                        {category.featured.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block p-2 text-gray-500 hover:text-gray-800"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  {isAuthenticated ? (
                    <>
                      <div className="flow-root">
                        <Link href="/account" className="-m-2 block p-2 font-medium text-gray-900">
                          {t('navigation.account')}
                        </Link>
                      </div>
                      <div className="flow-root">
                        <button
                          onClick={logout}
                          className="-m-2 block p-2 font-medium text-gray-900"
                        >
                          {t('navigation.logout')}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flow-root">
                        <Link href="/auth/login" className="-m-2 block p-2 font-medium text-gray-900">
                          {t('navigation.login')}
                        </Link>
                      </div>
                      <div className="flow-root">
                        <Link href="/auth/register" className="-m-2 block p-2 font-medium text-gray-900">
                          {t('navigation.register')}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-primary-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          {t('company.name')}
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link href="/" className="flex items-center">
                  <span className="text-xl font-bold text-primary-600">BIZOE</span>
                </Link>
              </div>

              {/* Flyout menus */}
              <Popover.Group className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      {({ open }) => (
                        <>
                          <div className="relative flex">
                            <Popover.Button
                              className={`
                                ${
                                  open
                                    ? 'border-primary-600 text-primary-600'
                                    : 'border-transparent text-gray-700 hover:text-gray-800'
                                }
                                relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out
                              `}
                            >
                              {t(category.name)}
                              <ChevronDownIcon className="ml-1 h-4 w-4" />
                            </Popover.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-500">
                              <div className="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />

                              <div className="relative bg-white">
                                <div className="mx-auto max-w-7xl px-8">
                                  <div className="grid grid-cols-1 gap-x-8 gap-y-10 py-16">
                                    <div className="grid grid-cols-3 gap-x-8 gap-y-10">
                                      {category.featured.map((item) => (
                                        <div key={item.name} className="group relative">
                                          <Link
                                            href={item.href}
                                            className="block font-medium text-gray-900 group-hover:text-primary-600"
                                          >
                                            {item.name}
                                          </Link>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                  ))}
                </div>
              </Popover.Group>

              <div className="ml-auto flex items-center">
                {/* Language switcher */}
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <Popover className="relative">
                    <Popover.Button className="group inline-flex items-center rounded-md bg-white text-base font-medium text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                      <GlobeAltIcon className="h-5 w-5 mr-1" />
                      {router.locale === 'zh-TW' ? '繁中' : 'EN'}
                      <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute right-0 z-10 mt-3 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <button
                            onClick={() => changeLanguage('zh-TW')}
                            className={`${
                              router.locale === 'zh-TW' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                          >
                            繁體中文
                          </button>
                          <button
                            onClick={() => changeLanguage('en')}
                            className={`${
                              router.locale === 'en' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                          >
                            English
                          </button>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </Popover>
                </div>

                {/* Account */}
                <div className="hidden lg:ml-8 lg:flex">
                  {isAuthenticated ? (
                    <Popover className="relative">
                      <Popover.Button className="group -m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
                        <UserIcon className="h-6 w-6" />
                        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                          {user?.firstName}
                        </span>
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute right-0 z-10 mt-3 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="py-1">
                            <Link
                              href="/account"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {t('navigation.account')}
                            </Link>
                            <Link
                              href="/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {t('navigation.orders')}
                            </Link>
                            <button
                              onClick={logout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {t('navigation.logout')}
                            </button>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Link
                        href="/auth/login"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        {t('navigation.login')}
                      </Link>
                      <Link
                        href="/auth/register"
                        className="text-sm font-medium text-gray-700 hover:text-gray-800"
                      >
                        {t('navigation.register')}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Link href="/cart" className="group -m-2 flex items-center p-2">
                    <ShoppingCartIcon className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {cartItemCount}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}

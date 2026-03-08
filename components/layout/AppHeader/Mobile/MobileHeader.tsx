import React from 'react'

import SearchIcon from '@mui/icons-material/Search'
import { NoSsr } from '@mui/material'
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

import { HeaderAction } from '@/components/common'
import { HamburgerIcon, StoreFinderIcon, CartIcon } from '@/components/layout'
import { useHeaderContext } from '@/context'
import { b2bUserActions, hasAnyPermission } from '@/lib/helpers'
import FC_Logos from '@/public/icons/clothLogo.jpg'



const MobileHeader = ({ children }: { children?: React.ReactNode }) => {
  const { toggleMobileSearchPortal } = useHeaderContext()
  const { t } = useTranslation('common')

  const isCSR = getCookie('isCSR')
  return (
    <>
      <NoSsr>
        <div className="relative bg-gradient-to-r from-[#6dd5ed] via-[#2ea195] to-[#2193b0] backdrop-blur-md shadow-xl px-4 h-[65px] flex items-center justify-between" data-testid="mobile-header">
          {/* Pulse Effect */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white,transparent_40%)] animate-pulse pointer-events-none"></div>

          <div className="relative flex items-center gap-4 w-full justify-between">
            <div className="flex items-center gap-3">
              <div className="cursor-pointer hover:text-white transition-all duration-300 hover:scale-110 active:scale-95">
                <HamburgerIcon
                  size="medium"
                  mobileIconColor="inherit"
                  isElementVisible={true}
                  data-testid="mobile-header-hamburger-icon"
                />
              </div>

              <div className="cursor-pointer hover:text-white transition-all duration-300 hover:scale-110 active:scale-95">
                <HeaderAction
                  title={t('search')}
                  icon={SearchIcon}
                  iconFontSize={'medium'}
                  mobileIconColor="inherit"
                  onClick={() => toggleMobileSearchPortal()}
                  data-testid="mobile-header-search-icon"
                />
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link href="/" passHref className="block transition-all duration-300 transform hover:scale-110 active:scale-95">
                <Image src={FC_Logos} alt="logo" height={35} width={60} className="object-contain drop-shadow-md" />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {!isCSR && (
                <div className="cursor-pointer hover:text-white transition-all duration-300 hover:scale-110 active:scale-95">
                  <StoreFinderIcon
                    size="medium"
                    mobileIconColor="inherit"
                    data-testid="mobile-header-store-icon"
                  />
                </div>
              )}
              {hasAnyPermission(b2bUserActions.MANAGE_CART) ? (
                <div className="relative cursor-pointer hover:text-white transition-all duration-300 hover:scale-110 active:scale-95">
                  <CartIcon size="medium" mobileIconColor="inherit" data-testid="mobile-header-cart-icon" />
                  {/* cart glow */}
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-ping ring-2 ring-white/20"></span>
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white/20"></span>
                </div>
              ) : (
                <div className="w-8"></div>
              )}
            </div>
          </div>
        </div>
        {children}
      </NoSsr>
    </>
  )
}

export default MobileHeader

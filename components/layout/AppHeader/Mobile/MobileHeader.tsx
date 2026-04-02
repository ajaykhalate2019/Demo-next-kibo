import React from 'react'

import SearchIcon from '@mui/icons-material/Search'
import { NoSsr } from '@mui/material'
import { getCookie } from 'cookies-next'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

import { HeaderAction } from '@/components/common'
import { HamburgerIcon, StoreFinderIcon } from '@/components/layout'
import { useHeaderContext } from '@/context'
import { b2bUserActions, hasAnyPermission } from '@/lib/helpers'
import FC_Logos from '@/public/icons/clothLogo.jpg'
import { Heart, ShoppingBag } from 'lucide-react'
import { cartGetters } from '@/lib/getters'
import { useGetCart } from '@/hooks'
import { useWishlist } from '@/hooks/custom/useWishlist/useWishlist'



const MobileHeader = ({ children }: { children?: React.ReactNode }) => {
  const { toggleMobileSearchPortal } = useHeaderContext()
  const { t } = useTranslation('common')

  const { data: cart } = useGetCart()
  const totalItems = cartGetters.getCartItemCount(cart)

  const { wishlists } = useWishlist()
  const totalWishlistItems = wishlists?.items?.length || 0

  const isCSR = getCookie('isCSR')
  return (
    <>
      <NoSsr>
        <div className="relative bg-neutral-900 backdrop-blur-md shadow-xl px-4 h-[65px] flex items-center justify-between text-white" data-testid="mobile-header">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,#525252,transparent_40%)] pointer-events-none"></div>

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

            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/wishlist" className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white group">
                <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-white animate-in zoom-in">
                    {totalWishlistItems}
                  </span>
                )}
              </Link>

              {hasAnyPermission(b2bUserActions.MANAGE_CART) ? (
                <Link href="/cart" className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white group">
                  <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-white animate-in zoom-in">
                      {totalItems}
                    </span>
                  )}
                </Link>
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

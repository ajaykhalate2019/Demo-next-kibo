import React, { useState } from 'react'

import { KeyboardArrowDownOutlined, FavoriteBorderOutlined } from '@mui/icons-material'
import {
  Collapse,
  Box,
  AppBar,
  Backdrop,
  Container,
  useMediaQuery,
  useTheme,
  styled,
  Theme,
  NoSsr,
} from '@mui/material'
import { getCookie } from 'cookies-next'
import getConfig from 'next/config'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { kiboHeaderStyles, topHeaderStyles } from './KiboHeader.styles'
import { AccountHierarchyFormDialog } from '@/components/dialogs'
import {
  AccountIcon,
  CartIcon,
  CheckoutHeader,
  HamburgerMenu,
  LoginDialog,
  MegaMenu,
  MobileHeader,
  SearchSuggestions,
  SwitchAccountMenu,
} from '@/components/layout'
import { useAuthContext, useHeaderContext, useModalContext } from '@/context'
import { useCreateCustomerB2bAccountMutation, useGetCategoryTree, useGetCart } from '@/hooks'
import {
  b2bUserActions,
  buildCreateCustomerB2bAccountParams,
  hasAnyPermission,
} from '@/lib/helpers'
import type { CreateCustomerB2bAccountParams, NavigationLink } from '@/lib/types'
import FC_Logos from '@/public/icons/clothLogo.jpg'
import type { Maybe, PrCategory } from '@/lib/gql/types'
import { useWishlist } from '@/hooks/custom/useWishlist/useWishlist'
import { cartGetters } from '@/lib/getters'
import { Heart, ShoppingBag } from 'lucide-react'

interface KiboHeaderProps {
  navLinks: NavigationLink[]
  categoriesTree: Maybe<PrCategory>[]
  isSticky?: boolean
}

interface HeaderActionAreaProps {
  isHeaderSmall: boolean
  isElementVisible?: boolean
  onAccountIconClick: () => void
  onAccountRequestClick: () => void
}

const isCSR = getCookie('isCSR')
const customerName = getCookie('customer')?.toString() || ''

const HeaderActionArea = (props: HeaderActionAreaProps) => {
  const { isHeaderSmall, onAccountIconClick, onAccountRequestClick } = props
  const { headerState, toggleSearchBar } = useHeaderContext()
  const { isMobileSearchPortalVisible, isSearchBarVisible } = headerState
  const { t } = useTranslation('common')

  const [anchorElAccountOptions, setAnchorElAccountOptions] = React.useState<null | HTMLElement>(
    null
  )
  const openAccountOptions = Boolean(anchorElAccountOptions)

  const { selectedAccountId, accountsByUser, user } = useAuthContext()

  const { data: cart } = useGetCart()
  const totalItems = cartGetters.getCartItemCount(cart)

  const { wishlists } = useWishlist()
  const totalWishlistItems = wishlists?.items?.length || 0

  const handleAccountOptionsClick = (event: any) => {
    setAnchorElAccountOptions(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorElAccountOptions(null)
  }

  const showSearchBarInLargeHeader = !isHeaderSmall || isSearchBarVisible

  return (
    <div className="relative bg-neutral-900 backdrop-blur-md py-2 sm:py-3 md:py-4 shadow-xl" data-testid="header-action-area">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,#525252,transparent_40%)]"></div>
      <Container maxWidth="xl">
        <div className="relative flex items-center justify-between gap-3 sm:gap-4 md:gap-8">
          {/* Logo  */}
          <div className="flex-shrink-0 group">
            <Link href="/" className="flex items-center transition-all duration-300 transform hover:scale-110">
              <Image src={FC_Logos} alt="kibo-logo" height={50} width={100} className="object-contain drop-shadow-md" />
            </Link>
          </div>

          {/* Search Bar */}
          {showSearchBarInLargeHeader && (
            <div className="hidden md:flex flex-grow max-w-2xl px-2 lg:px-4 transition-all duration-500" data-testid="Search-container">
              <div className="w-full bg-white/10 backdrop-blur-lg rounded-full border border-white/20 transition-all duration-300 
                               hover:bg-white/20 focus-within:bg-white/30 shadow-md hover:shadow-xl">
                <SearchSuggestions
                  isViewSearchPortal={isMobileSearchPortalVisible}
                  onEnterSearch={() => toggleSearchBar(false)}
                />
              </div>
            </div>
          )}

          {/* Icons */}
          <div className="flex flex-shrink-0 items-center gap-3 md:gap-5 text-white">
            <NoSsr>
              <div className="flex items-center gap-3 md:gap-5">
                {/* Account */}
                <div className="inline-flex items-center hover:text-white transition-all cursor-pointer duration-300 hover:scale-110 hover:drop-shadow-lg">
                  <AccountIcon
                    size={isHeaderSmall ? 'small' : 'medium'}
                    onAccountIconClick={onAccountIconClick}
                    data-testid="Account-Icon"
                    isElementVisible={true}
                    isCSR={Boolean(isCSR)}
                    customerName={customerName}
                    companyOrOrganization={user?.companyOrOrganization as string}
                  />
                  {selectedAccountId && accountsByUser && accountsByUser?.length > 1 && (
                    <KeyboardArrowDownOutlined
                      onClick={handleAccountOptionsClick}
                      aria-controls={openAccountOptions ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openAccountOptions ? 'true' : undefined}
                      className="ml-1 text-white transition-transform duration-300 hover:rotate-180"
                    />
                  )}
                  <SwitchAccountMenu
                    open={openAccountOptions}
                    handleClose={handleClose}
                    anchorEl={anchorElAccountOptions}
                  />
                </div>

                {/* Wishlist */}
                <Link href="/wishlist" className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white group">
                  <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {totalWishlistItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-white animate-in zoom-in">
                      {totalWishlistItems}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                {hasAnyPermission(b2bUserActions.MANAGE_CART) && (
                  <Link href="/cart" className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white group">
                    <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-white animate-in zoom-in">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            </NoSsr>
          </div>
        </div>
      </Container>
    </div>
  )
}

const StyledLink = styled(Link)(({ theme }: { theme: Theme }) => ({
  color: theme?.palette.common.black,
  fontSize: theme?.typography.body2.fontSize,
  textDecoration: 'none',
  transition: 'all 0.3s ease-in-out',
  opacity: 0.9,
  '&:hover': {
    opacity: 1,
    textShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
    transform: 'translateY(-1px)',
  },
}))

const TopHeader = ({ navLinks }: { navLinks: NavigationLink[] }) => {
  const { t } = useTranslation('common')

  return (
    <Box sx={{ ...topHeaderStyles.wrapper }} data-testid="top-bar">
      <Container maxWidth="xl" sx={{ ...topHeaderStyles.container }}>
        <NoSsr>
          <Box display="flex" justifyContent="flex-end" alignItems="center" gap={5}>
            {!isCSR && (
              <>
                {navLinks?.map((nav, index) => (
                  <Box key={index}>
                    <StyledLink href={nav.link} passHref>
                      {t(`${nav.text}`)}
                    </StyledLink>
                  </Box>
                ))}
              </>
            )}
          </Box>
        </NoSsr>
      </Container>
    </Box>
  )
}

const KiboHeader = (props: KiboHeaderProps) => {
  const { navLinks, categoriesTree: initialCategoryTree, isSticky = true } = props
  const { data: categoriesTree } = useGetCategoryTree(initialCategoryTree)
  const { headerState, toggleMobileSearchPortal, toggleHamburgerMenu } = useHeaderContext()
  const { isAuthenticated, user } = useAuthContext()
  const { showModal, closeModal } = useModalContext()
  const { t } = useTranslation('common')
  const router = useRouter()
  const theme = useTheme()
  const mdScreen = useMediaQuery(theme.breakpoints.up('md'))

  const { createCustomerB2bAccount } = useCreateCustomerB2bAccountMutation()

  const [isBackdropOpen, setIsBackdropOpen] = useState<boolean>(false)

  const { isHamburgerMenuVisible, isMobileSearchPortalVisible } = headerState
  const isCheckoutPage = router.pathname.includes('checkout')
  const { publicRuntimeConfig } = getConfig()
  const isMultiShipEnabled = publicRuntimeConfig.isMultiShipEnabled

  const handleAccountIconClick = () => {
    isHamburgerMenuVisible && toggleHamburgerMenu()
    if (!isAuthenticated) {
      showModal({ Component: LoginDialog })
    } else {
      router.push('/my-account')
    }
  }

  const handleAccountRequest = async (formValues: CreateCustomerB2bAccountParams) => {
    const variables = buildCreateCustomerB2bAccountParams(formValues)
    await createCustomerB2bAccount.mutateAsync(variables)
    closeModal()
  }

  const handleB2BAccountRequestClick = () => {
    showModal({
      Component: AccountHierarchyFormDialog,
      props: {
        isAddingAccountToChild: false,
        isRequestAccount: true,
        primaryButtonText: t('request-account'),
        formTitle: t('b2b-account-request'),
        onSave: (formValues: CreateCustomerB2bAccountParams) => handleAccountRequest(formValues),
        onClose: () => closeModal(),
      },
    })
  }

  const getSection = (): React.ReactNode => {
    if (isCheckoutPage) return <CheckoutHeader isMultiShipEnabled={isMultiShipEnabled} />

    if (!mdScreen)
      return (
        <MobileHeader>
          <Collapse in={isMobileSearchPortalVisible}>
            <Box
              height={'55px'}
              minHeight={'55px'}
              sx={{ display: { xs: 'block', md: 'none' }, px: 1, mt: 1 }}
            >
              <SearchSuggestions
                isViewSearchPortal={isMobileSearchPortalVisible}
                onEnterSearch={() => toggleMobileSearchPortal()}
              />
            </Box>
          </Collapse>
          <HamburgerMenu
            categoryTree={categoriesTree || []}
            isDrawerOpen={isHamburgerMenuVisible}
            setIsDrawerOpen={() => toggleHamburgerMenu()}
            navLinks={navLinks}
            onAccountIconClick={handleAccountIconClick}
            isCSR={Boolean(isCSR)}
            customerName={customerName}
            companyOrOrganization={user?.companyOrOrganization as string}
          />
        </MobileHeader>
      )

    return (
      <HeaderActionArea
        isHeaderSmall={false}
        isElementVisible={true}
        onAccountIconClick={handleAccountIconClick}
        onAccountRequestClick={handleB2BAccountRequestClick}
      />
    )
  }

  return (
    <>
      <AppBar
        position={isSticky ? 'sticky' : 'static'}
        sx={kiboHeaderStyles.appBarStyles}
        data-testid="header-container"
      >
        <Backdrop open={isBackdropOpen} data-testid="backdrop" />

        {/* <TopHeader navLinks={navLinks} /> */}

        <Box component={'section'} sx={{ ...kiboHeaderStyles.topBarStyles }}>
          {getSection()}
        </Box>

        <Box
          component={'section'}
          sx={{
            ...kiboHeaderStyles.megaMenuStyles,
          }}
          data-testid="mega-menu-container"
        >
          {!isCheckoutPage && (
            <MegaMenu categoryTree={categoriesTree} onBackdropToggle={setIsBackdropOpen} />
          )}
        </Box>
      </AppBar>
    </>
  )
}

export default KiboHeader

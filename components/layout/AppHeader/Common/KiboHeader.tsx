import React, { useState } from 'react'

import { KeyboardArrowDownOutlined } from '@mui/icons-material'
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
  AccountRequestIcon,
  CartIcon,
  CheckoutHeader,
  HamburgerMenu,
  LoginDialog,
  MegaMenu,
  MobileHeader,
  SearchSuggestions,
  StoreFinderIcon,
  SwitchAccountMenu,
} from '@/components/layout'
import { useAuthContext, useHeaderContext, useModalContext } from '@/context'
import { useCreateCustomerB2bAccountMutation, useGetCategoryTree } from '@/hooks'
import {
  b2bUserActions,
  buildCreateCustomerB2bAccountParams,
  hasAnyPermission,
} from '@/lib/helpers'
import type { CreateCustomerB2bAccountParams, NavigationLink } from '@/lib/types'
import FC_Logos from '@/public/icons/clothLogo.jpg'
import type { Maybe, PrCategory } from '@/lib/gql/types'

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

  const handleAccountOptionsClick = (event: any) => {
    setAnchorElAccountOptions(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorElAccountOptions(null)
  }

  const showSearchBarInLargeHeader = !isHeaderSmall || isSearchBarVisible

  return (
    <div className="bg-gradient-to-r from-[#6dd5ed] to-[#2193b0] py-2 md:py-3 shadow-lg" data-testid="header-action-area">
      <Container maxWidth="xl">
        <div className="flex flex-row items-center justify-between gap-4 md:gap-8">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="transition-transform hover:scale-105 duration-300">
              <Image src={FC_Logos} alt="kibo-logo" height={50} width={100} className="object-contain" />
            </Link>
          </div>

          {/* Search Bar Section - Centered */}
          {showSearchBarInLargeHeader && (
            <div className="hidden md:flex flex-grow max-w-2xl px-4 animate-fadeIn" data-testid="Search-container">
              <div className="w-full bg-white/20 backdrop-blur-md rounded-full border border-white/30 transition-all hover:bg-white/30">
                <SearchSuggestions
                  isViewSearchPortal={isMobileSearchPortalVisible}
                  onEnterSearch={() => toggleSearchBar(false)}
                />
              </div>
            </div>
          )}

          {/* Icons/Actions Section */}
          <div className="flex flex-shrink-0 items-center gap-3 md:gap-5 text-gray-900">
            <NoSsr>
              <div className="flex items-center gap-3 md:gap-5">
                {!isCSR && (
                  <>
                    <div className="hover:text-white transition-colors cursor-pointer">
                      <StoreFinderIcon
                        size={isHeaderSmall ? 'small' : 'medium'}
                        data-testid="Store-FinderIcon"
                      />
                    </div>
                    <div className="hover:text-white transition-colors cursor-pointer">
                      <AccountRequestIcon
                        onClick={onAccountRequestClick}
                        isElementVisible={false}
                        iconProps={{ fontSize: isHeaderSmall ? 'small' : 'medium' }}
                        buttonText={t('b2b-account-request')}
                        data-testid="Account-Request-Icon"
                      />
                    </div>
                  </>
                )}
                <div className="inline-flex items-center hover:text-white transition-colors cursor-pointer">
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
                      className="ml-1 text-gray-900 group-hover:text-white"
                    />
                  )}
                  <SwitchAccountMenu
                    open={openAccountOptions}
                    handleClose={handleClose}
                    anchorEl={anchorElAccountOptions}
                  />
                </div>

                {hasAnyPermission(b2bUserActions.MANAGE_CART) && (
                  <div className="hover:text-white transition-colors cursor-pointer relative">
                    <CartIcon size={isHeaderSmall ? 'small' : 'medium'} />
                  </div>
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
  fontSize: theme?.typography.body1.fontSize,
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

        <TopHeader navLinks={navLinks} />

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

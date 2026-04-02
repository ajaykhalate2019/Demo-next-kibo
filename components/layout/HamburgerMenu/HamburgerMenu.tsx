import React from 'react'

import { KeyboardArrowDownOutlined } from '@mui/icons-material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  Link as MuiLink,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { HeaderAction } from '@/components/common'
import { CategoryNestedNavigation, SwitchAccountMenu } from '@/components/layout'
import { useAuthContext } from '@/context'
import { uiHelpers } from '@/lib/helpers'
import type { NavigationLink } from '@/lib/types'

import type { Maybe, PrCategory } from '@/lib/gql/types'

interface HamburgerMenuProps {
  categoryTree: Maybe<PrCategory>[]
  isDrawerOpen?: boolean
  navLinks?: NavigationLink[]
  marginTop?: number | string
  setIsDrawerOpen: (isDrawerOpen: boolean) => void
  onAccountIconClick: () => void
  requestAccountIconComponent?: React.ReactNode
  isCSR: boolean
  customerName: string
  companyOrOrganization?: string
}

const styles = {
  container: {
    width: { xs: '85vw', sm: '350px' },
    position: 'relative',
    height: '100%',
    overflowY: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#121212',
    color: 'white',
    boxShadow: '4px 0 24px rgba(0,0,0,0.5)',
  },
  menuList: {
    overflowY: 'auto',
    width: '100%',
    '&::-webkit-scrollbar': {
      width: '5px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },

  },
}

const HamburgerMenu = (props: HamburgerMenuProps) => {
  const {
    categoryTree,
    isDrawerOpen,
    marginTop = 7,
    setIsDrawerOpen,
    navLinks,
    onAccountIconClick,
    requestAccountIconComponent,
    isCSR,
    customerName,
    companyOrOrganization,
  } = props
  const { getCategoryLink } = uiHelpers()
  const { t } = useTranslation('common')
  const { isAuthenticated, user } = useAuthContext()
  const router = useRouter()
  const userName = isAuthenticated ? user?.firstName : isCSR ? customerName : ''
  const [anchorElAccountOptions, setAnchorElAccountOptions] = React.useState<null | HTMLElement>(
    null
  )
  const openAccountOptions = Boolean(anchorElAccountOptions)

  const toggleDrawer = (open: boolean) => {
    setIsDrawerOpen(open)
  }

  const handleCategoryClick = (categoryCode: string, slug?: string) => {
    toggleDrawer(false)
    const link = getCategoryLink(categoryCode, slug as string)
    router.push(link)
  }

  const handleNavLinks = (link: string) => {
    toggleDrawer(false)
    router.push(link)
  }

  const handleAccountOptionsClick = (event: any) => {
    setAnchorElAccountOptions(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorElAccountOptions(null)
  }

  const getSubtitle = () => {
    return isCSR || !companyOrOrganization
      ? ''
      : isAuthenticated
      ? companyOrOrganization
        ? t('go-to') + companyOrOrganization
        : t('go-to-my-account')
      : t('log-in')
  }

  return (
    <>
      <SwipeableDrawer
        anchor={'left'}
        open={isDrawerOpen || false}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
        data-testid="hamburger-menu"
      >
        <Box sx={{ ...styles.container, marginTop: marginTop }} role="presentation">
          <Box sx={{ ...styles.menuList }}>
            <CategoryNestedNavigation
              categoryTree={categoryTree}
              onCloseMenu={toggleDrawer}
              onCategoryClick={handleCategoryClick}
            >
              <Box
                width="100%"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                sx={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(158, 151, 151, 0.03)',
                  borderBottom: '1px solid rgba(126, 123, 123, 0.08)',
                  backdropFilter: 'blur(10px)',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(158, 151, 151, 0.06)',
                  }
                }}
              >
                <HeaderAction
                  title={userName ? `${t('hi')}, ${userName}` : t('my-account')}
                  subtitle={getSubtitle()}
                  icon={AccountCircle}
                  mobileIconColor="white"
                  iconFontSize="large"
                  showTitleInMobile={true}
                  onClick={onAccountIconClick}
                  isElementVisible={true}
                  data-testid="Account-Icon"
                  isCSR={Boolean(isCSR)}
                />
                <Box pr={1.5}>
                  {
                    <KeyboardArrowDownOutlined
                      onClick={handleAccountOptionsClick}
                      aria-controls={openAccountOptions ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openAccountOptions ? 'true' : undefined}
                      sx={{
                        color: 'white',
                      }}
                    />
                  }
                  <SwitchAccountMenu
                    open={openAccountOptions}
                    handleClose={handleClose}
                    anchorEl={anchorElAccountOptions}
                  />
                </Box>
              </Box>
            </CategoryNestedNavigation>
          </Box>
        </Box>
      </SwipeableDrawer>
    </>
  )
}

export default HamburgerMenu

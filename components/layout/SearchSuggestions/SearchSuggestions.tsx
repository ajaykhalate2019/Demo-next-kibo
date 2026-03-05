import React, { useEffect, useState } from 'react'

import {
  Backdrop,
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material'
import getConfig from 'next/config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { SearchBar } from '@/components/common'
import { useDebounce, useGetSearchSuggestion2 } from '@/hooks'

const style = {
  paper: {
    borderRadius: 1,
    position: 'relative',
    zIndex: 1400,
    width: '100%',
    maxWidth: { xs: '100%', md: 661 },
    bgcolor: '#1A1A1A',
  } as SxProps<Theme> | undefined,
  list: {
    p: 1.5,
  },
  listItem: {
    borderRadius: 1,
    mb: 0.5,
    transition: 'all 0.2s',
    // '&:hover': {
    //   backgroundColor: 'rgba(255, 255, 255, 0.05)',
    //   pl: 2.5,
    // },
    '&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  listItemText: {
    margin: 0,
    '& .MuiListItemText-primary': {
      fontSize: '0.875rem',
      color: 'grey.400',
    },
  } as SxProps<Theme> | undefined,
}

interface SearchSuggestionsProps {
  onEnterSearch?: () => void
  isViewSearchPortal?: boolean
}

interface ListItemProps {
  code?: string
  name?: string
  path?: string
  onSearchSuggestionClose?: () => void
}

const Title = ({ heading }: { heading: string }) => {
  const { t } = useTranslation('common')

  return (
    <ListItem key="Suggestions" sx={{ px: 2, py: 1 }}>
      <Typography
        fontWeight={700}
        variant="caption"
        sx={{
          textTransform: 'uppercase',
          color: 'primary.main',
          letterSpacing: 1.2
        }}
      >
        {t(heading)}
      </Typography>
    </ListItem>
  )
}

const Content = (props: ListItemProps) => {
  const { code, name, path = '', onSearchSuggestionClose } = props

  return (
    <Link href={`${path}${code}`} passHref>
      <ListItem button key={code} onClick={onSearchSuggestionClose}>
        <ListItemText primary={name} sx={{ ...style.listItemText }} />
      </ListItem>
    </Link>
  )
}

const SearchSuggestions = (props: SearchSuggestionsProps) => {
  const { onEnterSearch, isViewSearchPortal } = props
  const { publicRuntimeConfig } = getConfig()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)
  const handleSearch = (userEnteredValue: string) => setSearchTerm(userEnteredValue)
  const handleEnterSearch = (value: string) => {
    router.push({ pathname: '/search', query: { search: value } })
    if (isViewSearchPortal) onEnterSearch?.()
    handleClose()
    setSearchTerm('')
  }

  const searchSuggestionResult = useGetSearchSuggestion2(
    useDebounce(searchTerm.trim(), publicRuntimeConfig.debounceTimeout)
  )

  const getSuggestionGroup = (title: string) =>
    searchSuggestionResult.data
      ? searchSuggestionResult.data?.suggestionGroups?.find((sg) => sg?.name === title)
      : null
  const productSuggestionGroup = getSuggestionGroup('Products')
  const categorySuggestionGroup = getSuggestionGroup('Categories')

  useEffect(() => {
    searchTerm.trim() ? handleOpen() : handleClose()
  }, [searchTerm])

  useEffect(() => {
    const handleRouteChange = () => {
      setSearchTerm('')
      handleClose()
    }

    router.events.on('routeChangeStart', handleRouteChange)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  return (
    <Stack width="100%" position="relative" gap={1} sx={{ maxWidth: '100%' }}>
      <Box sx={{
        zIndex: 1400,
        '& .MuiPaper-root': {
          bgcolor: 'grey.900',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.800',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: 'grey.700',
          },
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: '0 0 0 2px rgba(109, 217, 204, 0.2)',
          }
        },
        '& .MuiInputBase-input': {
          color: 'common.white',
          fontSize: '0.9rem',
          '&::placeholder': {
            color: 'grey.600',
            opacity: 1,
          }
        },
        '& .MuiIconButton-root': {
          color: 'grey.500',
        }
      }}>
        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onKeyEnter={handleEnterSearch}
          showClearButton
        />
      </Box>
      <Collapse
        in={isOpen}
        timeout="auto"
        unmountOnExit
        role="contentinfo"
        sx={{ position: 'absolute', top: '50px', width: '100%' }}
      >
        <Paper sx={{ ...style.paper }}>
          <List sx={{ ...style.list }} role="group">
            <Title heading="suggestions" />
            {productSuggestionGroup?.suggestions?.map((product) => (
              <Content
                key={product?.suggestion?.productCode}
                code={product?.suggestion?.productCode}
                name={product?.suggestion?.productName}
                path={'/product/'}
                onSearchSuggestionClose={handleClose}
              />
            ))}
          </List>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
          <List sx={{ ...style.list }} role="group">
            <Title heading="categories" />
            {categorySuggestionGroup?.suggestions?.map((category) => (
              <Content
                key={category?.suggestion?.categoryCategoryCode}
                code={category?.suggestion?.categoryCategoryCode}
                name={category?.suggestion?.categoryName}
                path={'/category/'}
                onSearchSuggestionClose={handleClose}
              />
            ))}
          </List>
        </Paper>
      </Collapse>
      <Backdrop open={isOpen} onClick={handleClose} data-testid="backdrop"></Backdrop>
    </Stack>
  )
}
export default SearchSuggestions

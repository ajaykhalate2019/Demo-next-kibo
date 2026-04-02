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
    borderRadius: '1.5rem',
    position: 'relative',
    zIndex: 1400,
    width: '100%',
    maxWidth: { xs: '100%', md: 661 },
    background: 'rgba(227, 227, 227, 0.95)',
    backdropFilter: 'blur(32px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  } as SxProps<Theme> | undefined,
  list: {
    p: 2,
  },
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
    <div className="px-6 py-4 first:pt-6">
      <h5 className="text-[9px] font-white uppercase tracking-[0.3em] text-zinc-900">
        {t(heading)}
      </h5>
    </div>
  )
}

const Content = (props: ListItemProps) => {
  const { code, name, path = '', onSearchSuggestionClose } = props

  return (
    <Link href={`${path}${code}`} passHref>
      <div
        role="button"
        onClick={onSearchSuggestionClose}
        className="group relative flex items-center px-6 py-3.5 mx-2 my-1 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <div className="absolute left-0 w-1 h-0 bg-gradient-to-b from-indigo-500 to-violet-500 transition-all duration-300 group-hover:h-8 rounded-r-full" />

        <div className="flex-1 transition-transform duration-300 group-hover:translate-x-1">
          <p className="text-sm text-black group-hover:text-black transition-colors duration-300 font-medium">
            {name}
          </p>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-neutral-800 translate-x-4 group-hover:translate-x-0">
          <span className="text-lg font-light">→</span>
        </div>
      </div>
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
      <Box sx={{ zIndex: 1400 }}>
        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          onKeyEnter={handleEnterSearch}
          showClearButton
        />
      </Box>
      <Collapse
        in={isOpen}
        timeout={400}
        unmountOnExit
        role="contentinfo"
        sx={{
          position: 'absolute',
          top: '60px',
          width: '100%',
          zIndex: 1400
        }}
      >
        <Paper sx={{ ...style.paper }} className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-2">
            <Title heading="suggestions" />
            <div className="mb-4">
              {productSuggestionGroup?.suggestions?.map((product) => (
                <Content
                  key={product?.suggestion?.productCode}
                  code={product?.suggestion?.productCode}
                  name={product?.suggestion?.productName}
                  path={'/product/'}
                  onSearchSuggestionClose={handleClose}
                />
              ))}
            </div>

            <div className="h-[1px] mx-6 bg-white/5" />

            <Title heading="categories" />
            <div className="mb-2">
              {categorySuggestionGroup?.suggestions?.map((category) => (
                <Content
                  key={category?.suggestion?.categoryCategoryCode}
                  code={category?.suggestion?.categoryCategoryCode}
                  name={category?.suggestion?.categoryName}
                  path={'/category/'}
                  onSearchSuggestionClose={handleClose}
                />
              ))}
            </div>
          </div>
        </Paper>
      </Collapse>
      <Backdrop open={isOpen} onClick={handleClose} data-testid="backdrop"></Backdrop>
    </Stack>
  )
}
export default SearchSuggestions

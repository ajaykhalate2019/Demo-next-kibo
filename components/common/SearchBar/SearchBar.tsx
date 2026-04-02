import React, { RefObject } from 'react'

import Clear from '@mui/icons-material/Clear'
import Search from '@mui/icons-material/Search'
import { IconButton, InputBase, Paper } from '@mui/material'
import { useTranslation } from 'next-i18next'

// Interface
interface SearchProps {
  placeHolder?: string
  searchTerm: string
  onSearch: (searchText: string) => void
  onKeyEnter?: (searchText: string) => void
  showClearButton: boolean
  childInputRef?: RefObject<HTMLInputElement | undefined>
  inputProps?: any
}
// MUI
const style = {
  paper: {
    p: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 0,
  },
  inputBase: {
    // ml: 1,
    flex: 1,
  },
  divider: { height: 20, m: 0.5 },
}
// Component
const SearchBar = (props: SearchProps) => {
  const {
    placeHolder = 'Search',
    searchTerm,
    onSearch,
    childInputRef,
    showClearButton = false,
    inputProps,
    onKeyEnter,
    ...rest
  } = props
  const { t } = useTranslation('common')
  const SearchAriaLabel = t('search-icon')
  const searchInputAriaLabel = t('search-input')
  const clearSearchAriaLabel = t('clear-search')
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onSearch(event.target.value)
  }
  const handleClear = () => {
    onSearch('')
  }
  return (
    <div
      className={`3
        group relative flex items-center w-full transition-all duration-500 ease-out
        bg-gray-200 backdrop-blur-xl border border-white/20 rounded-full
        focus-within:bg-gray-400 focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/20
      `}
    >
      <div className="flex items-center pl-4 text-white/50 group-hover:text-white transition-all duration-300">
        <IconButton size="small" aria-label={SearchAriaLabel} className="p-1">
          <Search fontSize="small" className="text-inherit text-gray-50" />
        </IconButton>
      </div>

      <InputBase
        name="searchInput"
        inputRef={childInputRef}
        value={searchTerm}
        placeholder={placeHolder}
        onChange={handleSearch}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onKeyEnter?.(searchTerm)
          }
        }}
        size="small"
        className="flex-1 text-black placeholder:text-neutral-800 px-2 py-1.5 focus:outline-none font-medium selection:bg-indigo-500/30"
        inputProps={{
          'aria-label': searchInputAriaLabel,
          style: { padding: '8px 4px' }
        }}
        {...inputProps}
        autoComplete="off"
        {...rest}
      />

      {showClearButton && searchTerm.length > 0 && (
        <div className="flex items-center pr-2 animate-in fade-in zoom-in duration-300">
          <IconButton
            name="clearButton"
            size="small"
            onClick={handleClear}
            aria-label={clearSearchAriaLabel}
            className="text-black hover:text-black hover:bg-white transition-all duration-300 transform hover:rotate-90"
          >
            <Clear fontSize="small" />
          </IconButton>
        </div>
      )}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-indigo-500/10 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-1000 pointer-events-none -z-10"></div>
    </div>
  )
}
export default SearchBar

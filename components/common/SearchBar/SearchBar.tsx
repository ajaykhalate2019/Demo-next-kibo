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
      className={`
        group relative flex items-center w-full transition-all duration-500 ease-out
        bg-white/10 backdrop-blur-xl border border-white/20 rounded-full
        hover:bg-white/20 hover:shadow-2xl hover:shadow-cyan-500/20
        focus-within:bg-white/30 focus-within:ring-2 focus-within:ring-cyan-400/50 focus-within:scale-[1.01]
      `}
    >
      <div className="flex items-center pl-3 text-white/70 group-hover:text-cyan-300 transition-colors duration-300">
        <IconButton size="small" aria-label={SearchAriaLabel} className="p-1 hover:bg-transparent">
          <Search fontSize="small" className="text-inherit" />
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
        className="flex-1 text-white placeholder:text-white/50 px-2 py-1.5 focus:outline-none"
        inputProps={{
          'aria-label': searchInputAriaLabel,
          style: { padding: '8px 4px' } // MUI InputBase needs some internal padding management
        }}
        {...inputProps}
        autoComplete="off"
        {...rest}
      />

      {showClearButton && searchTerm.length > 0 && (
        <div className="flex items-center pr-2 animate-fadeIn">
          <IconButton
            name="clearButton"
            size="small"
            onClick={handleClear}
            aria-label={clearSearchAriaLabel}
            className="text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:rotate-90"
          >
            <Clear fontSize="small" />
          </IconButton>
        </div>
      )}

      {/* Advanced Gradient Border Effect on Focus */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-700 pointer-events-none"></div>
    </div>
  )
}
export default SearchBar

import React, { ReactNode, useEffect, useState } from 'react'

import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Close from '@mui/icons-material/Close'
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Slide,
  Theme,
  Typography,
} from '@mui/material'
import { useTranslation } from 'next-i18next'

import { findParentNode } from '@/lib/helpers'

import type { Maybe, PrCategory } from '@/lib/gql/types'

interface CategoryNestedNavigationProps {
  categoryTree: Maybe<PrCategory>[]
  children?: ReactNode
  onCategoryClick: (categoryCode: string, slug?: string) => void
  onCloseMenu: (isOpen: boolean) => void
}

const styles = {
  floatRight: {
    marginLeft: 'auto',
  },
  smallIcon: {
    fontSize: (theme: Theme) => theme.typography.body2, color: 'white'
  },
  listHeader: { paddingLeft: 4, paddingRight: 4, paddingTop: 1.5, paddingBottom: 1.5 },
  listContent: {
    fontSize: (theme: Theme) => theme.typography.subtitle2,
  },
}

const CategoryNestedNavigation = (props: CategoryNestedNavigationProps) => {
  const { categoryTree, children, onCategoryClick, onCloseMenu } = props
  const { t } = useTranslation('common')
  const initialSubHeader = {
    backLink: t('back'),
    categoryCode: '',
    label: t('all-departments'),
  }

  const [subHeader, setSubHeader] = useState<typeof initialSubHeader>(initialSubHeader)
  const [activeCategory, setActiveCategory] = useState<Maybe<PrCategory>[]>(categoryTree)

  const reset = () => {
    setActiveCategory(categoryTree)
    setSubHeader(initialSubHeader)
  }

  const handleCategoryClick = (clickedCategory: Maybe<PrCategory>) => {
    if (clickedCategory?.childrenCategories?.length) {
      const selectedCategory: Maybe<PrCategory> = activeCategory?.find(
        (category) => category?.categoryCode === clickedCategory?.categoryCode
      ) as Maybe<PrCategory>

      setActiveCategory(selectedCategory?.childrenCategories as [])

      setSubHeader({
        backLink: subHeader.label,
        label: selectedCategory?.content?.name as string,
        categoryCode: selectedCategory?.categoryCode as string,
      })
    } else {
      onCategoryClick(
        clickedCategory?.categoryCode as string,
        clickedCategory?.content?.slug as string
      )
    }
  }

  const handleBackClick = () => {
    const previousCategory: Maybe<PrCategory | undefined | null> = findParentNode(
      categoryTree,
      subHeader.categoryCode
    )

    if (previousCategory === null) reset()
    if (previousCategory === undefined) onCloseMenu(false)
    if (previousCategory) {
      setActiveCategory(previousCategory?.childrenCategories as PrCategory[])
      const parentCategory: Maybe<PrCategory | undefined | null> = findParentNode(
        categoryTree,
        previousCategory?.categoryCode
      )

      setSubHeader({
        backLink: parentCategory ? (parentCategory?.content?.name as string) : t('all-departments'),
        label: previousCategory?.content?.name as string,
        categoryCode: previousCategory?.categoryCode as string,
      })
    }
  }

  useEffect(() => {
    if (categoryTree) setActiveCategory(categoryTree)
  }, [categoryTree])

  return (
    <List
      className="w-full pb-0 bg-transparent text-white"
      aria-labelledby="category-nested-list"
      role="list"
      subheader={
        <Box display="flex" alignItems="center" pl={3} pr={2} pt={'4px'} className="text-white bg-transparent">
          <IconButton size="small" aria-label="back-arrow-button" onClick={handleBackClick} className="text-white">
            <ArrowBackIos sx={{ ...styles.smallIcon }} />
          </IconButton>
          <ListSubheader component="div" className="flex-1 px-2 text-white bg-transparent font-bold">
            {subHeader.backLink}
          </ListSubheader>
          <IconButton
            size="small"
            aria-label="close-button" 
            className="mr-2 text-white"
            onClick={() => onCloseMenu(false)}
          >
            <Close sx={{ ...styles.smallIcon }} />
          </IconButton>
        </Box>
      }
    >
      {children && subHeader.label === initialSubHeader.label && (
        <div className="w-full">
          {children}
        </div>
      )}
      <ListItem className="px-4 py-3">
        <Typography variant="h6" className="font-bold text-white/90">{subHeader.label}</Typography>
      </ListItem>
      <Divider className="border-white/10" />
      {activeCategory?.map((category: Maybe<PrCategory>) => {
        return (
          <Slide
            key={category?.categoryId}
            direction="right"
            in={Boolean(activeCategory.length)}
            appear={true}
          >
            <Box>
              <ListItemButton className="px-4 hover:bg-white/5 transition-colors">
                <ListItemText
                  primary={<span className="text-white/80 font-medium">{category?.content?.name}</span>}
                  onClick={() =>
                    onCategoryClick(
                      category?.categoryCode as string,
                      category?.content?.slug as string
                    )
                  }
                />
                {category?.childrenCategories?.length ? (
                  <ArrowForward fontSize="small" className="text-white/60" onClick={() => handleCategoryClick(category)} />
                ) : null}
              </ListItemButton>
              <Divider className="border-white/5" />
            </Box>
          </Slide>
        )
      })}
    </List>
  )
}

export default CategoryNestedNavigation

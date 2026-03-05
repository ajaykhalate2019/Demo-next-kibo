import { useRouter } from 'next/router'
import { useRef } from 'react'
import {
  Container,
  Typography,
  Card,
  CircularProgress,
  Alert,
  Box,
  CardMedia,
  CardContent,
  Divider,
  Fade,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import { LoadingButton } from '@mui/lab'

import { productGetters } from '@/lib/getters'
import { uiHelpers } from '@/lib/helpers'
import { FulfillmentOptions as FulfillmentOptionsConstant } from '@/lib/constants'
import type { Product } from '@/lib/gql/types'
import { useGetSandboxProducts, useProductCardActions } from '@/hooks'

const SandboxProducts = () => {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  const { data, isLoading, isError } = useGetSandboxProducts({
    pageSize: 100,
  })

  const { getProductLink } = uiHelpers()
  const { handleAddToCart, isATCLoading, checkProductInWishlist, handleWishList } =
    useProductCardActions()

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return

    const containerWidth = scrollRef.current.clientWidth

    scrollRef.current.scrollBy({
      left: direction === 'left' ? -containerWidth : containerWidth,
      behavior: 'smooth',
    })
  }

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading products...
        </Typography>
      </Box>
    )
  }

  if (isError || !data) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">Failed to load products.</Alert>
      </Container>
    )
  }

  const products = data.items ?? []

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={6}>
        <Box>
          <Typography variant="h4" color="primary.main" fontWeight={700}>
            All Products
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Showing all available products
          </Typography>
        </Box>
        <Chip label={`${products.length} Products`} color="primary" />
      </Box>

      {/* CAROUSEL */}
      <Box position="relative">
        {/* LEFT ARROW (Hidden on Mobile) */}
        {/* {!isMobile && (
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              position: 'absolute',
              left: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              bgcolor: '#fff',
              boxShadow: 3,
              '&:hover': { background: '#f5f5f5' },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        )} */}

        {/* RIGHT ARROW (Hidden on Mobile) */}
        {/* {!isMobile && (
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 2,
              bgcolor: '#fff',
              boxShadow: 3,
              '&:hover': { background: '#f5f5f5' },
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        )} */}

        {/* TOP CONTROLS */}
        {!isMobile && (
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap={1}
            mb={2}
          >
            <IconButton
              onClick={() => scroll('left')}
              sx={{
                bgcolor: '#fff',
                boxShadow: 2,
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => scroll('right')}
              sx={{
                bgcolor: '#fff',
                boxShadow: 2,
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* SCROLL CONTAINER */}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            gap: 2,
            pb: 2,
            // scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { height: 8, },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: 10,
            },

            '&::-webkit-scrollbar-thumb': {
              background: '#72c2baff',
              borderRadius: 10,
            },

            '&::-webkit-scrollbar-thumb:hover': {
              background: '#2ea095',
            },
          }}
        >
          {products.map((product, index) => {
            const typedProduct = product as Product
            const name = productGetters.getName(typedProduct)
            const imageUrl = productGetters.handleProtocolRelativeUrl(
              productGetters.getCoverImage(typedProduct)
            )
            const fullDescription = typedProduct.content?.productFullDescription || ''

            const price = productGetters.getPrice(typedProduct) || {
              regular: '',
              special: '',
            }

            const inventory = typedProduct.inventoryInfo
            const categories = typedProduct.categories || []
            const isOnSale = price.special && price.special !== price.regular

            const productCode = productGetters.getProductId(typedProduct)
            const variationProductCode = productGetters.getVariationProductCode(typedProduct)

            const link = getProductLink(
              productCode,
              typedProduct?.content?.seoFriendlyUrl as string
            )

            const handleAddToCartClick = () => {
              handleAddToCart({
                product: {
                  productCode,
                  variationProductCode,
                  fulfillmentMethod: typedProduct?.fulfillmentTypesSupported?.includes(
                    FulfillmentOptionsConstant.DIGITAL
                  )
                    ? FulfillmentOptionsConstant.DIGITAL
                    : FulfillmentOptionsConstant.SHIP,
                  purchaseLocationCode: '',
                  options: [],
                },
                quantity: 1,
              })
            }

            return (
              <Box
                key={index}
                sx={{
                  flex: '0 0 auto',
                  width: isMobile ? '96%' : isTablet ? '48%' : '25%',
                  display: 'flex',
                }}
              >
                <Fade in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 1.5,
                      transition: '0.3s',
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {/* IMAGE */}
                    <Box sx={{ position: 'relative', pt: '50%' }}>
                      <CardMedia
                        component="img"
                        image={imageUrl}
                        alt={name}
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          p: 0.5,
                        }}
                      />
                      {isOnSale && (
                        <Chip
                          label="SALE"
                          color="error"
                          size="small"
                          sx={{ position: 'absolute', top: 12, left: 12 }}
                        />
                      )}
                      {!productGetters.isVariationProduct(typedProduct) && (
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                          }}
                          onClick={() => handleWishList(typedProduct as any)}
                        >
                          {checkProductInWishlist({
                            productCode,
                            variationProductCode,
                          }) ? (
                            <Favorite color="error" fontSize="small" />
                          ) : (
                            <FavoriteBorder fontSize="small" />
                          )}
                        </IconButton>
                      )}
                    </Box>

                    {/* CONTENT */}
                    <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                      <Typography variant="body1" fontWeight={600} gutterBottom>
                        {name}
                      </Typography>

                      {/* DESCRIPTION */}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {fullDescription}
                      </Typography>

                      {/* PRICE SECTION */}
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle1" fontWeight={700} color="primary">
                          ${isOnSale ? price.special : price.regular}
                        </Typography>

                        {isOnSale && (
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: 'line-through',
                              opacity: 0.6,
                            }}
                          >
                            ${price.regular}
                          </Typography>
                        )}
                      </Box>

                      <Stack direction="row" flexWrap="wrap" gap={0.5} mt={2}>
                        {categories?.filter(Boolean).map((cat, ci) => (
                          <Chip key={ci} label={cat?.content?.name || 'Category'} size="small" />
                        ))}
                      </Stack>
                    </CardContent>

                    {/* ACTIONS */}
                    <Box p={1.5}>
                      <Stack direction="row" spacing={1}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => router.push(link)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                          }}
                        >
                          View
                        </Button>

                        <LoadingButton
                          fullWidth
                          variant="contained"
                          startIcon={<ShoppingBagIcon />}
                          loading={isATCLoading}
                          disabled={
                            !typedProduct.purchasableState?.isPurchasable ||
                            !inventory?.onlineStockAvailable
                          }
                          onClick={handleAddToCartClick}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                          }}
                        >
                          {inventory?.onlineStockAvailable ? 'Add To Cart' : 'Out Of Stock'}
                        </LoadingButton>
                      </Stack>
                    </Box>
                  </Card>
                </Fade>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Container>
  )
}

export default SandboxProducts

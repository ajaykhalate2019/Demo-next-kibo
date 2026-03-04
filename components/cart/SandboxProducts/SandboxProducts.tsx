// import { useRouter } from 'next/router'
// import { useRef } from 'react'
// import {
//   Container,
//   Typography,
//   Card,
//   CircularProgress,
//   Alert,
//   Box,
//   CardMedia,
//   CardContent,
//   Divider,
//   Fade,
//   Button,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Chip,
//   Stack,
//   IconButton,
// } from '@mui/material'

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
// import { LoadingButton } from '@mui/lab'
// import { useTranslation } from 'next-i18next'

// import { productGetters } from '@/lib/getters'
// import { uiHelpers } from '@/lib/helpers'
// import { FulfillmentOptions as FulfillmentOptionsConstant } from '@/lib/constants'
// import type { Product } from '@/lib/gql/types'
// import { useGetSandboxProducts, useProductCardActions } from '@/hooks'

// const SandboxProducts = () => {
//   const router = useRouter()

//   const { data, isLoading, isError } = useGetSandboxProducts({
//     pageSize: 100,
//   })

//   const { t } = useTranslation('common')
//   const { getProductLink } = uiHelpers()
//   const { handleAddToCart, isATCLoading } = useProductCardActions()

//   const scrollRef = useRef<HTMLDivElement | null>(null)

//   const scroll = (direction: 'left' | 'right') => {
//     if (!scrollRef.current) return

//     const containerWidth = scrollRef.current.clientWidth

//     scrollRef.current.scrollBy({
//       left: direction === 'left' ? -containerWidth : containerWidth,
//       behavior: 'smooth',
//     })
//   }

//   // Loading State
//   if (isLoading) {
//     return (
//       <Box
//         display="flex"
//         flexDirection="column"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="70vh"
//         gap={2}
//       >
//         <CircularProgress size={50} />
//         <Typography variant="body1" color="text.secondary">
//           Loading catalog...
//         </Typography>
//       </Box>
//     )
//   }

//   // Error State
//   if (isError || !data) {
//     return (
//       <Container sx={{ py: 10 }}>
//         <Alert severity="error" variant="filled">
//           Failed to load sandbox products.
//         </Alert>
//       </Container>
//     )
//   }

//   const products = data.items ?? []

//   return (
//     <Container maxWidth="xl" sx={{ py: 8 }}>
//       {/* Header */}
//       <Box mb={6} display="flex" justifyContent="space-between" alignItems="flex-end">
//         <Box>
//           <Typography variant="h3" color="primary.main" fontWeight={800} gutterBottom>
//             All Products
//           </Typography>
//           <Typography variant="h6" color="text.secondary">
//             Showing all available products
//           </Typography>
//         </Box>
//         <Chip label={`${products.length} Products`} color="primary" variant="outlined" />
//       </Box>

//       {/* Scroll Wrapper */}
//       <Box position="relative">
//         {/* Left Arrow */}
//         <IconButton
//           onClick={() => scroll('left')}
//           sx={{
//             position: 'absolute',
//             left: -20,
//             top: '40%',
//             zIndex: 2,
//             background: '#fff',
//             boxShadow: 3,
//             '&:hover': { background: '#f5f5f5' },
//           }}
//         >
//           <ArrowBackIosNewIcon fontSize="small" />
//         </IconButton>

//         {/* Right Arrow */}
//         <IconButton
//           onClick={() => scroll('right')}
//           sx={{
//             position: 'absolute',
//             right: -20,
//             top: '40%',
//             zIndex: 2,
//             background: '#fff',
//             boxShadow: 3,
//             '&:hover': { background: '#f5f5f5' },
//           }}
//         >
//           <ArrowForwardIosIcon fontSize="small" />
//         </IconButton>

//         {/* Horizontal Scroll Container */}
//         <Box ref={scrollRef} display="flex" gap={4} overflow="hidden">
//           {products.map((product, index) => {
//             const typedProduct = product as Product
//             const name = productGetters.getName(typedProduct)
//             const imageUrl = productGetters.handleProtocolRelativeUrl(
//               productGetters.getCoverImage(typedProduct)
//             )
//             const fullDescription = typedProduct.content?.productFullDescription || ''
//             const price = productGetters.getPrice(typedProduct) || {
//               regular: '',
//               special: '',
//             }

//             const inventory = typedProduct.inventoryInfo
//             const categories = typedProduct.categories || []
//             const isOnSale = price.special && price.special !== price.regular

//             const productCode = productGetters.getProductId(typedProduct)
//             const variationProductCode = productGetters.getVariationProductCode(typedProduct)
//             const link = getProductLink(productCode, typedProduct?.content?.seoFriendlyUrl as string)

//             const handleAddToCartClick = () => {
//               const payload = {
//                 product: {
//                   productCode: productCode,
//                   variationProductCode: variationProductCode,
//                   fulfillmentMethod: typedProduct?.fulfillmentTypesSupported?.includes(
//                     FulfillmentOptionsConstant.DIGITAL
//                   )
//                     ? FulfillmentOptionsConstant.DIGITAL
//                     : FulfillmentOptionsConstant.SHIP,
//                   purchaseLocationCode: '',
//                   options: [],
//                 },
//                 quantity: 1,
//               }
//               handleAddToCart(payload)
//             }

//             return (
//               <Box
//                 key={typedProduct.productCode || index}
//                 flex={{
//                   xs: '0 0 100%',
//                   sm: '0 0 50%',
//                   md: '0 0 33%',
//                   lg: '0 0 25%',
//                 }}
//               >
//                 <Fade in timeout={500 + (index % 10) * 100}>
//                   <Card
//                     sx={{
//                       height: '100%',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       borderRadius: 4,
//                       transition: 'all 0.4s ease',
//                       '&:hover': {
//                         boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
//                         transform: 'translateY(-8px)',
//                       },
//                     }}
//                   >
//                     {/* Image */}
//                     <Box
//                       sx={{
//                         position: 'relative',
//                         pt: '75%',
//                         overflow: 'hidden',
//                       }}
//                     >
//                       {imageUrl ? (
//                         <CardMedia
//                           component="img"
//                           image={imageUrl}
//                           alt={name}
//                           sx={{
//                             position: 'absolute',
//                             top: 0,
//                             left: 0,
//                             width: '100%',
//                             height: '100%',
//                             objectFit: 'contain',
//                             p: 2,
//                           }}
//                         />
//                       ) : (
//                         <Box
//                           sx={{
//                             position: 'absolute',
//                             inset: 0,
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             bgcolor: 'grey.100',
//                           }}
//                         >
//                           <Typography variant="button">No Image</Typography>
//                         </Box>
//                       )}

//                       {isOnSale && (
//                         <Chip
//                           label="SALE"
//                           color="error"
//                           size="small"
//                           sx={{
//                             position: 'absolute',
//                             top: 16,
//                             right: 16,
//                           }}
//                         />
//                       )}
//                     </Box>

//                     <CardContent sx={{ flexGrow: 1, p: 3 }}>
//                       <Typography variant="h6" fontWeight={700} gutterBottom>
//                         {name}
//                       </Typography>

//                       <Box display="flex" alignItems="baseline" gap={2} mb={2}>
//                         <Typography variant="h5" color="primary" fontWeight={800}>
//                           ${isOnSale ? price.special : price.regular}
//                         </Typography>

//                         {isOnSale && (
//                           <Typography
//                             variant="body1"
//                             sx={{
//                               textDecoration: 'line-through',
//                               opacity: 0.6,
//                             }}
//                           >
//                             ${price.regular}
//                           </Typography>
//                         )}
//                       </Box>

//                       <Divider sx={{ mb: 2 }} />

//                       {fullDescription && (
//                         <Accordion
//                           disableGutters
//                           elevation={0}
//                           sx={{
//                             '&:before': {
//                               display: 'none',
//                             },
//                           }}
//                         >
//                           <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                             <Typography variant="body2" fontWeight={600}>
//                               Description
//                             </Typography>
//                           </AccordionSummary>
//                           <AccordionDetails>
//                             <Typography
//                               variant="caption"
//                               component="div"
//                               dangerouslySetInnerHTML={{
//                                 __html: fullDescription,
//                               }}
//                             />
//                           </AccordionDetails>
//                         </Accordion>
//                       )}

//                       <Stack direction="row" flexWrap="wrap" gap={0.5} mt={2}>
//                         {categories?.filter(Boolean).map((cat, ci) => (
//                           <Chip key={ci} label={cat?.content?.name || 'Category'} size="small" />
//                         ))}
//                       </Stack>
//                     </CardContent>

//                     <Box p={3} pt={0}>
//                       <Stack spacing={1}>
//                         <Button
//                           fullWidth
//                           variant="outlined"
//                           size="medium"
//                           onClick={() => router.push(link)}
//                         >
//                           View Product
//                         </Button>
//                         <LoadingButton
//                           fullWidth
//                           variant="contained"
//                           size="large"
//                           startIcon={<ShoppingBagIcon />}
//                           loading={isATCLoading}
//                           disabled={
//                             !typedProduct.purchasableState?.isPurchasable ||
//                             !inventory?.onlineStockAvailable
//                           }
//                           onClick={handleAddToCartClick}
//                         >
//                           {inventory?.onlineStockAvailable ? 'Add to Cart' : 'Out of Stock'}
//                         </LoadingButton>
//                       </Stack>
//                     </Box>
//                   </Card>
//                 </Fade>
//               </Box>
//             )
//           })}
//         </Box>
//       </Box>
//     </Container>
//   )
// }

// export default SandboxProducts

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
  const { handleAddToCart, isATCLoading } = useProductCardActions()

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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading catalog...
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
    <Container maxWidth="xl" sx={{ py: 8 }}>
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
        {!isMobile && (
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
        )}

        {/* RIGHT ARROW (Hidden on Mobile) */}
        {!isMobile && (
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
        )}

        {/* SCROLL CONTAINER */}
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            gap: 3,
            pb: 2,
            scrollbarWidth: 'none',
            //+'&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {products.map((product, index) => {
            const typedProduct = product as Product
            const name = productGetters.getName(typedProduct)
            const imageUrl = productGetters.handleProtocolRelativeUrl(
              productGetters.getCoverImage(typedProduct)
            )

            const price = productGetters.getPrice(typedProduct) || {
              regular: '',
              special: '',
            }

            const inventory = typedProduct.inventoryInfo
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
                  width: isMobile ? '100%' : isTablet ? '50%' : '25%',
                  display: 'flex',
                }}
              >
                <Fade in timeout={300 + index * 100}>
                  <Card
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: '0.3s',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-6px)',
                      },
                    }}
                  >
                    {/* IMAGE */}
                    <Box sx={{ position: 'relative', pt: '75%' }}>
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
                          p: 2,
                        }}
                      />
                      {isOnSale && (
                        <Chip
                          label="SALE"
                          color="error"
                          size="small"
                          sx={{ position: 'absolute', top: 12, right: 12 }}
                        />
                      )}
                    </Box>

                    {/* CONTENT */}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography fontWeight={600} gutterBottom>
                        {name}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="h6" fontWeight={700}>
                          ${isOnSale ? price.special : price.regular}
                        </Typography>
                        {isOnSale && (
                          <Typography
                            variant="body2"
                            sx={{ textDecoration: 'line-through', opacity: 0.6 }}
                          >
                            ${price.regular}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>

                    {/* ACTIONS */}
                    <Box p={2}>
                      <Stack spacing={1}>
                        <Button fullWidth variant="outlined" onClick={() => router.push(link)}>
                          View Product
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

import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Heart,
  Loader2,
  ArrowRight
} from 'lucide-react'

import { productGetters } from '@/lib/getters'
import { uiHelpers } from '@/lib/helpers'
import { FulfillmentOptions as FulfillmentOptionsConstant } from '@/lib/constants'
import type { Product } from '@/lib/gql/types'
import { useGetSandboxProducts, useProductCardActions } from '@/hooks'

const CarouselButton = ({
  onClick,
  direction
}: {
  onClick: () => void,
  direction: 'left' | 'right'
}) => (
  <button
    onClick={onClick}
    className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-tr from-[#2ea195]/20 to-[#2193b0]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    {direction === 'left' ? (
      <ChevronLeft className="w-6 h-6 text-white group-hover:text-cyan-400 transition-colors" />
    ) : (
      <ChevronRight className="w-6 h-6 text-white group-hover:text-cyan-400 transition-colors" />
    )}
  </button>
)

const ProductCard = ({ product, index }: { product: Product, index: number }) => {
  const router = useRouter()
  const { getProductLink } = uiHelpers()
  const { handleAddToCart, isATCLoading, checkProductInWishlist, handleWishList } =
    useProductCardActions()

  const name = productGetters.getName(product)
  const imageUrl = productGetters.handleProtocolRelativeUrl(
    productGetters.getCoverImage(product)
  )
  const fullDescription = product.content?.productFullDescription || ''
  const price = productGetters.getPrice(product) || { regular: '', special: '' }
  const inventory = product.inventoryInfo
  const categories = product.categories || []
  const isOnSale = price.special && price.special !== price.regular
  const productCode = productGetters.getProductId(product)
  const variationProductCode = productGetters.getVariationProductCode(product)
  const isWishlisted = checkProductInWishlist({ productCode, variationProductCode })

  const link = getProductLink(
    productCode,
    product?.content?.seoFriendlyUrl as string
  )

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleAddToCart({
      product: {
        productCode,
        variationProductCode,
        fulfillmentMethod: product?.fulfillmentTypesSupported?.includes(
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
    <div
      className="group relative flex flex-col w-full min-w-[300px] md:min-w-[320px] bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:ring-1 hover:ring-white/20"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isOnSale && (
            <div className="px-3 py-1 bg-red-500 text-white text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg">
              Sale
            </div>
          )}
          <div className="px-3 py-1 bg-white/80 backdrop-blur-md text-gray-900 text-[10px] font-bold uppercase rounded-full shadow-sm border border-white/20">
            Premium
          </div>
        </div>

        {/* Wishlist Button */}
        {!productGetters.isVariationProduct(product) && (
          <button
            onClick={() => handleWishList(product as any)}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/60 backdrop-blur-md border border-white/20 shadow-md transition-all duration-300 hover:bg-white hover:scale-110 active:scale-90"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-6">
        <div className="mb-2">
          {categories?.[0] && (
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2ea195]">
              {categories[0]?.content?.name}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#2ea195] transition-colors">
          {name}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed font-medium">
          {fullDescription.replace(/<[^>]*>?/gm, '')}
        </p>

        {/* Price Area */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl font-black text-gray-900">
            ${isOnSale ? price.special : price.regular}
          </span>
          {isOnSale && (
            <span className="text-sm text-gray-400 line-through font-bold">
              ${price.regular}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push(link)}
            className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded-xl transition-all duration-300 hover:bg-gray-50 hover:border-gray-900 active:scale-[0.98]"
          >
            View
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={handleAddToCartClick}
            disabled={!product.purchasableState?.isPurchasable || !inventory?.onlineStockAvailable || isATCLoading}
            className="group relative flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white rounded-xl bg-gradient-to-r from-[#2ea195] to-[#2193b0] shadow-lg shadow-[#2ea195]/20 transition-all duration-300 hover:shadow-[#2ea195]/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />

            {isATCLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="relative z-10">
                  {inventory?.onlineStockAvailable ? 'Add' : 'Stock'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const SandboxProducts = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const { data, isLoading, isError } = useGetSandboxProducts({ pageSize: 100 })

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const { current } = scrollRef
    const scrollAmount = current.clientWidth * 0.8
    current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-[#2ea195] animate-spin" />
        <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Discovering Collections</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto py-20 px-4">
        <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center">
          <p className="text-red-500 font-bold">Failed to load curated collection.</p>
        </div>
      </div>
    )
  }

  const products = data.items ?? []

  return (
    <section className="relative py-12 md:py-24 bg-gray-50/50 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="container relative mx-auto px-4 max-w-[1600px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2ea195]/10 text-[#2ea195] text-[10px] font-black tracking-widest uppercase mb-6">
              Seasonal Edit
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
              Curated <span className="text-[#2ea195]">Excellence.</span>
            </h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Explore our latest arrivals, crafted with precision and designed for the modern individual who values both style and substance.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3">
              <CarouselButton onClick={() => scroll('left')} direction="left" />
              <CarouselButton onClick={() => scroll('right')} direction="right" />
            </div>
            <div className="px-6 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-xs font-bold text-gray-500">
              <span className="text-gray-900 font-black">{products.length}</span> Objects
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-6 pb-12 transition-all duration-500"
        >
          {products.map((product, index) => (
            <div key={index} className="snap-start snap-always shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
              <ProductCard product={product as Product} index={index} />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default SandboxProducts




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
//   useTheme,
//   useMediaQuery,
// } from '@mui/material'

// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
// import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
// import Favorite from '@mui/icons-material/Favorite'
// import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
// import { LoadingButton } from '@mui/lab'

// import { productGetters } from '@/lib/getters'
// import { uiHelpers } from '@/lib/helpers'
// import { FulfillmentOptions as FulfillmentOptionsConstant } from '@/lib/constants'
// import type { Product } from '@/lib/gql/types'
// import { useGetSandboxProducts, useProductCardActions } from '@/hooks'

// const SandboxProducts = () => {
//   const router = useRouter()
//   const scrollRef = useRef<HTMLDivElement | null>(null)

//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
//   const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

//   const { data, isLoading, isError } = useGetSandboxProducts({
//     pageSize: 100,
//   })

//   const { getProductLink } = uiHelpers()
//   const { handleAddToCart, isATCLoading, checkProductInWishlist, handleWishList } =
//     useProductCardActions()

//   const scroll = (direction: 'left' | 'right') => {
//     if (!scrollRef.current) return

//     const containerWidth = scrollRef.current.clientWidth

//     scrollRef.current.scrollBy({
//       left: direction === 'left' ? -containerWidth : containerWidth,
//       behavior: 'smooth',
//     })
//   }

//   if (isLoading) {
//     return (
//       <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh">
//         <CircularProgress />
//         <Typography variant="body1" color="text.secondary">
//           Loading products...
//         </Typography>
//       </Box>
//     )
//   }

//   if (isError || !data) {
//     return (
//       <Container sx={{ py: 8 }}>
//         <Alert severity="error">Failed to load products.</Alert>
//       </Container>
//     )
//   }

//   const products = data.items ?? []

//   return (
//     <Container maxWidth="xl" sx={{ py: 6 }}>
//       {/* HEADER */}
//       <Box display="flex" justifyContent="space-between" mb={6}>
//         <Box>
//           <Typography variant="h4" color="primary.main" fontWeight={700}>
//             All Products
//           </Typography>
//           <Typography variant="h6" color="text.secondary">
//             Showing all available products
//           </Typography>
//         </Box>
//         <Chip label={`${products.length} Products`} color="primary" />
//       </Box>

//       {/* CAROUSEL */}
//       <Box position="relative">
//         {/* TOP CONTROLS */}
//         {!isMobile && (
//           <Box
//             display="flex"
//             justifyContent="flex-end"
//             alignItems="center"
//             gap={1}
//             mb={2}
//           >
//             <IconButton
//               onClick={() => scroll('left')}
//               sx={{
//                 bgcolor: '#fff',
//                 boxShadow: 2,
//                 '&:hover': { bgcolor: '#f5f5f5' },
//               }}
//             >
//               <ArrowBackIosNewIcon fontSize="small" />
//             </IconButton>

//             <IconButton
//               onClick={() => scroll('right')}
//               sx={{
//                 bgcolor: '#fff',
//                 boxShadow: 2,
//                 '&:hover': { bgcolor: '#f5f5f5' },
//               }}
//             >
//               <ArrowForwardIosIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         )}

//         {/* SCROLL CONTAINER */}
//         <Box
//           ref={scrollRef}
//           sx={{
//             display: 'flex',
//             overflowX: 'auto',
//             scrollBehavior: 'smooth',
//             gap: 2,
//             pb: 2,
//             // scrollbarWidth: 'thin',
//             '&::-webkit-scrollbar': { height: 8, },
//             '&::-webkit-scrollbar-track': {
//               background: '#f1f1f1',
//               borderRadius: 10,
//             },

//             '&::-webkit-scrollbar-thumb': {
//               background: '#72c2baff',
//               borderRadius: 10,
//             },

//             '&::-webkit-scrollbar-thumb:hover': {
//               background: '#2ea095',
//             },
//           }}
//         >
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

//             const link = getProductLink(
//               productCode,
//               typedProduct?.content?.seoFriendlyUrl as string
//             )

//             const handleAddToCartClick = () => {
//               handleAddToCart({
//                 product: {
//                   productCode,
//                   variationProductCode,
//                   fulfillmentMethod: typedProduct?.fulfillmentTypesSupported?.includes(
//                     FulfillmentOptionsConstant.DIGITAL
//                   )
//                     ? FulfillmentOptionsConstant.DIGITAL
//                     : FulfillmentOptionsConstant.SHIP,
//                   purchaseLocationCode: '',
//                   options: [],
//                 },
//                 quantity: 1,
//               })
//             }

//             return (
//               <Box
//                 key={index}
//                 sx={{
//                   flex: '0 0 auto',
//                   width: isMobile ? '96%' : isTablet ? '48%' : '25%',
//                   display: 'flex',
//                 }}
//               >
//                 <Fade in timeout={300 + index * 100}>
//                   <Card
//                     sx={{
//                       flex: 1,
//                       display: 'flex',
//                       flexDirection: 'column',
//                       borderRadius: 1.5,
//                       transition: '0.3s',
//                       '&:hover': {
//                         boxShadow: 4,
//                         transform: 'translateY(-2px)',
//                       },
//                     }}
//                   >
//                     {/* IMAGE */}
//                     <Box sx={{ position: 'relative', pt: '50%' }}>
//                       <CardMedia
//                         component="img"
//                         image={imageUrl}
//                         alt={name}
//                         sx={{
//                           position: 'absolute',
//                           inset: 0,
//                           width: '100%',
//                           height: '100%',
//                           objectFit: 'contain',
//                           p: 0.5,
//                         }}
//                       />
//                       {isOnSale && (
//                         <Chip
//                           label="SALE"
//                           color="error"
//                           size="small"
//                           sx={{ position: 'absolute', top: 12, left: 12 }}
//                         />
//                       )}
//                       {!productGetters.isVariationProduct(typedProduct) && (
//                         <IconButton
//                           sx={{
//                             position: 'absolute',
//                             top: 8,
//                             right: 8,
//                             bgcolor: 'rgba(255, 255, 255, 0.7)',
//                             '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
//                           }}
//                           onClick={() => handleWishList(typedProduct as any)}
//                         >
//                           {checkProductInWishlist({
//                             productCode,
//                             variationProductCode,
//                           }) ? (
//                             <Favorite color="error" fontSize="small" />
//                           ) : (
//                             <FavoriteBorder fontSize="small" />
//                           )}
//                         </IconButton>
//                       )}
//                     </Box>

//                     {/* CONTENT */}
//                     <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
//                       <Typography variant="body1" fontWeight={600} gutterBottom>
//                         {name}
//                       </Typography>

//                       {/* DESCRIPTION */}
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                         sx={{
//                           mt: 1,
//                           display: '-webkit-box',
//                           WebkitLineClamp: 2,
//                           WebkitBoxOrient: 'vertical',
//                           overflow: 'hidden',
//                         }}
//                       >
//                         {fullDescription}
//                       </Typography>

//                       {/* PRICE SECTION */}
//                       <Box display="flex" alignItems="center" gap={1}>
//                         <Typography variant="subtitle1" fontWeight={700} color="primary">
//                           ${isOnSale ? price.special : price.regular}
//                         </Typography>

//                         {isOnSale && (
//                           <Typography
//                             variant="body2"
//                             sx={{
//                               textDecoration: 'line-through',
//                               opacity: 0.6,
//                             }}
//                           >
//                             ${price.regular}
//                           </Typography>
//                         )}
//                       </Box>

//                       <Stack direction="row" flexWrap="wrap" gap={0.5} mt={2}>
//                         {categories?.filter(Boolean).map((cat, ci) => (
//                           <Chip key={ci} label={cat?.content?.name || 'Category'} size="small" />
//                         ))}
//                       </Stack>
//                     </CardContent>

//                     {/* ACTIONS */}
//                     <Box p={1.5}>
//                       <Stack direction="row" spacing={1}>
//                         <Button
//                           fullWidth
//                           variant="outlined"
//                           onClick={() => router.push(link)}
//                           sx={{
//                             borderRadius: 2,
//                             textTransform: 'none',
//                           }}
//                         >
//                           View
//                         </Button>

//                         <LoadingButton
//                           fullWidth
//                           variant="contained"
//                           startIcon={<ShoppingBagIcon />}
//                           loading={isATCLoading}
//                           disabled={
//                             !typedProduct.purchasableState?.isPurchasable ||
//                             !inventory?.onlineStockAvailable
//                           }
//                           onClick={handleAddToCartClick}
//                           sx={{
//                             borderRadius: 2,
//                             textTransform: 'none',
//                           }}
//                         >
//                           {inventory?.onlineStockAvailable ? 'Add To Cart' : 'Out Of Stock'}
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

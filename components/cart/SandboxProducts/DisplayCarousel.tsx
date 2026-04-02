import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Carousel } from 'react-responsive-carousel'
import { productGetters } from '@/lib/getters'
import { uiHelpers } from '@/lib/helpers'
import type { Product } from '@/lib/gql/types'

const ProductSlide = ({ product, index }: { product: Product; index: number }) => {
    const name = productGetters.getName(product)
    const imageUrl = productGetters.handleProtocolRelativeUrl(
        productGetters.getCoverImage(product)
    )
    const fullDescription = productGetters.getDescription(product)
    const productCode = productGetters.getProductId(product)
    const { getProductLink } = uiHelpers()

    return (
        <div className="relative h-[450px] md:h-[500px] flex items-center">
            <div className="container mx-auto px-6 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">

                <div className="text-left z-10 flex flex-col items-start justify-center order-2 md:order-1">
                    <h3 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                        {name}
                    </h3>
                    <div className="text-lg text-neutral-300 mb-10 line-clamp-2 max-w-lg font-medium leading-relaxed">
                        {fullDescription}
                    </div>
                    <Link href={getProductLink(productCode)}>
                        <button className="bg-white text-black hover:bg-gray-100 px-10 py-5 text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-lg shadow-xl hover:shadow-2xl cursor-pointer">
                            Discover Now
                        </button>
                    </Link>
                </div>

                <div className="relative h-64 md:h-full w-full order-1 md:order-2 flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/30 rounded-full blur-[100px] transform scale-75" />

                    <div className="relative w-full h-[300px] md:h-[450px]">
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            priority={index === 0}
                            className="object-contain p-6 drop-shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const BannerCarousel = ({ products }: { products: Product[] }) => {
    if (!products || products.length === 0) return null

    const displayProducts = products.slice(0, 4)

    return (    
        <div className="w-[99.5vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-neutral-900 overflow-hidden">
            <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                showIndicators={true}
                interval={4000}
                stopOnHover={true}
                transitionTime={700}
            >
                {displayProducts.map((product, index) => (
                    <ProductSlide key={index} product={product} index={index} />
                ))}
            </Carousel>
        </div>
    )
}

export default BannerCarousel
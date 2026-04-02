import { homePageResultMock } from '@/__mocks__/stories'
import { SandboxProducts } from '@/components/cart'
import KiboHeroCarousel from '@/components/home/Carousel/KiboHeroCarousel'
import getCategoryTree from '@/lib/api/operations/get-category-tree'
import { serverSideTranslations } from '@/lib/helpers/serverSideTranslations'
import DisplayCarousel from '@/components/cart/SandboxProducts/DisplayCarousel'
import type { CategoryTreeResponse, NextPageWithLayout } from '@/lib/types'

import type { GetStaticPropsContext } from 'next'

interface HomePageProps {
  carouselItem: any
}
export async function getStaticProps(context: GetStaticPropsContext) {
  const { locale } = context
  const categoriesTree: CategoryTreeResponse = (await getCategoryTree()) || null

  return {
    props: {
      categoriesTree,
      carouselItem: homePageResultMock,
      ...(await serverSideTranslations(locale as string, ['common'])),
    },
  }
}

import { useGetSandboxProducts } from '@/hooks'
import type { Product } from '@/lib/gql/types'
import BannerCarousel from '@/components/cart/SandboxProducts/DisplayCarousel'
const Home: NextPageWithLayout<HomePageProps> = (props) => {
  const { carouselItem } = props
  const { data } = useGetSandboxProducts({ pageSize: 10 })
const products = (data?.items?.filter((item) => !!item) ?? []) as Product[]


  return (
    <>
      {/* <KiboHeroCarousel carouselItem={carouselItem || []}></KiboHeroCarousel> */}
      <BannerCarousel products={products as Product[]} />
      <SandboxProducts />
      {/* <DisplayCarousel products={products as Product[]} /> */}
      
    </>
  )
}

export default Home

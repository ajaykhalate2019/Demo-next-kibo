import { useQuery } from '@tanstack/react-query'

import { makeGraphQLClient } from '@/lib/gql/client'
//import { searchProductsQuery } from '@/lib/gql/queries'
import { buildProductSearchParams } from '@/lib/helpers/buildProductSearchParams'
import { productSearchResultKeys } from '@/lib/react-query/queryKeys'
import type { CategorySearchParams } from '@/lib/types'
import type { ProductSearchResult } from '@/lib/gql/types'
import sandboxProductSearchQuery from '@/lib/gql/queries/sandboxProductSearchQuery'
import { searchProductsQuery } from '@/lib/gql/queries'

interface UseSandboxProductsParams {
  pageSize?: number
}
interface UseSandboxProductsResult {
  data?: ProductSearchResult
  isLoading: boolean
  isError: boolean
}

const fetchSandboxProducts = async (params: UseSandboxProductsParams) => {
  const searchParams: CategorySearchParams = {
    pageSize: params.pageSize ?? 20,
  } as CategorySearchParams

  const client = makeGraphQLClient()
  const variables = buildProductSearchParams(searchParams)

  if (variables) {
    variables.facetTemplate = ''
    variables.facetHierValue = ''
    variables.facet = ''
    variables.filter = ''
  }

  const response = await client.request({
    document: sandboxProductSearchQuery,
    //document: searchProductsQuery,
    variables,
  })

  return response?.products
}

export const  useGetSandboxProducts = (
  params: UseSandboxProductsParams
): UseSandboxProductsResult => {
  const { data, isLoading, isError } = useQuery({
    queryKey: productSearchResultKeys.searchParams({
      pageSize: params.pageSize,
    } as CategorySearchParams),
    queryFn: () => fetchSandboxProducts(params),
    enabled: true,
  })

  return { data, isLoading, isError }
}

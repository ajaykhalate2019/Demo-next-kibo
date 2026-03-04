import { productCardFragment } from '../fragments/sandboxProduct'

const sandboxProductSearchQuery = /* GraphQL */ `
  query ProductSearch($query: String, $pageSize: Int) {
    products: productSearch(query: $query, pageSize: $pageSize) {
      totalCount
      items {
        ...ProductCard
      }
    }
  }
  ${productCardFragment}
`

export default sandboxProductSearchQuery

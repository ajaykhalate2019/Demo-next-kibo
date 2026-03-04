export const productImageFragment = /* GraphQL */ `
  fragment ProductImage on ProductContent {
    productImages {
      imageUrl
      altText
    }
  }
`

export const productPriceFragment = /* GraphQL */ `
  fragment ProductPrice on Product {
    price {
      price
      salePrice
    }
    priceRange {
      lower {
        price
        salePrice
      }
      upper {
        price
        salePrice
      }
    }
  }
`

export const productInventoryFragment = /* GraphQL */ `
  fragment ProductInventory on Product {
    inventoryInfo {
      onlineStockAvailable
      manageStock
    }
  }
`

export const productCardFragment = /* GraphQL */ `
  fragment ProductCard on Product {
    productCode
    content {
      productName
      productFullDescription
      ...ProductImage
    }
    categories {
      content {
        name
      }
    }
    purchasableState {
      isPurchasable
    }
    ...ProductPrice
    ...ProductInventory
  }
  ${productImageFragment}
  ${productPriceFragment}
  ${productInventoryFragment}
`

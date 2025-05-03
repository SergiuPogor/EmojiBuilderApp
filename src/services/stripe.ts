/**
 * Represents a product available for purchase.
 */
export interface Product {
  /**
   * The ID of the product.
   */
  id: string;
  /**
   * The name of the product.
   */
  name: string;
  /**
   * The price of the product in cents.
   */
  priceCents: number;
  /**
   * The URL of the product image.
   */
  imageUrl: string;
}

/**
 * Asynchronously retrieves a list of available products from Stripe.
 *
 * @returns A promise that resolves to an array of Product objects.
 */
export async function getProducts(): Promise<Product[]> {
  // TODO: Implement this by calling the Stripe API.

  return [
    {
      id: 'premium_pack_1',
      name: 'Animals Pack',
      priceCents: 999,
      imageUrl: '/img/animal_pack.png',
    },
    {
      id: 'premium_pack_2',
      name: 'Fantasy Pack',
      priceCents: 1499,
      imageUrl: '/img/fantasy_pack.png',
    },
  ];
}

/**
 * Asynchronously initiates a checkout session for a given product ID.
 *
 * @param productId The ID of the product to purchase.
 * @returns A promise that resolves to the URL of the checkout page.
 */
export async function initiateCheckout(productId: string): Promise<string> {
  // TODO: Implement this by calling the Stripe API.

  return 'https://checkout.stripe.com/session/123';
}

import { Redis } from '@upstash/redis'

import { Product, createProductFromJSON } from '../providers/my_data_provider';

export const revalidate = 0 // disable cache 

 const redis = new Redis({
    url: "https://eu1-amazed-rodent-40384.upstash.io",
    token: "AZ3AACQgMzhiMzkxMGUtNjNlZS00MTk5LWExOTQtMjEyZjNlYWQzYzMzODhhZWYxMTNjN2M2NGQxY2E3NmQ0OGZiZDY5OWZkMjM=",
 })
  
export async function saveObjectToRedis(data: Product[]): Promise<string | null> {
  console.log("saving object....")
  try {
    const jsonString = JSON.stringify(data);
    const result = await redis.set("products", jsonString); // Set expiration time as needed
    console.log(`upaded  object in redis: ${result}`);
    return result;
  } catch (error) {
    console.error('Error saving object to Redis:', error);
    return null;
  }
}


export async function getAllObjectFromRedis(): Promise<Product[] | null> {
  const jsonProducts = await redis.get('products')
  console.log("geting all objects....")
  if (jsonProducts === null || jsonProducts === undefined) {
    console.error('No data found in Redis under the key "products"');
    return null; // Change this to return null instead of an empty array
  }

  try {
    const str = JSON.stringify(jsonProducts)
    // Parse the JSON data into an array of objects
    const productArray = JSON.parse(str);

    // Use the createProductFromJSON function to create an array of Product objects
    const products = productArray.map((jsonProduct: any) => createProductFromJSON(jsonProduct));

    return products;
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return null; // Change this to return null in case of an error
  }
}



export async function updateRedisData(products: Product[]) {
     console.log("updating object....")

    try {
      // Serialize the data before saving it to Redis
      const serializedData = JSON.stringify(products);
      // Update the Redis data
      // Replace 'yourKey' with your actual Redis key
      await redis.set('products', serializedData);
    } catch (error) {
      console.error('Error updating Redis data:', error);
      // You may want to handle errors or log them as needed
    }
  }

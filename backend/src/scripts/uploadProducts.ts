import { db } from '../config/firebase.config';

// Products data to upload
const products = [
  {
    id: 1,
    name: 'Apple AirPods Pro',
    description: 'Active noise cancellation for immersive sound',
    price: 199,
    brand: 'Apple',
    imageUrl:
      'https://m-cdn.phonearena.com/images/hub/274-wide-two_1200/Apple-AirPods-Pro-3-release-date-predictions-price-specs-and-must-know-features.jpg',
  },
  {
    id: 2,
    name: 'Google Home Mini',
    description: 'Smart speaker with Google Assistant',
    price: 49,
    brand: 'Google',
    imageUrl:
      'https://m-cdn.phonearena.com/images/hub/274-wide-two_1200/Apple-AirPods-Pro-3-release-date-predictions-price-specs-and-must-know-features.jpg',
  },
  {
    id: 3,
    name: 'Samsung Galaxy Buds Live',
    description: 'Wireless earbuds with active noise cancellation',
    price: 169,
    brand: 'Samsung',
    imageUrl:
      'https://m-cdn.phonearena.com/images/hub/274-wide-two_1200/Apple-AirPods-Pro-3-release-date-predictions-price-specs-and-must-know-features.jpg',
  },
  {
    id: 4,
    name: 'Apple Watch Series 7',
    description: 'Always-on Retina display, GPS and cellular',
    price: 399,
    brand: 'Apple',
    imageUrl:
      'https://m-cdn.phonearena.com/images/hub/274-wide-two_1200/Apple-AirPods-Pro-3-release-date-predictions-price-specs-and-must-know-features.jpg',
  },
  {
    id: 5,
    name: 'Apple AirTag',
    description: 'Keep track of your items in the Find My app',
    price: 29,
    brand: 'Apple',
    imageUrl:
      'https://m-cdn.phonearena.com/images/hub/274-wide-two_1200/Apple-AirPods-Pro-3-release-date-predictions-price-specs-and-must-know-features.jpg',
  },
  {
    id: 6,
    name: 'Samsung SmartThings Motion Sensor',
    description: 'Detects movement in your home',
    price: 19,
    brand: 'Samsung',
    imageUrl:
      'https://m-cdn.phonearena.com/images/hub/274-wide-two_1200/Apple-AirPods-Pro-3-release-date-predictions-price-specs-and-must-know-features.jpg',
  },
];

/**
 * Upload products to Firestore
 */
async function uploadProducts() {
  try {
    console.log('Starting product upload to Firestore...');

    // Create a batch write
    const batch = db.batch();

    // Process each product
    for (const product of products) {
      // Create document reference with the product ID
      const productRef = db.collection('products').doc(product.id.toString());

      // Add to batch
      batch.set(productRef, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Added product to batch: ${product.name}`);
    }

    // Commit the batch
    await batch.commit();

    console.log('Successfully uploaded all products to Firestore!');
  } catch (error) {
    console.error('Error uploading products:', error);
  }
}

// Execute the upload
uploadProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to upload products:', error);
    process.exit(1);
  });

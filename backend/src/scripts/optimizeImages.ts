import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import sharp from 'sharp';
import { db } from '../config/firebase.config';

// Initialize Firebase Admin

const bucket = admin.storage().bucket('entrevista-funkol.firebasestorage.app');

// Target size for optimization
const TARGET_SIZE = 500;
const OPTIMIZED_SUFFIX = '_500x500';
const OLD_SUFFIX = '_190x190';

// Process all images in the storage bucket
async function optimizeImages() {
  try {
    console.log('Starting image optimization process...');

    // First, delete any existing 190x190 images
    await deleteOldOptimizedImages();

    // Get list of files in the bucket
    const [files] = await bucket.getFiles();

    // Filter for image files only
    const imageFiles = files.filter((file) => {
      const contentType = file.metadata.contentType;
      return contentType && contentType.startsWith('image/');
    });

    console.log(`Found ${imageFiles.length} images to process`);

    // Process each image
    for (const file of imageFiles) {
      const fileName = file.name;

      // Skip if already optimized or is an old optimized version
      if (
        fileName.includes(OPTIMIZED_SUFFIX) ||
        fileName.includes(OLD_SUFFIX)
      ) {
        console.log(`Skipping already optimized image: ${fileName}`);
        continue;
      }

      // Create temp file paths
      const tempFilePath = path.join(os.tmpdir(), fileName);
      const optimizedFileName = getOptimizedFileName(fileName);
      const optimizedTempPath = path.join(os.tmpdir(), optimizedFileName);

      console.log(`Processing: ${fileName} -> ${optimizedFileName}`);

      try {
        // Download the file
        await file.download({ destination: tempFilePath });

        // Resize the image
        await sharp(tempFilePath)
          .resize(TARGET_SIZE, TARGET_SIZE, {
            fit: 'cover',
            position: 'center',
          })
          .toFile(optimizedTempPath);

        // Upload the optimized image
        await bucket.upload(optimizedTempPath, {
          destination: optimizedFileName,
          metadata: {
            contentType: file.metadata.contentType,
            metadata: {
              optimizedFrom: fileName,
              optimizedSize: `${TARGET_SIZE}x${TARGET_SIZE}`,
            },
          },
        });

        console.log(
          `Successfully optimized and uploaded: ${optimizedFileName}`
        );

        // Update references in Firestore
        await updateImageReferences(fileName, optimizedFileName);

        // Clean up temp files
        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(optimizedTempPath);
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
      }
    }

    console.log('Image optimization process completed!');
  } catch (error) {
    console.error('Error in image optimization process:', error);
  }
}

// Delete old optimized images with 190x190 suffix
async function deleteOldOptimizedImages() {
  try {
    console.log('Deleting old optimized images...');

    // Get list of files in the bucket
    const [files] = await bucket.getFiles();

    // Filter for old optimized images
    const oldOptimizedFiles = files.filter((file) =>
      file.name.includes(OLD_SUFFIX)
    );

    if (oldOptimizedFiles.length === 0) {
      console.log('No old optimized images found');
      return;
    }

    console.log(
      `Found ${oldOptimizedFiles.length} old optimized images to delete`
    );

    // Delete each old optimized image
    for (const file of oldOptimizedFiles) {
      try {
        await file.delete();
        console.log(`Deleted: ${file.name}`);
      } catch (error) {
        console.error(`Error deleting ${file.name}:`, error);
      }
    }

    console.log('Finished deleting old optimized images');
  } catch (error) {
    console.error('Error deleting old optimized images:', error);
  }
}

// Get optimized file name with suffix
function getOptimizedFileName(originalFileName: string): string {
  const extIndex = originalFileName.lastIndexOf('.');
  if (extIndex === -1) return `${originalFileName}${OPTIMIZED_SUFFIX}`;

  const baseName = originalFileName.substring(0, extIndex);
  const extension = originalFileName.substring(extIndex);
  return `${baseName}${OPTIMIZED_SUFFIX}${extension}`;
}

// Update image references in Firestore
async function updateImageReferences(
  originalFileName: string,
  optimizedFileName: string
) {
  try {
    // Get full URLs for both files
    const originalUrl = await getFileUrl(originalFileName);
    const optimizedUrl = await getFileUrl(optimizedFileName);

    if (!originalUrl || !optimizedUrl) {
      console.log('Could not get URLs for file reference updates');
      return;
    }

    // Query products that use the original image URL
    const productsSnapshot = await db
      .collection('products')
      .where('imageUrl', '==', originalUrl)
      .get();

    if (productsSnapshot.empty) {
      console.log('No products found with this image URL');
      return;
    }

    // Update each product reference
    const batch = db.batch();
    productsSnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        imageUrl: optimizedUrl,
        updatedAt: new Date(),
      });
      console.log(`Updated reference in product: ${doc.id}`);
    });

    await batch.commit();
    console.log(
      `Successfully updated ${productsSnapshot.size} product references`
    );
  } catch (error) {
    console.error('Error updating image references:', error);
  }
}

// Get public URL for a file
async function getFileUrl(fileName: string): Promise<string | null> {
  try {
    const file = bucket.file(fileName);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-01-2500', // Far future expiration
    });
    return url;
  } catch (error) {
    console.error(`Error getting URL for ${fileName}:`, error);
    return null;
  }
}

// Run the optimization process
optimizeImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to optimize images:', error);
    process.exit(1);
  });

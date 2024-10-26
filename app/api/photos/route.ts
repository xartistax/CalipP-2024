// app/api/photos/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size'; // Import image-size to get dimensions

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

export async function GET() {
  // Get the path to the galerieImages directory
  const imagesDirectory = path.join(process.cwd(), 'public', 'gallerie');
  
  // Read the directory to get the image files
  const imageFiles = fs.readdirSync(imagesDirectory);

  // Create photo objects for the images
  const photos = imageFiles
    .filter(file => /\.(jpg|jpeg|png|gif)$/.test(file)) // Filter image files
    .map((file) => {
      const asset = `gallerie/${file}`; // Path to the image
      
      try {
        // Get the dimensions of the image
        const dimensions = sizeOf(path.join(imagesDirectory, file));
        const width = dimensions.width;
        const height = dimensions.height;

        // Check if width and height are defined
        if (width && height) {
          const alt = file.split('/').pop() || ""; // Use the asset name as alt text

          return {
            src: `/${asset}`, // Image URL path
            alt,
            width,  // Use actual width
            height, // Use actual height
            srcSet: breakpoints.map((breakpoint) => ({
              src: `/${asset}`, // Image URL path
              width: breakpoint,
              height: Math.round((height / width) * breakpoint), // Maintain aspect ratio
            })),
          };
        } else {
          // Handle the case where dimensions are undefined
          console.warn(`Dimensions for ${file} are undefined.`);
          return null; // Skip this file or provide a default value
        }
      } catch (error) {
        console.error(`Error getting dimensions for ${file}:`, error);
        return null; // Skip this file on error
      }
    })
    .filter((photo): photo is NonNullable<typeof photo> => photo !== null); // Filter out null values

  // Return the photos as a JSON response
  return NextResponse.json(photos);
}

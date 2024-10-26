// app/ImageGalerie.tsx
"use client";
import { useState, useEffect } from "react";
import { ColumnsPhotoAlbum } from "react-photo-album";
import "react-photo-album/columns.css";

import dynamic from "next/dynamic";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

// Dynamically import the Lightbox component
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), {
  ssr: false, // Disable server-side rendering for this component
});

import "yet-another-react-lightbox/styles.css";
import NextJsImage from "./NextJsImage";



export default function ImageGalerie() {
  const [photos, setPhotos] = useState([]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const fetchPhotos = async () => {
      const response = await fetch('/api/photos');
      const data = await response.json();
      setPhotos(data);
    };

    fetchPhotos();
  }, []);

  return (
    <>
      <ColumnsPhotoAlbum
        spacing={7}
        padding={0}
        photos={photos}
        defaultContainerWidth={50}
        onClick={({ index }) => setIndex(index)}
      />

      <Lightbox
        slides={photos.map(photo => ({
          src: photo.src,
          width: photo.width,
          height: photo.height,
          // Optional: Add any blurDataURL or additional props if available
        }))}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Fullscreen, Zoom]}
        render={{ slide: NextJsImage }} // Use the custom NextJsImage component for slides
      />
    </>
  );
}

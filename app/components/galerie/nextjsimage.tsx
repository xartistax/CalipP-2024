import Image from "next/image";
import {
  isImageFitCover,
  isImageSlide,
  SlideImage,
  useLightboxProps,
  useLightboxState,
} from "yet-another-react-lightbox";

// Extend the SlideImage interface to include blurDataURL
interface NextJsImageSlide extends SlideImage {
  blurDataURL?: string; // Add optional blurDataURL property
}

interface NextJsImageProps {
  slide: NextJsImageSlide; // Use the extended slide type
  offset: number; // The offset for the image position
  rect: { width: number; height: number }; // Rectangle containing the dimensions
}

// Function to determine if the slide is a valid Next.js image
function isNextJsImage(slide: SlideImage): slide is NextJsImageSlide {
  return (
    isImageSlide(slide) &&
    typeof slide.width === "number" && // Check that width is a number
    typeof slide.height === "number" // Check that height is a number
  );
}

export default function NextJsImage({ slide, offset, rect }: NextJsImageProps) {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps();

  const { currentIndex } = useLightboxState();

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  // Return null if the slide is not a valid Next.js image
  if (!isNextJsImage(slide)) return null;

  // Use fallback values if slide.width or slide.height is undefined
  const slideWidth = slide.width ?? 0; // Default to 0 if undefined
  const slideHeight = slide.height ?? 0; // Default to 0 if undefined

  const width = !cover
    ? Math.round(
        Math.min(rect.width, (rect.height / slideHeight) * slideWidth)
      )
    : rect.width;

  const height = !cover
    ? Math.round(
        Math.min(rect.height, (rect.width / slideWidth) * slideHeight)
      )
    : rect.height;

  return (
    <div style={{ position: "relative", width, height }}>
      <Image
        fill
        alt={slide.alt || ''} // Ensure you're passing a valid alt text
        src={slide.src} // Ensure you're passing the correct src from the slide
        loading="eager"
        draggable={false}
        placeholder={slide.blurDataURL ? "blur" : undefined} // Use the blurDataURL if available
        style={{
          objectFit: cover ? "cover" : "contain",
          cursor: click ? "pointer" : undefined,
        }}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
        onClick={
          offset === 0 ? () => click?.({ index: currentIndex }) : undefined
        }
      />
    </div>
  );
}

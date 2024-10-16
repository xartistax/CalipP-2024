// src/react-pixelify.d.ts
declare module 'react-pixelify' {
    export interface PixelifyProps {
      src: string;
      pixelSize: number;
      width: number;
      height: number; 
      style?: React.CSSProperties;
    }
  
    export const Pixelify: React.FC<PixelifyProps>;
  }
  
declare module 'qrcode' {
    export function toDataURL(
      text: string,
      options?: {
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
        version?: number;
        maskPattern?: number;
        margin?: number;
        scale?: number;
        width?: number;
        color?: {
          dark?: string; // Dark color in hex format, e.g., '#000000'
          light?: string; // Light color in hex format, e.g., '#ffffff'
        };
      }
    ): Promise<string>;
  
    export function toCanvas(
      canvas: HTMLCanvasElement,
      text: string,
      options?: {
        errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
        version?: number;
        maskPattern?: number;
        margin?: number;
        scale?: number;
        width?: number;
        color?: {
          dark?: string; // Dark color in hex format, e.g., '#000000'
          light?: string; // Light color in hex format, e.g., '#ffffff'
        };
      }
    ): Promise<void>;
  }
  
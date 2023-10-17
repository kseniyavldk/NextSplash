export interface Photo {
  id: string;
  alt_description: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
}

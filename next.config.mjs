/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["multer", "pdfjs-dist", "tesseract.js", "sharp", "canvas"]
  }
};

export default nextConfig;

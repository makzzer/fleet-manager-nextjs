/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
      // Ignorar los errores de TypeScript durante la build
      ignoreBuildErrors: true,
    },
    eslint: {
      // Ignorar los errores de ESLint durante la build
      ignoreDuringBuilds: true,
    },
  };
  
  export default nextConfig;
  
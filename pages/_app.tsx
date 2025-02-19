// pages/_app.tsx
import { AuthProvider } from "../src/app/context/AuthContext"; // Adjust the import path as needed
import type { AppProps } from "next/app"; // Import AppProps

// Define custom page props (if needed)
type CustomPageProps = {
  customProp: string;
};

// Extend AppProps with custom page props
function MyApp({ Component, pageProps }: AppProps<CustomPageProps>) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
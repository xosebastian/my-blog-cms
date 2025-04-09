import Header from "@/components/header";
import ReactQueryProvider from "@/lib/react-query-provider";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "sonner";

/**
 * The main application component.
 *
 * This component wraps the entire application and provides necessary context providers and layouts.
 * It conditionally renders the Header component based on the current route.
 *
 * @param {AppProps} props - The properties passed by Next.js for the app component.
 * @returns {JSX.Element} The rendered component, which includes the header, page content, and toaster notification.
 */
export default function App({ Component, pageProps }: AppProps) {
  // Access the router to check the current route
  const router = useRouter();

  // List of routes where the header should not be shown
  const noHeaderPages = ["/auth/login", "/auth/register"];

  // Check if the current route is one of the pages that should hide the header
  const showHeader = !noHeaderPages.includes(router.pathname);

  return (
    <ReactQueryProvider>
      {showHeader && <Header />}{" "}
      {/* Conditionally render the Header based on the route */}
      <main className="container mx-auto px-4 py-8">
        {/* Render the main content of the page */}
        <Component {...pageProps} />
      </main>
      <Toaster richColors position="top-center" />{" "}
      {/* Display toaster notifications */}
    </ReactQueryProvider>
  );
}

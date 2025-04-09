'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * A React component that provides the React Query client context to the application.
 * 
 * This component wraps its children with the `QueryClientProvider` from React Query,
 * allowing any child component to access the React Query client and use its hooks
 * to fetch and manage data asynchronously.
 *
 * @component
 * @example
 * // Usage:
 * <ReactQueryProvider>
 *   <YourComponent />
 * </ReactQueryProvider>
 * 
 * @param {object} props - The component's props.
 * @param {ReactNode} props.children - The child components to render inside the QueryClientProvider.
 * 
 * @returns {JSX.Element} A provider component that wraps the application with React Query's context.
 */
export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

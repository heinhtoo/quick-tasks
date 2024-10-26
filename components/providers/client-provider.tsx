/**
 * Author: Hein Htoo
 * Created Date: 2024-10-23
 * Jira Ticket: QTS-1
 *
 * Purpose:
 *   Query provider for react-query
 *
 */
"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export default ClientProvider;

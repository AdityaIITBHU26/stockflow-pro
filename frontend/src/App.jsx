import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/layout/Layout'
import { lazy, Suspense } from 'react'
import Skeleton from './components/ui/Skeleton'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Products = lazy(() => import('./pages/Products'))
const Customers = lazy(() => import('./pages/Customers'))
const Orders = lazy(() => import('./pages/Orders'))
const OrderDetails = lazy(() => import('./pages/OrderDetails'))
const Profile = lazy(() => import('./pages/Profile'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Suspense fallback={<Skeleton className="h-screen" />}><Dashboard /></Suspense>} />
              <Route path="/products" element={<Suspense fallback={<Skeleton className="h-screen" />}><Products /></Suspense>} />
              <Route path="/customers" element={<Suspense fallback={<Skeleton className="h-screen" />}><Customers /></Suspense>} />
              <Route path="/orders" element={<Suspense fallback={<Skeleton className="h-screen" />}><Orders /></Suspense>} />
              <Route path="/orders/:id" element={<Suspense fallback={<Skeleton className="h-screen" />}><OrderDetails /></Suspense>} />
              <Route path="/profile" element={<Suspense fallback={<Skeleton className="h-screen" />}><Profile /></Suspense>} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'text-sm',
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App

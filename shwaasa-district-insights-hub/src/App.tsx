
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ThemeProvider } from "@/components/theme-provider";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import Login from './pages/Login';
// import ProtectedRoute from './components/ProtectedRoute';

// const queryClient = new QueryClient();



// const App = () => (
//   <ThemeProvider>
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             <Route path="/login" element={<Login />} />
// <Route
//   path="/dashboard"
//   element={
//     <ProtectedRoute>
//       <Index />
//     </ProtectedRoute>
//   }
// />
//             <Route path="/" element={<Index />} />

//             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </QueryClientProvider>
//   </ThemeProvider>
// );

// export default App;
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Index from "./pages/Index"; // Your dashboard page
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider>
    <Routes>
      {/* Default route redirects to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />

      {/* Optional: Catch-all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </ThemeProvider>
  );
}

export default App;

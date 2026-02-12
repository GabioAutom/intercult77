import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import APropos from "./pages/APropos";
import Activites from "./pages/Activites";
import Lieux from "./pages/Lieux";
import Medias from "./pages/Medias";
import Liens from "./pages/Liens";
import Contact from "./pages/Contact";
import MediasAdmin from "./pages/MediasAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/activites" element={<Activites />} />
          <Route path="/lieux" element={<Lieux />} />
          <Route path="/medias" element={<Medias />} />
          <Route path="/medias/admin" element={<MediasAdmin />} />
          <Route path="/liens" element={<Liens />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

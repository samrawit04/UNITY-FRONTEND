import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/auth/home";
import NotFound from "./pages/NotFound";
import Register from "./pages/auth/RegisterAs";
import Login from "./pages/auth/Login";
import CounselorRegister from "./pages/counselor/counselor-complete-profile";
import EmailVerification from "./pages/auth/EmailVerification";
import ClientCompleteProfile from "./pages/client/ClientProfile";
import ClientProfileNext from "./pages/client/Client-complete-profile";
import ClientDashboard from "./pages/client/ClientDashboard";
import CounselorPosts from "./pages/client/CounselorPosts";
import CounselorDashboard from "./pages/counselor/CounselorDashboard";
import CounselorProfile from "./pages/counselor/CounelorDetail";
import CounselorSchedule from "./pages/counselor/CounselorSchedule";
import CounselorFeedback from "./pages/client/CounselorFeedback";
import FinalSessionSet from "./pages/FinalSessionSet";
import CounselorArticles from "./pages/counselor/CounselorArticles";
import BookingSession from "./pages/client/BookSession";
import UserRegister from "./pages/auth/signup";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetSuccess from "./pages/auth/ResetPasswordSuccess";
import ResetPasswordForm from "./pages/auth/ResetPasswordForm";
import Calendar from "./pages/counselor/Calendar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<Index />} />
            <Route path="/therapist" element={<Index />} />
            <Route path="/services" element={<Index />} />
            <Route path="/select-role" element={<Register />} />
            <Route path="/signup" element={<UserRegister />} />
            <Route
              path="/counselor/complete-profile"
              element={<CounselorRegister />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-success" element={<ResetSuccess />} />
            <Route path="/reset-form" element={<ResetPasswordForm />} />
            <Route path="/verify-email" element={<EmailVerification />} />{" "}
            <Route path="/client-profile" element={<ClientCompleteProfile />} />
            <Route
              path="/client-profile-next"
              element={<ClientProfileNext />}
            />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/counselor-posts" element={<CounselorPosts />} />
            <Route
              path="/counselor-dashboard"
              element={<CounselorDashboard />}
            />
            <Route path="/counselor-profile" element={<CounselorProfile />} />
            <Route path="/counselor-schedule" element={<CounselorSchedule />} />
            <Route path="/counselor-feedback" element={<CounselorFeedback />} />
            <Route path="/final-session-set" element={<FinalSessionSet />} />
            <Route path="/counselor-articles" element={<CounselorArticles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/book-session" element={<BookingSession />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

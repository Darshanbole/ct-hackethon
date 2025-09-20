import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Home from "./components/home";
import AuthForm from "./components/AuthForm";
import Web3Wallet from "./components/wallet/Web3Wallet";
import EnhancedWeb3WalletFixed from "./components/wallet/EnhancedWeb3WalletFixed";
import SocialMediaHub from "./components/SocialMediaHub";
import DecentralizedTwitter from "./components/social/DecentralizedTwitter";
import MultiPlatformSocialHub from "./components/social/MultiPlatformSocialHub";
import CrossPlatformSocialHub from "./components/social/CrossPlatformSocialHub";
import EnhancedMultiPlatformPosting from "./components/social/EnhancedMultiPlatformPosting";
import AnonymousFeedbackBox from "./components/social/AnonymousFeedbackBox";
import NFTTicketingSystem from "./components/social/NFTTicketingSystem";
import GroupSavingsPools from "./components/social/GroupSavingsPools";
import CommunityVoting from "./components/social/CommunityVoting";
import { ThemeProvider } from "./contexts/ThemeContext";
import { authAPI } from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const savedUser = authAPI.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={user ? <Home user={user} onLogout={handleLogout} /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/home" element={user ? <Home user={user} onLogout={handleLogout} /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/wallet" element={user ? <EnhancedWeb3WalletFixed /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/social" element={user ? <SocialMediaHub /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
            <Route path="/social/twitter" element={user ? <DecentralizedTwitter /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/social/hub" element={user ? <MultiPlatformSocialHub /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/social/cross-platform" element={user ? <CrossPlatformSocialHub userWallet={user?.wallet_address} /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/social/multiplatform" element={user ? <EnhancedMultiPlatformPosting userWallet={user?.wallet_address} /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/social/feedback" element={user ? <AnonymousFeedbackBox userWallet={user?.wallet_address} /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/social/tickets" element={user ? <NFTTicketingSystem userWallet={user?.wallet_address} /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/social/savings" element={user ? <GroupSavingsPools userWallet={user?.wallet_address} /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
          <Route path="/social/voting" element={user ? <CommunityVoting userWallet={user?.wallet_address} /> : <AuthForm onAuthSuccess={handleAuthSuccess} />} />
        </Routes>
      </>
    </Suspense>
    </ThemeProvider>
  );
}

export default App;
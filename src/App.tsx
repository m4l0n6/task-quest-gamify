
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import { BadgeProvider } from "./contexts/BadgeContext";
import { LeaderboardProvider } from "./contexts/LeaderboardContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import TasksPage from "./pages/TasksPage";
import BadgesPage from "./pages/BadgesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TaskProvider>
          <BadgeProvider>
            <LeaderboardProvider>
              <NotificationProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<AppLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="tasks" element={<TasksPage />} />
                      <Route path="badges" element={<BadgesPage />} />
                      <Route path="leaderboard" element={<LeaderboardPage />} />
                      <Route path="notifications" element={<NotificationsPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </NotificationProvider>
            </LeaderboardProvider>
          </BadgeProvider>
        </TaskProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

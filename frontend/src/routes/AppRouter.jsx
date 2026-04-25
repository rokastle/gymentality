import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import ClubsPage from "../pages/ClubsPage";
import MembershipPage from "../pages/MembershipPage";
import WorkoutPage from "../pages/WorkoutPage";
import FacilitiesPage from "../pages/FacilitiesPage";
import ClassesPage from "../pages/ClassesPage";
import NotFoundPage from "../pages/NotFoundPage";
import ClubDetailPage from "../pages/ClubDetailPage";
import SignUpMembershipPage from "../pages/SignUpMembershipPage";
import SignUpWorkoutPage from "../pages/SignUpWorkoutPage";
import SignUpDetailsPage from "../pages/SignUpDetailsPage";
import SignUpCompletePage from "../pages/SignUpCompletePage";
import ScrollToTop from "./ScrollToTop";
import PrivateRoute from "./PrivateRoute";
import MyMembershipPage from "../pages/MyMembershipPage";
import NotificationsPage from "../pages/NotificationsPage";
import ProfilePage from "../pages/MyProfilePage";
import MyWorkoutPlanPage from "../pages/MyWorkoutPlanPage";
import ChangeMyMembershipPage from "../pages/ChangeMyMembershipPage";
import ChangeMyWorkoutPlanPage from "../pages/ChangeMyWorkoutPlanPage";
import BookClassPage from "../pages/BookClassPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/facilities/:clubId" element={<ClubDetailPage />} />

          <Route path="/signup/membership" element={<SignUpMembershipPage />} />
          <Route path="/signup/workout" element={<SignUpWorkoutPage />} />
          <Route path="/signup/details" element={<SignUpDetailsPage />} />
          <Route path="/signup/complete" element={<SignUpCompletePage />} />

          <Route
            path="/account/book-class"
            element={
              <PrivateRoute>
                <BookClassPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/account/membership"
            element={
              <PrivateRoute>
                <MyMembershipPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/account/membership/change"
            element={
              <PrivateRoute>
                <ChangeMyMembershipPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/account/workout"
            element={
              <PrivateRoute>
                <MyWorkoutPlanPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/account/workout/change"
            element={
              <PrivateRoute>
                <ChangeMyWorkoutPlanPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/account/notifications"
            element={
              <PrivateRoute>
                <NotificationsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/account/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
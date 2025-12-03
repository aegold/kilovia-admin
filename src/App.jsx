import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "@shared/context/AuthContext";
import { ToastProvider } from "@shared/components/Toast";
import ProtectedRoute from "@shared/components/ProtectedRoute";
import SessionExpiryHandler from "@shared/components/SessionExpiryHandler";
import { LoginPage } from "@modules/auth";
import QuestionCreator from "@modules/question-creator";
import QuestionList from "@modules/question-list";
import TopicManager from "@modules/topic-manager";
import AdminManager from "@modules/admin-manager";
import AuditLogs from "@modules/audit-logs";
import SharedNavbar from "@shared/components/SharedNavbar";
import { ROLES } from "@shared/constants/roles";
import "./App.css";

// Layout wrapper component to conditionally show navbar
function Layout({ children }) {
  const location = useLocation();

  // Don't show navbar on login page
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <SharedNavbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <SessionExpiryHandler />
          <Layout>
            <Routes>
              {/* Public Route - Login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/quan-ly-cau-hoi" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quan-ly-bai-tap"
                element={
                  <ProtectedRoute>
                    <QuestionCreator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quan-ly-cau-hoi"
                element={
                  <ProtectedRoute>
                    <QuestionList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quan-ly-chu-de"
                element={
                  <ProtectedRoute>
                    <TopicManager />
                  </ProtectedRoute>
                }
              />

              {/* SUPER_ADMIN Only Routes */}
              <Route
                path="/quan-ly-admin"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <AdminManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/nhat-ky-hoat-dong"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />

              {/* 404 Not Found */}
              <Route
                path="*"
                element={
                  <div className="not-found">
                    <h1>404 - Không tìm thấy trang</h1>
                    <Link to="/quan-ly-cau-hoi">
                      ← Quay về trang quản lý câu hỏi
                    </Link>
                  </div>
                }
              />
            </Routes>
          </Layout>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

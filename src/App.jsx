import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import QuestionCreator from "@modules/question-creator";
import QuestionList from "@modules/question-list";
import TopicManager from "@modules/topic-manager";
import SharedNavbar from "@shared/components/SharedNavbar";
import "./App.css";

// Layout wrapper component to conditionally show navbar
function Layout({ children }) {
  const location = useLocation();
  // Always show navbar now since we removed home page
  return (
    <>
      <SharedNavbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/quan-ly-cau-hoi" replace />}
          />
          <Route path="/quan-ly-bai-tap" element={<QuestionCreator />} />
          <Route path="/quan-ly-cau-hoi" element={<QuestionList />} />
          <Route path="/quan-ly-chu-de" element={<TopicManager />} />
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
    </BrowserRouter>
  );
}

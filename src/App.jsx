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

// Home Dashboard Component
function HomePage() {
  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <h1 className="home-title">🎓 Kilovia Admin Portal</h1>
          <p className="home-subtitle">
            Hệ thống quản lý câu hỏi và nội dung học tập
          </p>
        </header>

        <div className="home-cards">
          {/* Question Creator Card */}
          <Link to="/quan-ly-bai-tap" className="home-card">
            <div className="card-icon">✏️</div>
            <h2 className="card-title">Tạo Câu Hỏi</h2>
            <p className="card-description">
              Tạo và chỉnh sửa câu hỏi với 7 dạng bài khác nhau
            </p>
            <div className="card-features">
              <span className="feature-tag">Trắc nghiệm</span>
              <span className="feature-tag">Điền chỗ trống</span>
              <span className="feature-tag">Biểu thức</span>
            </div>
            <div className="card-action">Bắt đầu tạo →</div>
          </Link>

          {/* Question List Card */}
          <Link to="/quan-ly-cau-hoi" className="home-card">
            <div className="card-icon">📋</div>
            <h2 className="card-title">Quản Lý Câu Hỏi</h2>
            <p className="card-description">
              Xem, tìm kiếm và quản lý tất cả câu hỏi đã tạo
            </p>
            <div className="card-features">
              <span className="feature-tag">Bộ lọc nâng cao</span>
              <span className="feature-tag">Phân trang</span>
              <span className="feature-tag">Xem trước</span>
            </div>
            <div className="card-action">Xem danh sách →</div>
          </Link>

          {/* Topic Manager Card */}
          <Link to="/quan-ly-chu-de" className="home-card">
            <div className="card-icon">📚</div>
            <h2 className="card-title">Quản Lý Chủ Đề</h2>
            <p className="card-description">
              Tổ chức Topics và SubTopics cho hệ thống phân cấp
            </p>
            <div className="card-features">
              <span className="feature-tag">Topics</span>
              <span className="feature-tag">SubTopics</span>
              <span className="feature-tag">Phân cấp</span>
            </div>
            <div className="card-action">Quản lý chủ đề →</div>
          </Link>
        </div>

        <footer className="home-footer">
          <div className="footer-stats">
            <div className="stat-item">
              <div className="stat-number">3</div>
              <div className="stat-label">Modules</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">7</div>
              <div className="stat-label">Dạng câu hỏi</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Khả năng</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Layout wrapper component to conditionally show navbar
function Layout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isHomePage && <SharedNavbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quan-ly-bai-tap" element={<QuestionCreator />} />
          <Route path="/quan-ly-cau-hoi" element={<QuestionList />} />
          <Route path="/quan-ly-chu-de" element={<TopicManager />} />
          <Route
            path="*"
            element={
              <div className="not-found">
                <h1>404 - Không tìm thấy trang</h1>
                <Link to="/">← Quay về trang chủ</Link>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

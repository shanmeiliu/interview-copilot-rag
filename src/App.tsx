import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./app/ProtectedRoute";
import PublicChatPage from "./pages/public/PublicChatPage";
import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import KnowledgePage from "./pages/admin/KnowledgePage";
import IngestionPage from "./pages/admin/IngestionPage";
import SettingsPage from "./pages/admin/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicChatPage />} />
      <Route path="/chat/:id" element={<PublicChatPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/knowledge" replace />} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="ingestion" element={<IngestionPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell.tsx";
import ChatPage from "./components/chat/ChatPage.tsx";
import KnowledgePage from "./pages/KnowledgePage.tsx";
import IngestionPage from "./pages/IngestionPage.tsx";
import SettingsPage from "./pages/SettingsPage.tsx";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/chat/default" replace />} />
        <Route path="/chat/:id" element={<ChatPage />} />
        <Route path="/knowledge" element={<KnowledgePage />} />
        <Route path="/ingestion" element={<IngestionPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppShell>
  );
}
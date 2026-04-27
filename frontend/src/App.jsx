import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AskDocuments from './pages/AskDocuments';
import UploadPage from './pages/UploadPage';
import DocumentLibrary from './pages/DocumentLibrary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="ask" element={<AskDocuments />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="library" element={<DocumentLibrary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

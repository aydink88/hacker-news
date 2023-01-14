import Navbar from "./containers/Navbar";
import ArticleList from "./containers/ArticleList";
import Footer from "./containers/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ArticlePage from "./containers/ArticlePage";
import AuthPage from "./containers/AuthPage";
import SubmitPage from "./containers/SubmitPage";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <div className="App">
        <div className="container">
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/" element={<ArticleList />} />
            </Routes>
          </BrowserRouter>
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;

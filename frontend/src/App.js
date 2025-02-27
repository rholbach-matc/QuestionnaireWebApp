import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import QuestionnaireForm from "./components/QuestionnaireForm";
import ResponsesList from "./components/ResponsesList";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <header>
          <nav>
            <h1>Phish Company Questionnaire</h1>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/responses">View Responses</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<QuestionnaireForm />} />
            <Route path="/responses" element={<ResponsesList />} />
          </Routes>
        </main>

        <footer>
          <p>&copy; {new Date().getFullYear()} Phish Company - Process Improvement Initiative</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
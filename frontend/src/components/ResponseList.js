import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ResponsesList.css";

const ResponsesList = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/responses");
      
      if (response.data.success) {
        setResponses(response.data.responses);
        
        // Extract unique departments for filtering
        const uniqueDepartments = [...new Set(
          response.data.responses.map(resp => resp.department)
        )].filter(Boolean);
        
        setDepartments(uniqueDepartments);
      } else {
        setError("Failed to fetch responses");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching responses:", err);
      setError("Error connecting to the server. Please try again later.");
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredResponses = responses.filter(response => {
    const matchesSearch = 
      response.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(response.answers).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      filterDepartment === "" || 
      response.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  if (loading) {
    return <div className="loading-spinner">Loading responses...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (responses.length === 0) {
    return <div className="no-responses">No questionnaire responses submitted yet.</div>;
  }

  return (
    <div className="responses-container">
      <h1>Questionnaire Responses</h1>
      
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search responses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="department-filter">
          <select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="responses-count">
        Showing {filteredResponses.length} of {responses.length} responses
      </div>
      
      <div className="responses-list">
        {filteredResponses.map((response) => (
          <div 
            key={response.id} 
            className={`response-card ${expandedId === response.id ? 'expanded' : ''}`}
          >
            <div className="response-header" onClick={() => toggleExpand(response.id)}>
              <h3>{response.name}</h3>
              <div className="response-meta">
                <span>{response.department} • {response.position}</span>
                <span className="response-date">{formatDate(response.submitted_at)}</span>
              </div>
              <div className="expand-icon">{expandedId === response.id ? '▼' : '►'}</div>
            </div>
            
            {expandedId === response.id && (
              <div className="response-details">
                <div className="personal-info">
                  <p><strong>Email:</strong> {response.email}</p>
                </div>
                
                <div className="answers-container">
                  <h4>Questionnaire Answers</h4>
                  
                  {Object.entries(response.answers).map(([questionId, answer]) => {
                    // Find the question text based on the ID
                    let questionText = "Unknown Question";
                    let category = "";
                    
                    // This assumes your questions structure is available here
                    // In a real app, you might want to fetch this from the server
                    // or maintain it in a context/state
                    const questionCategories = [
                      "Core Process Efficiency",
                      "Systems & Technology",
                      "Data & Reporting",
                      "Communication & Workflow"
                    ];
                    
                    // For demonstration, we'll use a simplified mapping
                    if (questionId.startsWith('q')) {
                      const num = parseInt(questionId.substring(1));
                      if (num <= 5) category = questionCategories[0];
                      else if (num <= 10) category = questionCategories[1];
                      else if (num <= 15) category = questionCategories[2];
                      else category = questionCategories[3];
                      
                      // This is a simplified way to get question text
                      // In a real app, you'd probably have this data available
                      questionText = `Question ${num}`;
                    }
                    
                    return (
                      <div key={questionId} className="answer-item">
                        <div className="question-category">{category}</div>
                        <div className="question-text">{questionText}</div>
                        <div className="answer-text">{answer || "No answer provided"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsesList;
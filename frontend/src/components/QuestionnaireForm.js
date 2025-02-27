import React, { useState } from "react";
import axios from "axios";
import "./QuestionnaireForm.css"; // We'll create this CSS file later

const QuestionnaireForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        position: "",
        department: "",
        answers: {},
    });
    
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const questions = [
        {
            category: "Core Process Efficiency",
            items: [
                {
                    id: "q1",
                    text: "What are the biggest challenges you face in your daily work?",
                    type: "text"
                },
                {
                    id: "q2",
                    text: "What tasks do you spend the most time doing manually that feel repetitive?",
                    type: "text"
                },
                {
                    id: "q3",
                    text: "If you could automate any one part of your job, what would it be?",
                    type: "text"
                },
                {
                    id: "q4",
                    text: "Are there any paper-based processes that you think could be digitized?",
                    type: "text"
                },
                {
                    id: "q5",
                    text: "What's the biggest bottleneck in your day-to-day tasks?",
                    type: "text"
                },
            ]
        },
        {
            category: "Systems & Technology",
            items: [
                {
                    id: "q6",
                    text: "How do you currently use software systems in your role?",
                    type: "text"
                },
                {
                    id: "q7",
                    text: "What's your biggest frustration with the current software tools?",
                    type: "text"
                },
                {
                    id: "q8",
                    text: "How often do you experience technical issues, like system crashes or connectivity problems?",
                    type: "text"
                },
                {
                    id: "q9",
                    text: "Are there any workarounds you regularly use because a tool isn't working as it should?",
                    type: "text"
                },
                {
                    id: "q10",
                    text: "How much time do you spend entering the same information into different systems?",
                    type: "text"
                },
            ]
        },
        {
            category: "Data & Reporting",
            items: [
                {
                    id: "q11",
                    text: "What information do you need regularly but find difficult to access quickly?",
                    type: "text"
                },
                {
                    id: "q12",
                    text: "Are there any reports or calculations you have to compile manually?",
                    type: "text"
                },
                {
                    id: "q13",
                    text: "How do you currently track and share information about [shipments/inventory/production]?",
                    type: "text"
                },
                {
                    id: "q14",
                    text: "Do you face any challenges in accessing real-time data? How would faster or more accessible data help your role?",
                    type: "text"
                },
                {
                    id: "q15",
                    text: "Where do you get the data for your reports, and is it always readily available?",
                    type: "text"
                },
            ]
        },
        {
            category: "Communication & Workflow",
            items: [
                {
                    id: "q16",
                    text: "What communication bottlenecks do you experience between departments?",
                    type: "text"
                },
                {
                    id: "q17",
                    text: "How do you share information with other departments?",
                    type: "text"
                },
                {
                    id: "q18",
                    text: "How does your department handle communication and task delegation? Do you think this process could be improved?",
                    type: "text"
                },
            ]
        }
    ];

    // Fixed the template literal syntax error
    const handleChange = (questionId, value) => {
        setFormData((prev) => ({
            ...prev,
            answers: { ...prev.answers, [questionId]: value },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        try {
            const response = await axios.post("http://localhost:5000/submit-response", formData);
            console.log("Success:", response.data);
            setSubmitted(true);
            // Reset form after successful submission
            setFormData({
                name: "",
                email: "",
                position: "",
                department: "",
                answers: {},
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            setError("Submission failed. Please try again.");
        }
    };

    if (submitted) {
        return (
            <div className="success-message">
                <h2>Thank you for your submission!</h2>
                <p>Your responses have been recorded successfully.</p>
                <button onClick={() => setSubmitted(false)}>Submit Another Response</button>
            </div>
        );
    }

    return (
        <div className="questionnaire-container">
            <h1>Process Improvement Questionnaire</h1>
            <p className="form-description">
                Help us identify opportunities to improve our processes and systems by completing this questionnaire.
                Your input is valuable in making our workplace more efficient.
            </p>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="personal-info-section">
                    <h2>Personal Information</h2>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="position">Position/Title</label>
                        <input
                            id="position"
                            type="text"
                            placeholder="Your Position"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <input
                            id="department"
                            type="text"
                            placeholder="Your Department"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            required
                        />
                    </div>
                </div>
                
                {questions.map((category) => (
                    <div key={category.category} className="question-category">
                        <h2>{category.category}</h2>
                        {category.items.map((question) => (
                            <div key={question.id} className="question-item">
                                <label htmlFor={question.id}>{question.text}</label>
                                <textarea
                                    id={question.id}
                                    placeholder="Your answer"
                                    value={formData.answers[question.id] || ""}
                                    onChange={(e) => handleChange(question.id, e.target.value)}
                                    rows={3}
                                />
                            </div>
                        ))}
                    </div>
                ))}
                
                <div className="submit-section">
                    <button type="submit" className="submit-button">Submit Questionnaire</button>
                </div>
            </form>
        </div>
    );
};

export default QuestionnaireForm;
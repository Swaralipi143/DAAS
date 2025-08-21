import React, { useEffect, useState } from "react";
import "./Conference.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Conference = () => {
  const [conferences, setConferences] = useState([]);
  const [userPapers, setUserPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [selectedConference, setSelectedConference] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [newConference, setNewConference] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });

  const token = localStorage.getItem("token");
  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/conference`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConferences(res.data);
      } catch (err) {
        console.error("Error fetching conferences", err);
      }
    };

    const fetchApprovedPapers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/publications/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const approved = res.data.filter(
          (paper) => paper.status.toLowerCase() === "approved"
        );
        setUserPapers(approved);
      } catch (err) {
        console.error("Error fetching user papers", err);
      }
    };

    const role = localStorage.getItem("userRole") || "author";
    setIsAdmin(role === "admin");

    if (token) {
      fetchConferences();
      if (role !== "admin") fetchApprovedPapers();
    }
  }, [token]);

  const handleCreateConference = async () => {
    const { name, date, location, description } = newConference;

    if (!name || !date || !location || !description) {
      alert("Please fill in all the fields");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/conference`,
        newConference,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConferences((prev) => [...prev, res.data]);
      setNewConference({ name: "", date: "", location: "", description: "" });
      alert("Conference created successfully!");
    } catch (err) {
      console.error("Error creating conference", err);
      alert("Failed to create conference");
    }
  };

  const handleSubmit = async () => {
    if (!selectedPaper || !selectedConference) return;

    try {
      await axios.post(
        `${API_BASE_URL}/conference/submit`,
        {
          paperId: selectedPaper,
          conferenceId: selectedConference,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Paper submitted to the conference!");
      setSelectedPaper("");
      setSelectedConference("");
    } catch (err) {
      console.error("Error submitting paper", err);
      alert("Failed to submit paper");
    }
  };

  const isLoggedIn = !!token;

  return (
    <div className="conference">
      <h2 className="conference-heading">Upcoming Conferences</h2>

      {!isLoggedIn ? (
        <div className="conference-container">
          <div className="login-message">
            Please <Link to="/login">log in</Link> to see upcoming conferences.
          </div>
        </div>
      ) : (
        <div className="conference-list">
          {conferences.length === 0 ? (
            <p className="no-conference-msg">
              No conferences available yet. Check back soon!
            </p>
          ) : (
            conferences.map((conf) => (
              <div key={conf._id} className="conference-card">
                <h3>{conf.name}</h3>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(conf.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Location:</strong> {conf.location}
                </p>
                <p>
                  <strong>Description:</strong> {conf.description}
                </p>
                {!isAdmin && (
                  <button
                    className="submit-btn"
                    onClick={() => setSelectedConference(conf._id)}
                  >
                    Submit Paper
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Admin - Create Conference */}
      {isAdmin && (
        <div className="create-conference-form">
          <h3>Add New Conference</h3>
          <input
            type="text"
            placeholder="Conference Name"
            value={newConference.name}
            onChange={(e) =>
              setNewConference({ ...newConference, name: e.target.value })
            }
          />
          <input
            type="date"
            value={newConference.date}
            onChange={(e) =>
              setNewConference({ ...newConference, date: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Location"
            value={newConference.location}
            onChange={(e) =>
              setNewConference({ ...newConference, location: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            value={newConference.description}
            onChange={(e) =>
              setNewConference({ ...newConference, description: e.target.value })
            }
          />
          <button className="create-btn" onClick={handleCreateConference}>
            Create Conference
          </button>
        </div>
      )}

      {/* Author - Submit Paper */}
      {!isAdmin && selectedConference && (
        <div className="submission-form">
          <h3>
            Submit to{" "}
            {conferences.find((c) => c._id === selectedConference)?.name}
          </h3>
          {userPapers.length === 0 ? (
            <p>You have no approved papers to submit.</p>
          ) : (
            <>
              <select
                value={selectedPaper}
                onChange={(e) => setSelectedPaper(e.target.value)}
              >
                <option value="">Select your approved paper</option>
                {userPapers.map((paper) => (
                  <option key={paper._id} value={paper._id}>
                    {paper.title}
                  </option>
                ))}
              </select>
              <button className="submit-btn" onClick={handleSubmit} disabled={!selectedPaper}>
                Submit
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Conference;

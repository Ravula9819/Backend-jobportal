import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [jobsApplied, setJobsApplied] = useState(0);
  const [internsApplied, setInternsApplied] = useState(0);
  const [savedApps, setSavedApps] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobListings, setJobListings] = useState([]);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const BASE_URL = 'https://job-portal-production-6a86.up.railway.app';

  useEffect(() => {
    const email = localStorage.getItem('userEmail');

    fetch(`${BASE_URL}/api/jobs`)
      .then(res => res.json())
      .then(data => setJobListings(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Jobs fetch error:', err);
        setJobListings([]);
      });

    if (email) {
      fetch(`${BASE_URL}/api/auth/users/${email}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUserData(data.user);
            setJobsApplied(data.user.jobsApplied || 0);
            setInternsApplied(data.user.internsApplied || 0);
            setSavedApps(data.user.savedApplications?.length || 0);
          } else {
            console.error('User fetch failed:', data.message);
          }
        })
        .catch(err => console.error('User fetch error:', err));
    }
  }, []);

  const handleApply = async (item) => {
    const email = localStorage.getItem('userEmail');
    const type = item.type;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/increment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type })
      });
      const data = await res.json();
      if (data.success) {
        if (type === 'job') setJobsApplied(prev => prev + 1);
        else setInternsApplied(prev => prev + 1);
        alert(`Applied to ${item.position} at ${item.name}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to apply');
    }
  };

  const handleSave = async (item) => {
    const email = localStorage.getItem('userEmail');
    const jobId = item.id;

    if (userData?.savedApplications?.includes(jobId)) {
      alert('Already saved this job.');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/save-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, jobId }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedApps(prev => prev + 1);
        alert(`${item.position} at ${item.name} saved successfully!`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save application');
    }
  };

  const handleDelete = async (jobId) => {
    const email = localStorage.getItem("userEmail");
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${BASE_URL}/${jobId}?email=${email}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        alert("Job deleted successfully!");
        setJobListings(prev => prev.filter(job => job.id !== jobId));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting job");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event("storage"));
    navigate('/');
  };

  const filteredListings = jobListings.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

const handleProfileUpdate = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  try {
    const res = await fetch(`${BASE_URL}/api/auth/update-profile/${userData.email}`, {
      method: 'PUT',
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      alert("Profile updated successfully!");
      setUserData(data.user);
      setEditMode(false);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Profile update failed.");
  }
};

  return (
    <div className="dashboard-container">
  {/* Navbar */}
  <nav className="dashboard-navbar">
    <div className="navbar-left">
      <h1 className="logo">JOB PORTAL</h1>
    </div>
    <div className="navbar-right">
      <input
        className="search-input"
        type="text"
        placeholder="Search jobs or internships"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Link to="/saved-applications" className="nav-link">Saved Applications</Link>
      <Link to="/post-job" className="nav-link">Post a Job</Link>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  </nav>

  {/* Content */}
  <div className="dashboard-content">
    {userData && (
      <>
        <h2 className="greeting">Hey, {userData.fullName} 👋</h2>

        {/* User Info */}
        <section className="user-profile-section">
          <div className="user-info">
            <div className="info-grid">
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Phone:</strong> {userData.phone}</p>
              <p><strong>Education:</strong> {userData.education}</p>
              <p><strong>Skills:</strong> {userData.skills}</p>
              <p><strong>Experience:</strong> {userData.experience || 'N/A'}</p>
              <p><strong>Resume:</strong> {userData.resume ? <a href={`${BASE_URL}/uploads/${userData.resume}`} target="_blank">View</a> : 'Not uploaded'}</p>
            </div>
            {editMode && (
              <form onSubmit={handleProfileUpdate} className="edit-form" encType="multipart/form-data">
                <input type="text" name="fullName" defaultValue={userData.fullName} required />
                <input type="text" name="phone" defaultValue={userData.phone} />
                <textarea name="skills" defaultValue={userData.skills}></textarea>
                <input type="file" name="resume" accept=".pdf,.doc,.docx" />
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
              </form>
            )}
            {!editMode && <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>}
          </div>
        </section>

        {/* Listings */}
        <section className="listings-section">
          <h2 className="section-heading">Job Listings</h2>
          <div className="listings-container">
            {filteredListings.filter(i => i.type === 'job').map(item => (
              <div className="listing-card" key={item.id}>
                <div className="listing-header">
                  <h3>{item.position}</h3>
                  <span>@ {item.name}</span>
                </div>
                <p><strong>Place:</strong> {item.place}</p>
                <p><strong>Salary:</strong> {item.salary}</p>
                <p><strong>Experience:</strong> {item.experience}</p>
                <p><strong>Eligibility:</strong> {item.eligibility}</p>
                <div className="card-actions">
                  <button onClick={() => navigate(`/job-details/${item.id}`)}>Details</button>
                  <button onClick={() => handleSave(item)}>Save</button>
                  {item.postedBy === localStorage.getItem('userEmail') && (
                    <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <h2 className="section-heading">Internship Listings</h2>
          <div className="listings-container">
            {filteredListings.filter(i => i.type === 'internship').map(item => (
              <div className="listing-card" key={item.id}>
                <div className="listing-header">
                  <h3>{item.position}</h3>
                  <span>@ {item.name}</span>
                </div>
                <p><strong>Place:</strong> {item.place}</p>
                <p><strong>Salary:</strong> {item.salary}</p>
                <p><strong>Experience:</strong> {item.experience}</p>
                <p><strong>Eligibility:</strong> {item.eligibility}</p>
                <div className="card-actions">
                  <button onClick={() => navigate(`/job-details/${item.id}`)}>Details</button>
                  <button onClick={() => handleSave(item)}>Save</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    )}
  </div>
</div>

  ); 
}

export default Dashboard;

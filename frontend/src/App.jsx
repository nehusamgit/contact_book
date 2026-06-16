import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // Login States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'user' && password === '1234') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Username or password is invalid ');
    }
  };

  const API_URL = "http://127.0.0.1:8000/api/contacts/";

  // 1. READ 
  const fetchContacts = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data.results ? response.data.results : response.data;
      setContacts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchContacts(); 
    }
  }, [isLoggedIn]);

  // 2. CREATE & UPDATE 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("please enter name and phone number");
      return;
    }

    if (phone.length !== 10) {
      alert("phone no must be of 10 digits");
      return;
    }

    try {
      if (editingId) {
        // UPDATE (PUT Request)
        await axios.put(`${API_URL}${editingId}/`, { name, phone, email });
        setEditingId(null);
      } else {
        // CREATE (POST Request)
        await axios.post(API_URL, { name, phone, email });
      }

      setName("");
      setPhone("");
      setEmail("");
      fetchContacts(); // refreshes list
    } catch (error) {
      console.error("Error saving contact:", error);
    }
  };

  // 3. EDIT 
  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setEmail(contact.email);
  };

  // 4. DELETE
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this contact")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        fetchContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="card shadow border-0 p-4" style={{ width: "380px" }}>
          <div className="card-body">
            <h3 className="text-center mb-4 fw-bold text-primary">Contact Book Login</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Enter username" 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter password" 
                  required 
                />
              </div>
              {error && <div className="alert alert-danger py-2 text-center text-sm">{error}</div>}
              <button type="submit" className="btn btn-primary w-100 fw-bold mt-2">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="container mt-5">
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold mb-0">📞 Contact Book Application</h2>
        <button className="btn btn-outline-danger fw-bold" onClick={() => { setIsLoggedIn(false); setUsername(''); setPassword(''); }}>
          Logout
        </button>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="mb-3">
            <input 
              className="form-control" 
              type="text" 
              placeholder="Search contacts...." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="card shadow-sm">
            <div className={`card-header text-white ${editingId ? "bg-warning" : "bg-success"}`}>
              <h5 className="card-title mb-0">{editingId ? "Edit Contact" : " Add New Contact"}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email (Optional)</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                </div>
                <button type="submit" className={`btn w-100 ${editingId ? "btn-warning text-dark" : "btn-success"}`}>
                  {editingId ? "Update Contact" : "Save Contact"}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-secondary w-100 mt-2" onClick={() => { setEditingId(null); setName(""); setPhone(""); setEmail(""); }}>
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="card-title mb-0">Saved Contacts</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover table-striped mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts
                      .filter((val) => {
                        if (searchTerm === "") {
                          return val;
                        } else if (val.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                          return val;
                        }
                        return null;
                      })
                      .map((contact) => (
                        <tr key={contact.id}>
                          <td>{contact.name}</td>
                          <td>{contact.phone}</td>
                          <td>{contact.email || "-"}</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(contact)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(contact.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
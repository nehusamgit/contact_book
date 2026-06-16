import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null); 
  const [searchTerm, setSearchTerm]=useState('');

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
    fetchContacts();
  }, []);

  // 2. CREATE & UPDATE 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("please enter name and  phone number");
      return;
    }

    if (phone.length!=10)
    {
      alert("phone no must be of 10 digits");
      return
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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary fw-bold">📞 Contact Book Application(Django + React CRUD)</h2>

      <div className="row">
        <div className="col-md-4 mb-4">
          <input className="form-label fw-semibold" type="text" placeholder="Search contacts...." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
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
  {contacts.filter((contact) => {
    const nameMatch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = contact.phone.toString().includes(searchTerm);
    return nameMatch || phoneMatch;
  }).length === 0 ? (
   
    <tr>
      <td colSpan="4" className="text-center py-4 text-muted">
        No contacts found currently!
      </td>
    </tr>
  ) : (
    contacts
      .filter((contact) => {
        const nameMatch = contact.name.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = contact.phone.toString().includes(searchTerm);
        return nameMatch || phoneMatch;
      })
      .map((contact) => (
        <tr key={contact.id}>
          <td className="fw-bold text-secondary">{contact.name}</td>
          <td>{contact.phone}</td>
          <td>
            {contact.email || <span className="text-muted small">N/A</span>}
          </td>
          <td className="text-center">
            <button 
              className="btn btn-sm btn-outline-warning me-2" 
              onClick={() => handleEdit(contact)}
            >
              Edit
            </button>
            <button 
              className="btn btn-sm btn-outline-danger" 
              onClick={() => handleDelete(contact.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))
  )}
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
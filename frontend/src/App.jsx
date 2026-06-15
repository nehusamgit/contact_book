import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import axios from 'axios';

function App() {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    try 
    {
      const response=await fetch("http://127.0.0.1:8000/api/contacts/");
      const resData=await response.json();
      const data=resData.results ? resData.results : resData;
      setContacts(data);
    }
    catch(error)
      {
        console.error("Data not fetched", error);
      }
    
  };

  useEffect(() => {
    fetchContacts();
  }, []);

 return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">Contact Book (Django + React)</h2>
      
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          <ul className="list-group">
            {contacts.map((contact) => (
              <li key={contact.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{contact.name}</strong> <br />
                  <small className="text-muted">{contact.phone} | {contact.email}</small>
                </div>
              </li>
            ))}
            {contacts.length === 0 && (
              <p className="text-center text-muted mt-3">No contacts in list currently!</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

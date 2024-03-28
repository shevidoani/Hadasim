import React from 'react'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import ListPatients from './ListPatients';
import AddPatient from './AddPatient';

export default function AllPatients() {
  const [patients, setPatients] = useState([]);
  const [arrPatients, setArrPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [sort, setSort] = useState('serial');
  const navigate = useNavigate();
  let { id } = useParams();
  useEffect(() => {
    const filtered = patients.filter((Patient) =>
      Patient.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [patients, searchTerm]);

  async function getPatients() {
    const response = await fetch(`http://localhost:3366/patients`)
      .catch(error => {
        console.log("Error:", error);
      });
      console.log(response);
    const json_response = await response.json();
    setPatients(json_response);
  }

  useEffect(() => {
    getPatients();
  }, []);

  function filteredList() {
    if (searchTerm === '') {
      return patients.map(patient => {
        return <ListPatients key={patient.id} patient={patient} setPatients={setPatients} patients={patients} />
      })
    }
    else {
      return filteredPatients.map(patient => {
        return <ListPatients key={patient.id} patient={patient} setPatients={setPatients} patients={patients} />
      })
    }
  }

  return (
    <div>
      <h2>-----All you need patient-----</h2>
      <div>
        <input
          type='text'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search patients...'
        />
        <button onClick={() => setSearchTerm('')}>Clear</button>
      </div>
      {/* {toAdd && <AddPatient setPatients={setPatients} patients={patients} setToAdd={setToAdd} />} */}
      <button className='toAdd' onClick={() => { setToAdd(!toAdd) }}>➕</button>
    </div>
  )
}


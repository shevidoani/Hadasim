import React from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function AddPatient({ setPatients, patient, setToAdd }) {
    const [patientId, setPatientId] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [telephone, setTelephone] = useState('');
    const [mobilePhone, setMobilePhone] = useState('');
    const [recoveryDate, setRecoveryDate] = useState('');
    const [dateReceivingPositive, setDateReceivingPositive] = useState('');
    let { id } = useParams();
    async function handleAdd() {
        let patientToAdd = {
            "userId": id,
        };
        const response = await fetch(`http://localhost:3366/patients`, {
            method: 'POST',
            body: JSON.stringify(patientToAdd),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .catch(error => {
                console.log("Error:", error);
            });
        const json_response = await response.json();
        let tempPatient = patient;
        tempPatient.push(json_response);
        setPatients([...tempPatient]);
        setToAdd(false);
    }
    return (
        <div className='toAddPostOrPatient'>
            <input type="number" value={patientId} onChange={(e) => setPatientId(e.target.value)} />

            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />

            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />

            <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} />

            <input type="text" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />

            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />

            <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} />

            <input type="tel" value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)} />

            <input type="date" value={recoveryDate} onChange={(e) => setRecoveryDate(e.target.value)} />

            <input type="date" value={dateReceivingPositive} onChange={(e) => setDateReceivingPositive(e.target.value)} />

            <button onClick={handleAdd}>Add</button>
        </div>
    );
}

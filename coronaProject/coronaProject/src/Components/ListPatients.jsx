import React from 'react'
import { useState } from 'react';

export default function ListPatients({ patient, setPatients, patients }) {
    const [title, setTitle] = useState(patient.title);
    const [isEditing, setIsEditing] = useState(false);
    function updatePatient(updatedObj) {
        fetch(`http://localhost:3366/patients/${patient.id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedObj),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    }

    function deletePatient() {
        fetch(`http://localhost:3366/patients/${patient.id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('can not delete');
                }
                const newArray = patients.filter((a) => a.id !== patient.id);
                setPatients(newArray);
            }).catch(error => {
                console.log("Error:", error);
            });
    }
    function handleTitleUpdate() {
        setIsEditing(false);
        updatePatient({ title: title });
    }
    return (
        <div className='patient' >
            {isEditing ? (
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            ) : (
                <p>{title}</p>
            )}
            {patient.completed && <input type="checkbox" className='patientCheckbox'
                name={patient.id} checked onChange={() => { updatePatient({ completed: !patient.completed }) }} />}
            {!patient.completed && <input type="checkbox" className='patientCheckbox'
                name={patient.id} onChange={() => { updatePatient({ completed: !patient.completed }) }} />}
            <label htmlFor={patient.id} className='patientCheckbox'></label>
            <button onClick={deletePatient}>🗑</button>
            {isEditing ? (
                <button onClick={handleTitleUpdate}>✔️</button>
            ) : (
                <button onClick={() => setIsEditing(true)}>🖋</button>
            )}
        </div>
    )
}



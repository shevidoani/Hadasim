import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'
export default function Welcome() {
    return (
        <>
            <h2 className='welcome'>Welcome</h2>
            <Link to="/patients">Go to All Patients</Link>
        </>
    );
}
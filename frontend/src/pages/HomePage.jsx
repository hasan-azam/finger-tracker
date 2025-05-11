import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
    return (
        <div className="home-container">
            <h1>Finger Tracker Dashboard</h1>
            <div className="button-grid">
                <Link to="/batches" className="menu-button">Manage Batches</Link>
                <Link to="/failures" className="menu-button">Log Failures</Link>
                <Link to="/molds" className="menu-button">Manage Molds</Link>
                <Link to="/stats" className="menu-button">View Stats</Link>
            </div>
        </div>
    );
}

export default HomePage;

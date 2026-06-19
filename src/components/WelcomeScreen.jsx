import { useState, useEffect } from 'react';

export default function WelcomeScreen() {
    const [visible, setVisible] = useState(false);
    const [disparition, setDisparition] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem('ifruit-first-visit');
        if (!hasVisited) {
            setVisible(true);
        }
    }, []);

    const handleStart = () => {
        setDisparition(true);
        setTimeout(() => {
            localStorage.setItem('ifruit-first-visit', 'true');
            setVisible(false);
        }, 800);
    };

    if (!visible) return null;

    return (
        {/* L'ÉVÉNEMENT ONCLICK EST ICI POUR TOUT L'ÉCRAN */}
    <div className={`welcome-container ${disparition ? 'hidden' : ''}`} onClick={handleStart}>
        <div className="welcome-content">
            {/* Les <span> permettent au 'E' et au 'N' de grésiller */}
            <h1 className="welcome-title">BI<span>E</span>NVE<span>N</span>UE</h1>
            <p className="welcome-text">Bienvenue dans votre espace organisationnel.</p>
        </div>
    </div>
);
}
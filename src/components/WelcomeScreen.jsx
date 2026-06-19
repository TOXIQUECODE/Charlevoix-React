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

    // Le onClick est bien sur la div principale pour rendre tout l'écran interactif
    return (
        <div className={`welcome-container ${disparition ? 'hidden' : ''}`} onClick={handleStart}>
            <div className="welcome-content">
                <h1 className="welcome-title">BI<span>E</span>NVE<span>N</span>UE</h1>
                <p className="welcome-text">Bienvenue dans votre espace organisationnel.</p>
            </div>
        </div>
    );
}
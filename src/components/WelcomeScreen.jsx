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
        // J'ai augmenté un peu le temps (800ms) pour bien profiter de la nouvelle transition 3D
        setTimeout(() => {
            localStorage.setItem('ifruit-first-visit', 'true');
            setVisible(false);
        }, 800);
    };

    if (!visible) return null;

    return (
        <div className={`welcome-container ${disparition ? 'hidden' : ''}`}>
            <div className="welcome-content">
                <h1 className="welcome-title">BIENVENUE</h1>
                <p className="welcome-text">Bienvenue dans votre espace organisationelle.</p>
            </div>
        </div>
    );
}
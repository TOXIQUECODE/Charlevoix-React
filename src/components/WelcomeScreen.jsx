import { useState, useEffect } from 'react';

export default function WelcomeScreen() {
    const [visible, setVisible] = useState(false);
    const [disparition, setDisparition] = useState(false);

    useEffect(() => {
        // On vérifie si c'est la première visite
        const hasVisited = localStorage.getItem('ifruit-first-visit');
        if (!hasVisited) {
            setVisible(true);
        }
    }, []);

    const handleStart = () => {
        // On déclenche la classe CSS "hidden"
        setDisparition(true);

        // On attend la fin de l'animation CSS (500ms) pour supprimer l'écran
        setTimeout(() => {
            localStorage.setItem('ifruit-first-visit', 'true');
            setVisible(false);
        }, 500);
    };

    if (!visible) return null;

    return (
        <div className={`welcome-container ${disparition ? 'hidden' : ''}`}>
            <div className="welcome-content">
                <h1 className="welcome-title">BIENVENUE</h1>
                <p className="welcome-text">Bienvenue dans votre espace organisationelle.</p>
                <button className="welcome-btn" onClick={handleStart}>
                    Démarrer
                </button>
            </div>
        </div>
    );
}
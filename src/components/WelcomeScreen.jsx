import { useState, useEffect } from 'react';

export default function WelcomeScreen() {
    const [visible, setVisible] = useState(false);
    const [disparition, setDisparition] = useState(false);

    useEffect(() => {
        // Vérifie si c'est la première visite
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
        }, 500);
    };

    if (!visible) return null;

    return (
        <div className={`welcome-container ${disparition ? 'hidden' : ''}`}>

            {/* La grille d'arrière-plan du CodePen */}
            <div className="codepen-grid-bg"></div>

            <div className="welcome-content">

                {/* Le texte avec l'effet Aurora/Hologramme du CodePen */}
                <div className="codepen-text-wrapper">
                    <p className="codepen-shimmer-text">
                        BIENVENUE
                    </p>
                    <p className="welcome-subtitle">
                        Dans votre espace Charlevoix.
                    </p>
                </div>

                <button className="welcome-btn" onClick={handleStart}>
                    Démarrer l'expérience
                </button>
            </div>
        </div>
    );
}
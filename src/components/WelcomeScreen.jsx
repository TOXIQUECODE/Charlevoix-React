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
        }, 500);
    };

    if (!visible) return null;

    return (
        <div className={`welcome-container ${disparition ? 'hidden' : ''}`}>
            <div className="welcome-content">

                {/* LE TITRE NÉON : Le premier 'E' et le 'N' vont clignoter ! */}
                <div className="welcome-title">
                    <b>BI<span>E</span>NVE<span>N</span>UE</b>
                </div>

                {/* Le sous-titre */}
                <p className="welcome-text">Dans votre espace Charlevoix.</p>

                <button className="welcome-btn" onClick={handleStart}>
                    Démarrer
                </button>

            </div>
        </div>
    );
}
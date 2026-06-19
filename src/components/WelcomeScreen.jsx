// src/components/WelcomeScreen.jsx
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
        // On lance l'animation de fondu
        setDisparition(true);

        // On attend la fin de l'animation (500ms) pour supprimer l'écran et mémoriser la visite
        setTimeout(() => {
            localStorage.setItem('ifruit-first-visit', 'true');
            setVisible(false);
        }, 500);
    };

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            background: '#000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
            opacity: disparition ? 0 : 1, // Effet de fondu à la sortie
            transition: 'opacity 0.5s ease-out'
        }}>
            <div style={{ textAlign: 'center', color: 'white' }}>
                <h1 style={{
                    fontSize: '52px',
                    fontWeight: 300,
                    letterSpacing: '-1px', // Resserre un peu les lettres pour un look plus "pro"
                    marginBottom: '15px',
                    animation: 'pulse 3s infinite'
                }}>
                    Bonjour
                </h1>
                <p style={{ fontSize: '17px', color: '#888', marginBottom: '45px', fontWeight: 400 }}>
                    Bienvenue dans votre espace Charlevoix.
                </p>
                <button
                    onClick={handleStart}
                    style={{
                        background: '#fff',
                        color: '#000',
                        border: 'none',
                        padding: '16px 45px',
                        fontSize: '17px',
                        fontWeight: 600,
                        borderRadius: '30px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(255,255,255,0.2)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 6px 20px rgba(255,255,255,0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 15px rgba(255,255,255,0.2)';
                    }}
                >
                    Démarrer
                </button>
            </div>
        </div>
    );
}
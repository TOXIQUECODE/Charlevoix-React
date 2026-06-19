import { useState, useEffect } from 'react';

export default function StatusBar() {
    const [heure, setHeure] = useState("--:--");
    const [jour, setJour] = useState("...");

    useEffect(() => {
        const mettreAJourTemps = () => {
            const now = new Date();
            const jours = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
            setJour('' + jours[now.getDay()]);
            setHeure(now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'));
        };

        mettreAJourTemps(); // Mise à jour immédiate
        const interval = setInterval(mettreAJourTemps, 1000); // Boucle chaque seconde

        return () => clearInterval(interval); // Nettoyage de la mémoire
    }, []);

    return (
        <div className="status-bar">
            <div className="status-left" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg fill="white" viewBox="0 0 24 24" height="12" width="14" style={{ display: 'inlineBlock' }}>
                    <rect x="2" y="16" width="3" height="5" rx="0.8" />
                    <rect x="7" y="12" width="3" height="9" rx="0.8" />
                    <rect x="12" y="7" width="3" height="14" rx="0.8" />
                    <rect x="17" y="2" width="3" height="19" rx="0.8" />
                </svg>
                <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.3px', lineHeight: 1 }}>LTE</span>
            </div>
            <div className="status-center">{jour}</div>
            <div className="status-right">{heure}</div>
        </div>
    );
}
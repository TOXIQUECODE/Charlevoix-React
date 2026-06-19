import { useState } from 'react';

export default function ReglagesScreen() {
    const [bgVal, setBgVal] = useState('');

    const appliquerFond = () => {
        if (!bgVal) return;
        let finalBg = bgVal;
        const bgLower = bgVal.toLowerCase().trim();

        // Ton super dictionnaire Apple/Nature
        const dictionnaire = {
            'bleu': 'linear-gradient(135deg, #007AFF, #0056b3)',
            'vert': 'linear-gradient(135deg, #34C759, #248A3D)',
            'rouge': 'linear-gradient(135deg, #FF3B30, #B3241D)',
            'orange': 'linear-gradient(135deg, #FF9500, #B36800)',
            'violet': 'linear-gradient(135deg, #AF52DE, #7B399C)',
            'noir': 'linear-gradient(180deg, #333333, #000000)',
            'gris': 'linear-gradient(135deg, #8E8E93, #48484A)',
            'nature': 'linear-gradient(135deg, #2ecc71, #f1c40f)',
            'ocean': 'linear-gradient(135deg, #2193b0, #6dd5ed)',
            'aurore': 'linear-gradient(135deg, #ff9966, #ff5e62)',
            'nuit': 'linear-gradient(135deg, #141e30, #243b55)',
            'foret': 'linear-gradient(135deg, #134e5e, #71b280)'
        };

        if (dictionnaire[bgLower]) {
            finalBg = dictionnaire[bgLower];
        } else if (bgLower.startsWith('http')) {
            finalBg = `url('${bgVal}') center/cover no-repeat`;
        }

        // On sauvegarde la préférence dans le navigateur
        localStorage.setItem('ifruit-bg', finalBg);

        // On met à jour l'écran d'accueil en direct
        const homeElement = document.querySelector('.gta-home-bg');
        if (homeElement) homeElement.style.background = finalBg;

        setBgVal('');
        alert("Nouveau thème appliqué ! Appuie sur le bouton Home pour voir le résultat.");
    };

    return (
        <div className="vue active app-page">
            <header className="app-header"><h2>⚙️ Réglages</h2></header>
            <div className="app-content">

                <div className="dev-card" style={{ borderBottom: 'none', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                    <div className="dev-header">🎨 Fond d'écran de l'accueil</div>
                    <div className="dev-body" style={{ display: 'block' }}>
                        <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                            Couleurs dispo: nature, ocean, aurore, foret, nuit, bleu, vert, rouge... ou colle un lien image (http...).
                        </p>
                        <input
                            type="text"
                            className="glass-input"
                            placeholder="Ex: foret, ocean ou lien image"
                            value={bgVal}
                            onChange={(e) => setBgVal(e.target.value)} // On lie l'input à notre variable React
                        />
                        <button onClick={appliquerFond} className="glass-btn-submit">
                            Appliquer & Sauvegarder
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
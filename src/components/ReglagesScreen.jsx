import { useState } from 'react';
import { Settings, Palette } from 'lucide-react';

export default function ReglagesScreen() {
    // Les choix disponibles (les noms exacts de tes fichiers .png dans /public)
    const optionsIcones = [
        { id: 'guimauve', nom: 'Guimauve', emoji: '🍡' },
        { id: 'feuille', nom: 'Feuille', emoji: '🍃' },
        { id: 'feu', nom: 'Feu', emoji: '🔥' },
        { id: 'capybara', nom: 'Capybara', emoji: '🦦' },
        { id: 'lapin', nom: 'Lapin', emoji: '🐰' },
        { id: 'poisson', nom: 'Poisson', emoji: '🐟' }
    ];

    // On récupère l'icône actuelle
    const [iconeActive, setIconeActive] = useState(localStorage.getItem('ifruit-home-icon') || 'guimauve');

    // Fonction pour changer l'icône
    const changerIcone = (id) => {
        setIconeActive(id);
        localStorage.setItem('ifruit-home-icon', id); // Sauvegarde

        // On envoie le signal au bouton (dans App.jsx) pour qu'il change instantanément
        window.dispatchEvent(new CustomEvent('changeHomeIcon', { detail: id }));
    };

    return (
        <div className="vue active app-page" style={{ background: 'transparent' }}>
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>⚙️ Réglages</h2>
            </header>

            <div className="app-content">

                {/* SECTION PERSONNALISATION */}
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '15px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(15px)', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Palette size={20} color="#f1c40f" /> Personnalisation Bouton
                    </div>

                    {/* Grille des boutons */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {optionsIcones.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => changerIcone(opt.id)}
                                style={{
                                    background: iconeActive === opt.id ? 'rgba(46, 204, 113, 0.2)' : 'rgba(0, 0, 0, 0.4)',
                                    border: iconeActive === opt.id ? '1px solid #2ecc71' : '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '12px 5px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: iconeActive === opt.id ? '0 0 10px rgba(46, 204, 113, 0.3)' : 'none'
                                }}
                            >
                                {/* On affiche un emoji en attendant que tu mettes tes vrais PNG, mais le système est prêt ! */}
                                <div style={{ fontSize: '24px' }}>{opt.emoji}</div>
                                <span style={{ fontSize: '11px', fontWeight: iconeActive === opt.id ? 'bold' : 'normal' }}>
                                    {opt.nom}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* AUTRES PARAMÈTRES (Squelettes) */}
                <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '15px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(15px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <Settings size={20} color="#95a5a6" /> Système
                    </div>

                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                        Version de l'OS : 2.0<br/>
                        Mise à jour à jour.
                    </div>
                </div>

            </div>
        </div>
    );
}
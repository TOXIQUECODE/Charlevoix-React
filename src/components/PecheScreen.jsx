import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// Imports pour nos belles cartes Squelettes
import { Image as ImageIcon, ChevronRight } from 'lucide-react';

export default function PecheScreen() {
    const [spots, setSpots] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        async function chercherSpots() {
            const { data } = await supabase.from('peche').select('*');
            if (data) setSpots(data);
            setChargement(false);
        }
        chercherSpots();
    }, []);

    return (
        <div className="vue active app-page" style={{ background: 'transparent' }}>

            {/* Header en verre fumé */}
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>🎣 Spots de Pêche</h2>
            </header>

            <div className="app-content">

                {/* LA CARTE DÉROULANTE POUR L'ACM (Design Glassmorphism) */}
                <details style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '15px',
                    borderRadius: '14px',
                    marginBottom: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px)',
                    color: 'white'
                }}>
                    <summary style={{ fontWeight: 'bold', cursor: 'pointer', outline: 'none', display: 'flex', justifyContent: 'space-between' }}>
                        ⚠️ Avertissement ACM Gouffre <span style={{color: 'rgba(255,255,255,0.5)', fontSize: '12px'}}>▼</span>
                    </summary>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        padding: '12px',
                        borderRadius: '10px',
                        marginTop: '10px',
                        borderLeft: '3px solid #e74c3c',
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.85)'
                    }}>
                        <p style={{ marginBottom: '8px' }}>Droit d'accès quotidien requis pour la pêche sur la rivière du Gouffre.</p>
                        <p><strong>Non requis :</strong> Fleuve Saint-Laurent, lacs privés ou zones sans gestion ACM.</p>
                    </div>
                </details>

                {chargement ? (
                    <div className="loading" style={{ color: 'white' }}>Scan des rivières... 🌊</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

                        {/* Les 4 cartes Squelettes */}
                        {[1, 2, 3, 4].map((item, index) => (
                            <div key={index} className="glass-list-card">
                                <div className="glass-card-image-placeholder">
                                    <ImageIcon size={24} color="rgba(255,255,255,0.3)" />
                                </div>
                                <div className="glass-card-content">
                                    <div className="ghost-line-title" style={{ width: index % 2 === 0 ? '70%' : '55%' }}></div>
                                    <div className="ghost-line-subtitle" style={{ width: index % 2 === 0 ? '40%' : '60%' }}></div>
                                </div>
                                <div className="glass-card-arrow">
                                    <ChevronRight size={20} color="#ffffff" />
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
}
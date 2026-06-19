import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// On importe les icônes pour le Squelette
import { Image as ImageIcon, ChevronRight } from 'lucide-react';

export default function MagasinsScreen() {
    const [magasins, setMagasins] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        async function chercherMagasins() {
            const { data } = await supabase.from('magasins').select('*');
            if (data) setMagasins(data);
            setChargement(false);
        }
        chercherMagasins();
    }, []);

    return (
        <div className="vue active app-page" style={{ background: 'transparent' }}>

            {/* Header en verre fumé */}
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>🛍️ Magasins</h2>
            </header>

            <div className="app-content">
                {chargement ? (
                    <div className="loading" style={{ color: 'white' }}>Recherche commerces... 💸</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

                        {/* Affichage des 4 cartes Squelettes */}
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
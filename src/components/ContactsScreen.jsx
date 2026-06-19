import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// 1. On ajoute les icônes de Lucide pour le design
import { Image as ImageIcon, ChevronRight } from 'lucide-react';

export default function CartesScreen() {
    const [lieux, setLieux] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        async function chercherLieux() {
            const { data } = await supabase.from('localisation').select('*');
            if (data) setLieux(data);
            setChargement(false);
        }
        chercherLieux();
    }, []);

    return (
        <div className="vue active app-page" style={{ background: 'transparent' }}>
            {/* Header en verre fumé comme pour les Activités */}
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>📍 Cartes GPS</h2>
            </header>

            <div className="app-content">
                {chargement ? (
                    <div className="loading" style={{ color: 'white' }}>Signal satellite... 🛰️</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

                        {/* 2. On affiche le Squelette Visuel (4 fausses cartes) au lieu des vraies données */}
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
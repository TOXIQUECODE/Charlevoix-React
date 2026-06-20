import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingBag, ChevronRight, Phone } from 'lucide-react';

export default function MagasinsScreen() {
    const [magasins, setMagasins] = useState([]);
    const [chargement, setChargement] = useState(true);

    const couleursElectriques = ['#f1c40f', '#e74c3c', '#9b59b6', '#3498db', '#1abc9c'];

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
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>🛍️ Magasins</h2>
            </header>

            <div className="app-content">
                {chargement ? (
                    <div className="loading" style={{ color: 'white' }}>Recherche commerces... 💸</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {magasins.map((mag, index) => {
                            const couleurActuelle = couleursElectriques[index % couleursElectriques.length];

                            return (
                                <div key={index} className="electric-card-wrapper" style={{ '--electric-color': couleurActuelle }}>
                                    <div className="electric-card-inner">
                                        <div className="glass-card-image-placeholder" style={{ background: 'rgba(0,0,0,0.6)' }}>
                                            <ShoppingBag size={24} color={couleurActuelle} style={{ filter: `drop-shadow(0 0 5px ${couleurActuelle})` }} />
                                        </div>

                                        <div className="glass-card-content">
                                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>{mag.nom}</div>
                                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                                                Style: {mag.style || 'Général'}
                                            </div>
                                            {mag.telephone && (
                                                <a href={`tel:${mag.telephone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', marginTop: '6px', width: 'fit-content' }}>
                                                    <Phone size={12} /> {mag.telephone}
                                                </a>
                                            )}
                                        </div>

                                        <div className="glass-card-arrow">
                                            <ChevronRight size={20} color={couleurActuelle} style={{ opacity: 0.5 }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
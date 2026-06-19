import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
        <div className="vue active app-page">
            <header className="app-header"><h2>🛍️ Magasins</h2></header>
            <div className="app-content">
                {chargement ? <div className="loading">Recherche commerces... 💸</div> : (
                    <div className="custom-card-feed" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {magasins.map((mag, index) => (
                            <div key={index} className="premium-card" style={{ background: '#fff', borderRadius: '14px', padding: '15px', border: '1px solid #eaeaea', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f2f4f7', paddingBottom: '6px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{mag.nom}</div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', background: '#e3f2fd', color: '#1565c0', padding: '3px 8px', borderRadius: '12px' }}>Boutique</span>
                                </div>
                                <div style={{ fontSize: '13px', color: '#555', marginTop: '8px' }}><strong>Style:</strong> {mag.style || 'Général'}</div>
                                {mag.telephone && (
                                    <a href={`tel:${mag.telephone}`} style={{ color: '#0066cc', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', display: 'block', marginTop: '8px' }}>
                                        📞 Appeler ({mag.telephone})
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
        <div className="vue active app-page">
            <header className="app-header"><h2>📍 Cartes GPS</h2></header>
            <div className="app-content">
                {chargement ? <div className="loading">Signal satellite... 🛰️</div> : (
                    <div className="custom-card-feed" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {lieux.map((lieu, index) => (
                            <div key={index} className="premium-card" style={{ background: '#fff', borderRadius: '14px', padding: '15px', border: '1px solid #eaeaea' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f2f4f7', paddingBottom: '6px', marginBottom: '10px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{lieu.nom}</div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', background: '#e3f2fd', color: '#1565c0', padding: '3px 8px', borderRadius: '12px' }}>GPS</span>
                                </div>

                                {/* Boutons pour ouvrir Google Maps ou Apple Maps */}
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {lieu.lien_google && (
                                        <a href={lieu.lien_google} target="_blank" rel="noreferrer" style={{ background: '#34a853', color: 'white', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
                                            🗺️ Google Maps
                                        </a>
                                    )}
                                    {lieu.lien_apple && (
                                        <a href={lieu.lien_apple} target="_blank" rel="noreferrer" style={{ background: '#555', color: 'white', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
                                            🍏 Apple Maps
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
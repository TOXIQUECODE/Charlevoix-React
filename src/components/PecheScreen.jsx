import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

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
        <div className="vue active app-page">
            <header className="app-header"><h2>🎣 Spots de Pêche</h2></header>
            <div className="app-content">

                {/* LA CARTE DÉROULANTE POUR L'ACM */}
                <details className="acm-card" style={{ background: '#fff', padding: '15px', borderRadius: '14px', marginBottom: '15px', border: '1px solid #eaeaea' }}>
                    <summary style={{ fontWeight: 'bold', cursor: 'pointer', outline: 'none', display: 'flex', justifyContent: 'space-between' }}>
                        ⚠️ Avertissement ACM Gouffre <span style={{color: '#888', fontSize: '12px'}}>▼</span>
                    </summary>
                    <div className="acm-details" style={{ background: '#f8f9fa', padding: '12px', borderRadius: '10px', marginTop: '10px', borderLeft: '3px solid #e74c3c', fontSize: '13px' }}>
                        <p style={{ marginBottom: '8px' }}>Droit d'accès quotidien requis pour la pêche sur la rivière du Gouffre.</p>
                        <p><strong>Non requis :</strong> Fleuve Saint-Laurent, lacs privés ou zones sans gestion ACM.</p>
                    </div>
                </details>

                {chargement ? <div className="loading">Scan des rivières... 🌊</div> : (
                    <div className="custom-card-feed" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {spots.map((spot, index) => (
                            <div key={index} className="premium-card" style={{ background: '#fff', borderRadius: '14px', padding: '15px', border: '1px solid #eaeaea' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f2f4f7', paddingBottom: '6px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>🐟 {spot.endroit}</div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', background: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: '12px' }}>{spot.rarete || 'Commun'}</span>
                                </div>
                                <div style={{ fontSize: '13px', color: '#555', marginTop: '8px' }}>
                                    <strong>Cible :</strong> {spot.poisson}<br/>
                                    <strong>Appât :</strong> {spot.appat}
                                </div>
                                <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>Permis requis: {spot.permis || 'Oui'}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
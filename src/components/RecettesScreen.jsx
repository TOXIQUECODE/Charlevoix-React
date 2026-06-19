import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function RecettesScreen() {
    const [recettes, setRecettes] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        async function chercherRecettes() {
            const { data } = await supabase.from('recettes').select('*');
            if (data) setRecettes(data);
            setChargement(false);
        }
        chercherRecettes();
    }, []);

    return (
        <div className="vue active app-page">
            <header className="app-header"><h2>🍳 iRecettes</h2></header>
            <div className="app-content">
                {chargement ? <div className="loading">Téléchargement... 🔄</div> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recettes.map((rec, index) => (
                            // Utilisation de details/summary pour l'effet accordéon !
                            <details key={index} style={{ background: '#fff', padding: '15px', borderRadius: '14px', border: '1px solid #eaeaea', boxShadow: '0 4px 10px rgba(0,0,0,0.04)', cursor: 'pointer' }}>
                                <summary style={{ fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'space-between', outline: 'none' }}>
                                    {rec.nom} <span style={{ color: '#888', fontSize: '12px' }}>▼</span>
                                </summary>
                                <div style={{ background: '#f8f9fa', padding: '12px', borderRadius: '10px', marginTop: '10px', borderLeft: '3px solid #0066cc', fontSize: '14px', lineHeight: '1.4' }}>
                                    <strong>🛒 Ingrédients :</strong>
                                    <p style={{ marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{rec.ingredients}</p>
                                    <strong>👨‍🍳 Préparation :</strong>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{rec.preparation}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Utensils, ChevronDown } from 'lucide-react';

export default function RecettesScreen() {
    const [recettes, setRecettes] = useState([]);
    const [chargement, setChargement] = useState(true);

    const couleursElectriques = ['#e67e22', '#f1c40f', '#e74c3c', '#d35400', '#f39c12'];

    useEffect(() => {
        async function chercherRecettes() {
            const { data } = await supabase.from('recettes').select('*');
            if (data) setRecettes(data);
            setChargement(false);
        }
        chercherRecettes();
    }, []);

    return (
        <div className="vue active app-page" style={{ background: 'transparent' }}>
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>🍳 iRecettes</h2>
            </header>

            <div className="app-content">
                {chargement ? (
                    <div className="loading" style={{ color: 'white' }}>Téléchargement... 🔄</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {recettes.map((rec, index) => {
                            const couleurActuelle = couleursElectriques[index % couleursElectriques.length];

                            return (
                                <div key={index} className="electric-card-wrapper" style={{ '--electric-color': couleurActuelle }}>
                                    {/* On modifie le display du inner en "block" pour que l'accordéon fonctionne bien */}
                                    <details className="electric-card-inner" style={{ display: 'block', width: '100%', padding: '12px' }}>

                                        {/* L'apparence de la carte fermée */}
                                        <summary style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', outline: 'none', listStyle: 'none' }}>
                                            <div className="glass-card-image-placeholder" style={{ background: 'rgba(0,0,0,0.6)', marginRight: '15px' }}>
                                                <Utensils size={24} color={couleurActuelle} style={{ filter: `drop-shadow(0 0 5px ${couleurActuelle})` }} />
                                            </div>
                                            <div className="glass-card-content" style={{ flex: 1 }}>
                                                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>{rec.nom}</div>
                                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Cliquez pour voir la recette</div>
                                            </div>
                                            <ChevronDown size={20} color={couleurActuelle} style={{ opacity: 0.5 }} />
                                        </summary>

                                        {/* Le contenu qui se dévoile */}
                                        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '13px', lineHeight: '1.5' }}>
                                            <strong style={{ color: couleurActuelle }}>🛒 Ingrédients :</strong>
                                            <p style={{ marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{rec.ingredients}</p>

                                            <strong style={{ color: couleurActuelle }}>👨‍🍳 Préparation :</strong>
                                            <p style={{ whiteSpace: 'pre-wrap' }}>{rec.preparation}</p>
                                        </div>

                                    </details>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
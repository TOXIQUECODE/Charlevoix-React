import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { TreePine, ChevronRight, Phone } from 'lucide-react';

export default function ActivitesScreen() {
    const [activites, setActivites] = useState([]);
    const [chargement, setChargement] = useState(true);

    const couleursElectriques = ['#ff4757', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71'];

    useEffect(() => {
        async function chercherActivites() {
            const { data } = await supabase.from('activites').select('*');
            if (data) setActivites(data);
            setChargement(false);
        }
        chercherActivites();
    }, []);

    return (
        <div className="vue active app-page" style={{ background: 'transparent' }}>
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>🌲 Activités</h2>
            </header>

            <div className="app-content">
                {chargement ? (
                    <div className="loading" style={{ color: 'white' }}>Chargement des activités... ⏳</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {activites.map((act, index) => {
                            const couleurActuelle = couleursElectriques[index % couleursElectriques.length];

                            return (
                                <div key={index} className="electric-card-wrapper" style={{ '--electric-color': couleurActuelle }}>
                                    <div className="electric-card-inner">
                                        <div className="glass-card-image-placeholder" style={{ background: 'rgba(0,0,0,0.6)' }}>
                                            <TreePine size={24} color={couleurActuelle} style={{ filter: `drop-shadow(0 0 5px ${couleurActuelle})` }} />
                                        </div>

                                        <div className="glass-card-content">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>{act.nom}</div>
                                                <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', color: couleurActuelle, padding: '2px 6px', borderRadius: '8px' }}>
                                                    {act.prix || 'TBD'}
                                                </span>
                                            </div>

                                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {act.explication || 'Aucune description disponible.'}
                                            </div>

                                            {act.telephone && (
                                                <a href={`tel:${act.telephone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(52, 152, 219, 0.2)', color: '#3498db', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', textDecoration: 'none', marginTop: '8px', width: 'fit-content' }}>
                                                    <Phone size={12} /> Appeler
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
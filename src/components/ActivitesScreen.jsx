// src/components/ActivitesScreen.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // On importe notre pont vers la BDD

export default function ActivitesScreen() {
    // Nos états (mémoire)
    const [activites, setActivites] = useState([]);
    const [chargement, setChargement] = useState(true);

    // useEffect se lance automatiquement quand on ouvre la page
    useEffect(() => {
        async function chercherActivites() {
            // On demande tout (*) à la table 'activites'
            const { data, error } = await supabase.from('activites').select('*');

            if (error) {
                console.error("Erreur Supabase :", error);
            } else {
                setActivites(data); // On sauvegarde les données dans notre variable
            }
            setChargement(false); // On enlève le texte "Chargement..."
        }

        chercherActivites();
    }, []); // Les crochets vides signifient "Fais ça 1 seule fois à l'ouverture"

    return (
        <div className="vue active app-page">
            <header className="app-header">
                <h2>🌲 Activités</h2>
            </header>

            <div className="app-content">
                {/* Affichage conditionnel : Si ça charge, on montre le sablier */}
                {chargement ? (
                    <div className="loading">Chargement des activités... ⏳</div>
                ) : (
                    /* Sinon, on affiche la liste des cartes */
                    <div className="custom-card-feed" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                        {/* Boucle magique : pour chaque activité, on crée une carte */}
                        {activites.map((act, index) => (
                            <div key={index} className="premium-card" style={{ background: '#fff', borderRadius: '14px', padding: '15px', border: '1px solid #eaeaea', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f2f4f7', paddingBottom: '6px', marginBottom: '8px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{act.nom}</div>
                                    <span style={{ fontSize: '11px', fontWeight: 'bold', background: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: '12px' }}>
                    {act.prix || 'TBD'}
                  </span>
                                </div>

                                <div style={{ fontSize: '13px', color: '#555', marginBottom: '10px' }}>
                                    {act.explication || 'Aucune description disponible.'}
                                </div>

                                {act.telephone && (
                                    <a href={`tel:${act.telephone}`} style={{ color: '#0066cc', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>
                                        📞 Appeler ({act.telephone})
                                    </a>
                                )}

                            </div>
                        ))}

                        {activites.length === 0 && (
                            <p style={{ textAlign: 'center', color: '#888' }}>Aucune activité trouvée dans la base.</p>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}
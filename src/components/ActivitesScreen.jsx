// src/components/ActivitesScreen.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// 1. On ajoute les icônes pour le design premium
import { Image as ImageIcon, ChevronRight } from 'lucide-react';

export default function ActivitesScreen() {
    const [activites, setActivites] = useState([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        async function chercherActivites() {
            const { data, error } = await supabase.from('activites').select('*');

            if (error) {
                console.error("Erreur Supabase :", error);
            } else {
                setActivites(data);
            }
            setChargement(false);
        }

        chercherActivites();
    }, []);

    return (
        <div className="vue active app-page" style={{ background: 'transparent' }}>
            {/* J'ai rendu le header transparent pour que ça fusionne avec ton fond d'écran */}
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>🌲 Activités</h2>
            </header>

            <div className="app-content">
                {chargement ? (
                    <div className="loading" style={{ color: 'white' }}>Chargement des activités... ⏳</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

                        {/* Au lieu de faire activites.map(...) et d'afficher les vrais noms, 
                            on crée une boucle factice de 4 éléments pour afficher ton visuel premium "Fantôme" 
                        */}
                        {[1, 2, 3, 4].map((item, index) => (
                            <div key={index} className="glass-list-card">
                                <div className="glass-card-image-placeholder">
                                    <ImageIcon size={24} color="rgba(255,255,255,0.3)" />
                                </div>
                                <div className="glass-card-content">
                                    {/* On varie la largeur des lignes selon l'index pour faire plus naturel */}
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
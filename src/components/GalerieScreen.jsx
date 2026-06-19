import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
// On importe l'icône Image pour faire joli dans les cases vides
import { Image as ImageIcon } from 'lucide-react';

export default function GalerieScreen() {
    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        async function chercherImages() {
            const { data } = await supabase.storage.from('galerie').list('');
            if (data) {
                const urls = data
                    .filter(file => file.name !== '.emptyFolderPlaceholder')
                    .map(file => {
                        const { data: urlData } = supabase.storage.from('galerie').getPublicUrl(file.name);
                        return urlData.publicUrl;
                    });
                setImages(urls);
            }
            setChargement(false);
        }
        chercherImages();
    }, []);

    // Tes fonctions pour le slider (gardées précieusement pour plus tard)
    const prevSlide = () => setIndex(index === 0 ? images.length - 1 : index - 1);
    const nextSlide = () => setIndex(index === images.length - 1 ? 0 : index + 1);

    return (
        <div className="vue active app-page" style={{ background: 'transparent' }}>

            {/* Header en verre fumé */}
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>📸 Galerie</h2>
            </header>

            <div className="app-content">
                {chargement ? (
                    <div className="loading" style={{ color: 'white' }}>Accès Cloud... ☁️</div>
                ) : (
                    /* LA GRILLE FANTÔME (Style Apple Photos) */
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)', /* 3 colonnes parfaites */
                        gap: '8px',
                        padding: '5px'
                    }}>

                        {/* On génère 12 fausses cases carrées en verre */}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => (
                            <div key={index} style={{
                                aspectRatio: '1 / 1', /* Force la case à être un carré parfait */
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '12px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backdropFilter: 'blur(15px)',
                                boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                            }}>
                                <ImageIcon size={28} color="rgba(255,255,255,0.15)" />
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
}
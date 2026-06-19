import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function GalerieScreen() {
    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        async function chercherImages() {
            // On liste tous les fichiers dans le dossier 'galerie'
            const { data } = await supabase.storage.from('galerie').list('');
            if (data) {
                const urls = data
                    .filter(file => file.name !== '.emptyFolderPlaceholder')
                    .map(file => {
                        // On génère le lien public pour chaque image
                        const { data: urlData } = supabase.storage.from('galerie').getPublicUrl(file.name);
                        return urlData.publicUrl;
                    });
                setImages(urls);
            }
            setChargement(false);
        }
        chercherImages();
    }, []);

    // Fonctions pour changer d'image
    const prevSlide = () => setIndex(index === 0 ? images.length - 1 : index - 1);
    const nextSlide = () => setIndex(index === images.length - 1 ? 0 : index + 1);

    return (
        <div className="vue active app-page">
            <header className="app-header"><h2>📸 Galerie</h2></header>
            <div className="app-content">
                {chargement ? <div className="loading">Accès Cloud... ☁️</div> : (
                    images.length === 0 ? <p style={{textAlign:'center'}}>Aucune photo.</p> : (
                        <div className="slider-container">
                            <button className="slider-btn prev" onClick={prevSlide}>❮</button>
                            <img className="slider-img" src={images[index]} alt={`Souvenir ${index}`} />
                            <button className="slider-btn next" onClick={nextSlide}>❯</button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
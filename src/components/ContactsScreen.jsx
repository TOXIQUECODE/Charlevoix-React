import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function ContactsScreen() {
    const [contacts, setContacts] = useState([]);
    const [chargement, setChargement] = useState(true);

    // États pour le clavier téléphonique
    const [showDialpad, setShowDialpad] = useState(false);
    const [numero, setNumero] = useState("");

    useEffect(() => {
        async function chercherContacts() {
            const { data } = await supabase.from('contacts').select('*');
            if (data) setContacts(data);
            setChargement(false);
        }
        chercherContacts();
    }, []);

    // Génère la bonne URL pour la photo de profil
    const getImageUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const { data } = supabase.storage.from('contacts').getPublicUrl(url);
        return data.publicUrl;
    };

    // Logique du clavier
    const ajouterChiffre = (c) => { if (numero.length < 10) setNumero(numero + c); };
    const effacerChiffre = () => setNumero(numero.slice(0, -1));
    const appeler = () => { if (numero) window.location.href = `tel:${numero}`; };

    // Formate les numéros avec des tirets
    const formatNumero = (num) => {
        let match = num.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (!match) return num;
        return !match[2] ? match[1] : `${match[1]}-${match[2]}${match[3] ? '-' + match[3] : ''}`;
    };

    return (
        <div className="vue active app-page" style={{ backgroundColor: showDialpad ? '#000' : '#f2f2f2' }}>

            {!showDialpad ? (
                // VUE 1 : LE RÉPERTOIRE
                <>
                    <header className="app-header" style={{ background: 'linear-gradient(to bottom, #bd1c1c, #8b0000)' }}><h2>👤 Contacts</h2></header>
                    <div className="app-content" style={{ padding: 0 }}>
                        {chargement ? <div className="loading" style={{ padding: '15px' }}>Chargement...</div> : (
                            <div>
                                {contacts.map((c, i) => (
                                    <a key={i} href={`tel:${c.telephone}`} style={{ textDecoration: 'none' }}>
                                        <div className="gta-contact-item">
                                            <div className="gta-contact-icon" style={{ background: c.photo_url ? `url('${getImageUrl(c.photo_url)}') center/cover` : '#666' }}>
                                                {!c.photo_url && '👤'}
                                            </div>
                                            <div className="gta-contact-name">{c.nom}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Bouton pour ouvrir le clavier */}
                    <div className="gta-contacts-footer" style={{ borderTop: 'none' }}>
                        <div className="dialpad-icon" onClick={() => setShowDialpad(true)}>
                            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        </div>
                    </div>
                </>
            ) : (
                // VUE 2 : LE CLAVIER TÉLÉPHONIQUE (DIALPAD)
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="dialpad-display-container" style={{ borderBottom: 'none', height: '100px' }}>
                        <div id="dialpad-display">{formatNumero(numero)}</div>
                    </div>
                    <div className="dialpad-grid">
                        {['1','2','3','4','5','6','7','8','9'].map(n => (
                            <button key={n} className="dial-btn" onClick={() => ajouterChiffre(n)}>{n}</button>
                        ))}
                        <button onClick={effacerChiffre} style={{ color: '#e74c3c', fontSize: '24px', background: 'transparent', border: 'none', cursor: 'pointer' }}>❌</button>
                        <button className="dial-btn" onClick={() => ajouterChiffre('0')}>0</button>
                        <button onClick={appeler} style={{ color: '#2ecc71', fontSize: '28px', background: 'transparent', border: 'none', cursor: 'pointer' }}>📞</button>
                    </div>
                    <div className="gta-contacts-footer" style={{ marginTop: 'auto', borderTop: 'none' }}>
                        <div style={{ color: '#fff', fontSize: '22px', cursor: 'pointer' }} onClick={effacerChiffre}>⌫</div>
                        <div style={{ color: '#2ecc71', fontSize: '28px', transform: 'scaleX(-1)', cursor: 'pointer' }} onClick={appeler}>📞</div>
                        <div style={{ color: '#e74c3c', fontSize: '26px', fontWeight: 900, cursor: 'pointer' }} onClick={() => setShowDialpad(false)}>↩</div>
                    </div>
                </div>
            )}

        </div>
    );
}
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User as UserIcon, Phone } from 'lucide-react';

export default function ContactsScreen() {
    const [contacts, setContacts] = useState([]);
    const [chargement, setChargement] = useState(true);

    // Une belle palette d'énergies pour tes contacts
    const couleursElectriques = ['#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c'];

    useEffect(() => {
        async function chercherContacts() {
            // On récupère les données de la table "contacts"
            const { data } = await supabase.from('contacts').select('*');
            if (data) setContacts(data);
            setChargement(false);
        }
        chercherContacts();
    }, []);

    return (
        <div className="vue active app-page" style={{ background: 'transparent' }}>

            {/* Header en verre fumé */}
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>📱 Contacts</h2>
            </header>

            <div className="app-content">
                {chargement ? (
                    <div className="loading" style={{ color: 'white' }}>Synchronisation... 🔄</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {contacts.map((contact, index) => {
                            const couleurActuelle = couleursElectriques[index % couleursElectriques.length];

                            return (
                                <div key={index} className="electric-card-wrapper" style={{ '--electric-color': couleurActuelle, marginBottom: '10px' }}>
                                    <div className="electric-card-inner" style={{ padding: '10px 15px' }}>

                                        {/* Avatar du contact (Rond) */}
                                        <div className="glass-card-image-placeholder" style={{
                                            background: 'rgba(0,0,0,0.6)',
                                            width: '45px',
                                            height: '45px',
                                            borderRadius: '50%', /* Force le cercle parfait */
                                            marginRight: '15px'
                                        }}>
                                            <UserIcon size={20} color={couleurActuelle} style={{ filter: `drop-shadow(0 0 5px ${couleurActuelle})` }} />
                                        </div>

                                        {/* Infos du contact */}
                                        <div className="glass-card-content" style={{ flex: 1 }}>
                                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.5px' }}>{contact.nom}</div>
                                            {contact.description && (
                                                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{contact.description}</div>
                                            )}
                                        </div>

                                        {/* Bouton d'appel rapide à droite */}
                                        {contact.telephone && (
                                            <a href={`tel:${contact.telephone}`} style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '40px',
                                                height: '40px',
                                                background: 'rgba(46, 204, 113, 0.15)',
                                                borderRadius: '50%',
                                                color: '#2ecc71',
                                                textDecoration: 'none',
                                                border: '1px solid rgba(46, 204, 113, 0.3)',
                                                transition: 'all 0.2s ease'
                                            }}>
                                                <Phone size={18} style={{ filter: 'drop-shadow(0 0 4px rgba(46, 204, 113, 0.5))' }} />
                                            </a>
                                        )}

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
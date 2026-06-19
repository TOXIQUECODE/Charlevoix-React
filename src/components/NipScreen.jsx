import { useState, useEffect } from 'react';

export default function NipScreen({ onUnlock, onCancel }) {
    const [codeSaisi, setCodeSaisi] = useState("");
    const [erreur, setErreur] = useState(false);
    const NIP_SECRET = "5025";

    useEffect(() => {
        if (codeSaisi.length === 4) {
            if (codeSaisi === NIP_SECRET) {
                onUnlock(); // Code bon : on ouvre les portes !
            } else {
                setErreur(true); // Code faux : erreur rouge
                setTimeout(() => {
                    setCodeSaisi("");
                    setErreur(false);
                }, 500);
            }
        }
    }, [codeSaisi, onUnlock]);

    const ajouterChiffre = (c) => { if (codeSaisi.length < 4) setCodeSaisi(codeSaisi + c); };
    const effacer = () => setCodeSaisi(codeSaisi.slice(0, -1));

    return (
        <div className="vue active" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', justifyContent: 'center', alignItems: 'center', zIndex: 200, position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}>
            <div className="nip-content" style={{ background: '#fdfdfd', padding: '25px 20px', borderRadius: '20px', width: '85%', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '5px', color: '#111', fontSize: '18px' }}>Accès Restreint</h3>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>Veuillez entrer votre NIP.</p>

                <div className="nip-dots" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '25px' }}>
                    {[0, 1, 2, 3].map(i => (
                        <span key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid #ccc', background: i < codeSaisi.length ? (erreur ? '#e74c3c' : '#333') : 'transparent', borderColor: erreur && i < codeSaisi.length ? '#e74c3c' : (i < codeSaisi.length ? '#333' : '#ccc') }}></span>
                    ))}
                </div>

                <div className="nip-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {['1','2','3','4','5','6','7','8','9'].map(n => (
                        <button key={n} onClick={() => ajouterChiffre(n)} style={{ padding: '15px 0', fontSize: '22px', fontWeight: 500, background: '#f0f0f0', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>{n}</button>
                    ))}
                    <button onClick={onCancel} style={{ color: '#e74c3c', fontSize: '14px', background: '#f0f0f0', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Annuler</button>
                    <button onClick={() => ajouterChiffre('0')} style={{ padding: '15px 0', fontSize: '22px', fontWeight: 500, background: '#f0f0f0', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>0</button>
                    <button onClick={effacer} style={{ fontSize: '22px', background: '#f0f0f0', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>⌫</button>
                </div>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, Plus, Save, Download, Crown } from 'lucide-react';

export default function ProjectXScreen() {
    const [data, setData] = useState(() => {
        try {
            const saved = localStorage.getItem('projectX_current');
            if (saved) return JSON.parse(saved);
        } catch (error) {
            console.error("Cache corrompu, on repart à zéro");
            localStorage.removeItem('projectX_current');
        }
        return {
            "24": [{ id: Date.now(), time: "", nom: "", nota: "" }],
            "25": [{ id: Date.now() + 1, time: "", nom: "", nota: "" }],
            "26": [{ id: Date.now() + 2, time: "", nom: "", nota: "" }]
        };
    });

    const [activeDay, setActiveDay] = useState(null);
    const [backupCode, setBackupCode] = useState("");
    const [inputCode, setInputCode] = useState("");

    // ==========================================
    // MOTEUR DU CARROUSEL 3D
    // ==========================================
    const daysList = ["24", "25", "26"];
    const [frontIndex, setFrontIndex] = useState(0); // Qui est au premier plan ? (0, 1 ou 2)
    const [touchStartY, setTouchStartY] = useState(null); // Pour le swipe

    // Calcule la position (0=devant, 1=milieu, 2=fond) pour chaque carte
    const getPosClass = (index) => {
        const pos = (index - frontIndex + 3) % 3;
        return `pos-${pos}`;
    };

    // Gestion des clics sur les cartes
    const handleCardClick = (index, dayStr) => {
        const pos = (index - frontIndex + 3) % 3;
        if (pos === 0) {
            setActiveDay(dayStr); // Si elle est devant, on l'ouvre
        } else {
            setFrontIndex(index); // Sinon, on la fait passer devant
        }
    };

    // Détection du glissement (Swipe Up / Swipe Down)
    const handleTouchStart = (e) => setTouchStartY(e.touches[0].clientY);
    const handleTouchEnd = (e) => {
        if (!touchStartY) return;
        const diff = touchStartY - e.changedTouches[0].clientY;

        if (diff > 40) {
            // Glissé vers le haut -> Carte suivante
            setFrontIndex((prev) => (prev + 1) % 3);
        } else if (diff < -40) {
            // Glissé vers le bas -> Carte précédente
            setFrontIndex((prev) => (prev - 1 + 3) % 3);
        }
        setTouchStartY(null);
    };

    // ==========================================
    // SAUVEGARDES ET TABLEAU
    // ==========================================
    useEffect(() => {
        localStorage.setItem('projectX_current', JSON.stringify(data));
    }, [data]);

    const updateRow = (day, id, field, value) => {
        setData(prev => ({ ...prev, [day]: prev[day].map(row => row.id === id ? { ...row, [field]: value } : row) }));
    };

    const addRow = (day) => {
        setData(prev => ({ ...prev, [day]: [...prev[day], { id: Date.now(), time: "", nom: "", nota: "" }] }));
    };

    const handleSaveBackup = () => {
        const code = Math.floor(10 + Math.random() * 90).toString();
        const backups = JSON.parse(localStorage.getItem('projectX_backups') || '{}');
        backups[code] = data;
        localStorage.setItem('projectX_backups', JSON.stringify(backups));
        setBackupCode(code);
        setTimeout(() => setBackupCode(""), 8000);
    };

    const handleLoadBackup = () => {
        const backups = JSON.parse(localStorage.getItem('projectX_backups') || '{}');
        if (backups[inputCode]) {
            setData(backups[inputCode]);
            alert("Données restaurées avec succès ! 👑");
            setInputCode("");
        } else {
            alert("Code invalide ou introuvable.");
        }
    };

    // VUE 1 : LE TABLEAU ZOOMÉ
    if (activeDay) {
        return (
            <div className="vue active px-zoomed-container" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
                    <button onClick={() => setActiveDay(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px', borderRadius: '50%', color: 'white', cursor: 'pointer' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <h2 style={{ margin: 0, color: '#e6c280' }}>Planification du {activeDay}</h2>
                </div>

                <div className="app-content" style={{ padding: 0 }}>
                    <div className="px-table-wrapper">
                        <table className="px-table">
                            <thead>
                            <tr>
                                <th style={{ width: '25%' }}>Heure</th>
                                <th style={{ width: '40%' }}>Lieu / Nom</th>
                                <th style={{ width: '35%' }}>Notes</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data[activeDay].map((row) => (
                                <tr key={row.id}>
                                    <td><input className="px-input" placeholder="00:00" value={row.time} onChange={(e) => updateRow(activeDay, row.id, 'time', e.target.value)} /></td>
                                    <td><input className="px-input" placeholder="Lieu..." value={row.nom} onChange={(e) => updateRow(activeDay, row.id, 'nom', e.target.value)} /></td>
                                    <td><input className="px-input" placeholder="Infos..." value={row.nota} onChange={(e) => updateRow(activeDay, row.id, 'nota', e.target.value)} /></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <button className="px-btn-add" onClick={() => addRow(activeDay)}>
                        <Plus size={20} /> Ajouter une ligne
                    </button>
                </div>
            </div>
        );
    }

    // VUE 2 : L'ACCUEIL AVEC LA PILE DE CARTES CARROUSEL
    return (
        <div className="vue active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="app-header">
                <h2>Project X <Crown size={18} color="#e6c280" style={{ marginLeft: '5px', verticalAlign: 'middle' }}/></h2>
            </div>

            <div className="app-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ textAlign: 'center', opacity: 0.7, fontSize: '14px', marginBottom: 0 }}>
                    Sélectionne ou glisse une journée.
                </p>

                {/* LA PILE 3D (AVEC GESTION DU SWIPE) */}
                <div className="px-stack-container" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    {daysList.map((dayStr, index) => (
                        <div
                            key={dayStr}
                            className={`px-card ${getPosClass(index)}`}
                            onClick={() => handleCardClick(index, dayStr)}
                        >
                            <div style={{ background: '#e6c280', padding: '12px', borderRadius: '12px', display: 'flex' }}>
                                <Calendar size={24} color="#000" />
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>Journée du {dayStr}</h3>
                                <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>{data[dayStr].length} activité(s)</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p style={{ textAlign: 'center', opacity: 0.4, fontSize: '11px', marginTop: '10px' }}>
                    👆 Glisse vers le haut ou le bas
                </p>

                <div className="px-toolbar">
                    <button onClick={handleSaveBackup} title="Générer un code de sauvegarde"><Save size={20} /></button>
                    <input
                        type="text"
                        maxLength="2"
                        placeholder={backupCode ? `Code: ${backupCode}` : "Code..."}
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value.replace(/[^0-9]/g, ''))}
                    />
                    <button onClick={handleLoadBackup} title="Charger avec le code"><Download size={20} /></button>
                </div>
                {backupCode && <p style={{ color: '#2ecc71', textAlign: 'center', fontSize: '12px', marginTop: '5px' }}>Code généré : <b>{backupCode}</b>. Note-le !</p>}
            </div>
        </div>
    );
}
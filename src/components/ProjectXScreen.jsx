import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, Plus, Save, Download, Crown } from 'lucide-react';

export default function ProjectXScreen() {
    // 1. L'état qui contient toutes les données (Mémorisé depuis la session précédente)
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('projectX_current');
        if (saved) return JSON.parse(saved);
        return {
            "24": [{ id: Date.now(), time: "", nom: "", nota: "" }],
            "25": [{ id: Date.now() + 1, time: "", nom: "", nota: "" }],
            "26": [{ id: Date.now() + 2, time: "", nom: "", nota: "" }]
        };
    });

    const [activeDay, setActiveDay] = useState(null);
    const [backupCode, setBackupCode] = useState("");
    const [inputCode, setInputCode] = useState("");

    // 2. Sauvegarde automatique à chaque modification
    useEffect(() => {
        localStorage.setItem('projectX_current', JSON.stringify(data));
    }, [data]);

    // 3. Gestion des lignes du tableau
    const updateRow = (day, id, field, value) => {
        setData(prev => ({
            ...prev,
            [day]: prev[day].map(row => row.id === id ? { ...row, [field]: value } : row)
        }));
    };

    const addRow = (day) => {
        setData(prev => ({
            ...prev,
            [day]: [...prev[day], { id: Date.now(), time: "", nom: "", nota: "" }]
        }));
    };

    // 4. Système de Backup (Code à 2 chiffres)
    const handleSaveBackup = () => {
        // Génère un code entre 10 et 99
        const code = Math.floor(10 + Math.random() * 90).toString();
        const backups = JSON.parse(localStorage.getItem('projectX_backups') || '{}');
        backups[code] = data;
        localStorage.setItem('projectX_backups', JSON.stringify(backups));
        setBackupCode(code);
        setTimeout(() => setBackupCode(""), 8000); // Disparaît après 8 sec
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

    // ==========================================
    // VUE 1 : LE TABLEAU ZOOMÉ (Quand un jour est sélectionné)
    // ==========================================
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
                                <th style={{ width: '30%' }}>Time/Date</th>
                                <th style={{ width: '35%' }}>Nom</th>
                                <th style={{ width: '35%' }}>Nota</th>
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

    // ==========================================
    // VUE 2 : L'ACCUEIL AVEC LA PILE DE CARTES 3D
    // ==========================================
    return (
        <div className="vue active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="app-header">
                <h2>Project X <Crown size={18} color="#e6c280" style={{ marginLeft: '5px', verticalAlign: 'middle' }}/></h2>
            </div>

            <div className="app-content" style={{ display: 'flex', flexDirection: 'column' }}>

                <p style={{ textAlign: 'center', opacity: 0.7, fontSize: '14px', marginBottom: 0 }}>
                    Sélectionne une journée.
                </p>

                {/* LA PILE 3D */}
                <div className="px-stack-container">
                    <div className="px-card day-26" onClick={() => setActiveDay("26")}>
                        <div style={{ background: '#e6c280', padding: '12px', borderRadius: '12px' }}><Calendar size={24} color="#000" /></div>
                        <div><h3 style={{ margin: 0 }}>Journée du 26</h3><p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>{data["26"].length} activité(s)</p></div>
                    </div>

                    <div className="px-card day-25" onClick={() => setActiveDay("25")}>
                        <div style={{ background: '#e6c280', padding: '12px', borderRadius: '12px' }}><Calendar size={24} color="#000" /></div>
                        <div><h3 style={{ margin: 0 }}>Journée du 25</h3><p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>{data["25"].length} activité(s)</p></div>
                    </div>

                    <div className="px-card day-24" onClick={() => setActiveDay("24")}>
                        <div style={{ background: '#e6c280', padding: '12px', borderRadius: '12px' }}><Calendar size={24} color="#000" /></div>
                        <div><h3 style={{ margin: 0 }}>Journée du 24</h3><p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>{data["24"].length} activité(s)</p></div>
                    </div>
                </div>

                {/* LA BARRE DE SAUVEGARDE EN BAS */}
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
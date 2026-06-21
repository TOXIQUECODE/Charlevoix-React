import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, Plus, Save, Download, Crown } from 'lucide-react';

// ==========================================
// BASE DE DONNÉES DES CHOIX DU SITE
// ==========================================
// Tu pourras modifier cette liste avec les vrais noms de ton site !
const siteOptions = {
    "Activité": [
        "Où l'on se crée des souvenirs",
        "Randonnée",
        "Croisière aux baleines",
        "Casino de Charlevoix",
        "Autre..."
    ],
    "Pêche": [
        "Lac de la pourvoirie",
        "Rivière Gouffre",
        "Pêche au saumon",
        "Autre..."
    ],
    "Restaurant": [
        "Le Saint-Pub",
        "Casse-croûte local",
        "Souper au chalet",
        "Autre..."
    ],
    "Trajet": [
        "Départ vers l'activité",
        "Retour au chalet",
        "Arrêt épicerie",
        "Autre..."
    ]
};

export default function ProjectXScreen() {
    // 1. LA MÉMOIRE
    const [data, setData] = useState(() => {
        try {
            const saved = localStorage.getItem('projectX_current');
            if (saved) return JSON.parse(saved);
        } catch (error) {
            console.warn("Cache réinitialisé.");
            localStorage.removeItem('projectX_current');
        }

        // Le format par défaut (avec la première option pré-sélectionnée)
        return {
            "24": [{ id: Date.now(), quand: "12:00", type: "Activité", quoi: siteOptions["Activité"][0] }],
            "25": [{ id: Date.now() + 1, quand: "12:00", type: "Activité", quoi: siteOptions["Activité"][0] }],
            "26": [{ id: Date.now() + 2, quand: "12:00", type: "Activité", quoi: siteOptions["Activité"][0] }]
        };
    });

    const [activeDay, setActiveDay] = useState(null);
    const [backupCode, setBackupCode] = useState("");
    const [inputCode, setInputCode] = useState("");

    // ==========================================
    // MOTEUR DU CARROUSEL 3D
    // ==========================================
    const daysList = ["24", "25", "26"];
    const [frontIndex, setFrontIndex] = useState(0);
    const [touchStartY, setTouchStartY] = useState(null);

    const getPosClass = (index) => `pos-${(index - frontIndex + 3) % 3}`;

    const handleCardClick = (index, dayStr) => {
        const pos = (index - frontIndex + 3) % 3;
        if (pos === 0) setActiveDay(dayStr);
        else setFrontIndex(index);
    };

    const handleDragStart = (clientY) => setTouchStartY(clientY);
    const handleDragEnd = (clientY) => {
        if (!touchStartY) return;
        const diff = touchStartY - clientY;
        if (diff > 30) setFrontIndex((prev) => (prev + 1) % 3);
        else if (diff < -30) setFrontIndex((prev) => (prev - 1 + 3) % 3);
        setTouchStartY(null);
    };

    // ==========================================
    // SAUVEGARDES ET MISES À JOUR
    // ==========================================
    useEffect(() => {
        localStorage.setItem('projectX_current', JSON.stringify(data));
    }, [data]);

    const updateRow = (day, id, field, value) => {
        setData(prev => ({ ...prev, [day]: prev[day].map(row => row.id === id ? { ...row, [field]: value } : row) }));
    };

    // Gestion spéciale quand on change le TYPE (Activité -> Pêche, etc.)
    const handleTypeChange = (day, id, newType) => {
        const newQuoi = siteOptions[newType][0]; // Prend le premier élément de la nouvelle catégorie
        setData(prev => ({
            ...prev,
            [day]: prev[day].map(row => row.id === id ? { ...row, type: newType, quoi: newQuoi } : row)
        }));
    };

    const addRow = (day) => {
        setData(prev => ({
            ...prev,
            [day]: [...prev[day], { id: Date.now(), quand: "12:00", type: "Activité", quoi: siteOptions["Activité"][0] }]
        }));
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

    // ==========================================
    // VUE 1 : LE TABLEAU ZOOMÉ (QUAND / QUOI)
    // ==========================================
    if (activeDay) {
        return (
            <div className="vue active px-zoomed-container" style={{ padding: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '15px' }}>
                    <button onClick={() => setActiveDay(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px', borderRadius: '50%', color: 'white', cursor: 'pointer' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <h2 style={{ margin: 0, color: '#e6c280' }}>Planification du {activeDay}</h2>
                </div>

                <div className="app-content" style={{ padding: 0 }}>
                    <div className="px-table-wrapper">
                        <table className="px-table" style={{ tableLayout: 'fixed' }}>
                            <thead>
                            <tr>
                                <th style={{ width: '30%', textAlign: 'center' }}>QUAND</th>
                                <th style={{ width: '70%', paddingLeft: '10px' }}>QUOI</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data[activeDay].map((row) => (
                                <tr key={row.id}>

                                    {/* COLONNE QUAND (Sélecteur d'heure) */}
                                    <td style={{ borderRight: '1px solid rgba(255,255,255,0.1)', verticalAlign: 'top', padding: '10px 0' }}>
                                        <input
                                            type="time"
                                            className="px-input"
                                            style={{ fontSize: '15px', width: '100%', boxSizing: 'border-box' }}
                                            value={row.quand}
                                            onChange={(e) => updateRow(activeDay, row.id, 'quand', e.target.value)}
                                        />
                                    </td>

                                    {/* COLONNE QUOI (Type empilé sur le Nom) */}
                                    <td style={{ padding: '8px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {/* Le menu déroulant du TYPE */}
                                            <select
                                                className="px-select"
                                                style={{ width: '100%', boxSizing: 'border-box' }}
                                                value={row.type}
                                                onChange={(e) => handleTypeChange(activeDay, row.id, e.target.value)}
                                            >
                                                <option value="Activité">🎯 Activité</option>
                                                <option value="Pêche">🐟 Pêche</option>
                                                <option value="Restaurant">🍔 Resto</option>
                                                <option value="Trajet">🚗 Trajet</option>
                                            </select>

                                            {/* Le menu déroulant du LIEU/NOM (Dynamique) */}
                                            <select
                                                className="px-select"
                                                style={{ width: '100%', boxSizing: 'border-box', color: 'white', background: 'rgba(255,255,255,0.05)' }}
                                                value={row.quoi}
                                                onChange={(e) => updateRow(activeDay, row.id, 'quoi', e.target.value)}
                                            >
                                                {siteOptions[row.type].map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>

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
    // VUE 2 : LA PILE DE CARTES CARROUSEL
    // ==========================================
    return (
        <div className="vue active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="app-header">
                <h2>Project X <Crown size={18} color="#e6c280" style={{ marginLeft: '5px', verticalAlign: 'middle' }}/></h2>
            </div>

            <div className="app-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ textAlign: 'center', opacity: 0.7, fontSize: '14px', marginBottom: 0 }}>
                    Clique ou glisse une journée.
                </p>

                <div
                    className="px-stack-container"
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
                    onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientY)}
                    onMouseDown={(e) => handleDragStart(e.clientY)}
                    onMouseUp={(e) => handleDragEnd(e.clientY)}
                    onMouseLeave={(e) => { if (touchStartY) handleDragEnd(e.clientY); }}
                >
                    {daysList.map((dayStr, index) => (
                        <div key={dayStr} className={`px-card ${getPosClass(index)}`} onClick={() => handleCardClick(index, dayStr)}>
                            <div style={{ background: '#e6c280', padding: '12px', borderRadius: '12px', display: 'flex' }}>
                                <Calendar size={24} color="#000" />
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>Journée du {dayStr}</h3>
                                <p style={{ margin: 0, opacity: 0.6, fontSize: '12px' }}>{data[dayStr].length} étape(s) prévue(s)</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p style={{ textAlign: 'center', opacity: 0.4, fontSize: '11px', marginTop: '10px' }}>
                    ↕️ Glisse haut/bas pour faire tourner
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
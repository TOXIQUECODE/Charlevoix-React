import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, Plus, Save, Download, Crown, TreePine, ShoppingBag, Fish, Utensils, Car } from 'lucide-react';

// ==========================================
// HARMONISATION : Icônes, Couleurs et Listes des autres écrans
// ==========================================
// Remplace les fausses données ci-dessous par les VRAIES listes
// que tu utilises dans ActivitesScreen, PecheScreen, etc.
const CONFIG_APPLICATIONS = {
    "Activités": {
        icon: TreePine,
        color: "#2ecc71",
        listes: ["Randonnée Acropole", "AURA Québec", "Casino de Charlevoix", "Autre activité..."]
    },
    "Magasins": {
        icon: ShoppingBag,
        color: "#f39c12",
        listes: ["Boutique locale", "Épicerie", "Souvenirs", "Autre magasin..."]
    },
    "Pêche": {
        icon: Fish,
        color: "#3498db",
        listes: ["Quai de Baie-St-Paul", "Rivière du Gouffre", "Pourvoirie", "Autre spot..."]
    },
    "Restaurants": {
        icon: Utensils,
        color: "#d35400",
        listes: ["Le Saint-Pub", "Mouton Noir", "Casse-croûte", "Autre resto..."]
    },
    "Trajets": {
        icon: Car,
        color: "#95a5a6",
        listes: ["Départ du Chalet", "Retour au Chalet", "En route", "Arrêt essence..."]
    }
};

// On récupère facilement tous les types disponibles (Activités, Pêche, etc.)
const typesDisponibles = Object.keys(CONFIG_APPLICATIONS);

export default function ProjectXScreen() {
    // 1. LA MÉMOIRE INITIALE
    const [data, setData] = useState(() => {
        try {
            const saved = localStorage.getItem('projectX_current');
            if (saved) return JSON.parse(saved);
        } catch (error) {
            localStorage.removeItem('projectX_current');
        }

        // Par défaut, la première ligne utilise le premier type ("Activités") et son premier élément
        const defaultType = typesDisponibles[0];
        const defaultQuoi = CONFIG_APPLICATIONS[defaultType].listes[0];

        return {
            "24": [{ id: Date.now(), quand: "12:00", type: defaultType, quoi: defaultQuoi }],
            "25": [{ id: Date.now() + 1, quand: "12:00", type: defaultType, quoi: defaultQuoi }],
            "26": [{ id: Date.now() + 2, quand: "12:00", type: defaultType, quoi: defaultQuoi }]
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

    // Quand on change la catégorie, on force le nom à devenir le 1er élément de la nouvelle liste
    const handleTypeChange = (day, id, newType) => {
        const newQuoi = CONFIG_APPLICATIONS[newType].listes[0];
        setData(prev => ({
            ...prev,
            [day]: prev[day].map(row => row.id === id ? { ...row, type: newType, quoi: newQuoi } : row)
        }));
    };

    const addRow = (day) => {
        const defaultType = typesDisponibles[0];
        setData(prev => ({
            ...prev,
            [day]: [...prev[day], { id: Date.now(), quand: "12:00", type: defaultType, quoi: CONFIG_APPLICATIONS[defaultType].listes[0] }]
        }));
    };

    // Fonctions Backup (inchangées)
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
    // VUE 1 : LE TABLEAU ZOOMÉ
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
                        <table className="px-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                            <thead>
                            <tr>
                                <th style={{ width: '25%', textAlign: 'center' }}>Heure</th>
                                <th style={{ width: '75%', paddingLeft: '15px' }}>Activité Prévue</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data[activeDay].map((row) => {
                                // On récupère dynamiquement l'icône, la couleur et la liste pour cette ligne spécifique
                                const configLigne = CONFIG_APPLICATIONS[row.type];
                                const IconeDynamique = configLigne.icon;

                                return (
                                    <tr key={row.id}>
                                        {/* COLONNE HEURE */}
                                        <td style={{ borderRight: '1px solid rgba(255,255,255,0.1)', verticalAlign: 'middle', padding: '10px 5px' }}>
                                            <input
                                                type="time"
                                                className="px-input"
                                                style={{ fontSize: '14px', width: '100%', padding: '5px' }}
                                                value={row.quand}
                                                onChange={(e) => updateRow(activeDay, row.id, 'quand', e.target.value)}
                                            />
                                        </td>

                                        {/* COLONNE QUOI (Icône + Menus empilés) */}
                                        <td style={{ padding: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                                                {/* L'ICÔNE LUCIDE MAGIQUE QUI CHANGE DE COULEUR */}
                                                <div style={{
                                                    background: 'rgba(255,255,255,0.05)',
                                                    padding: '8px',
                                                    borderRadius: '10px',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                    boxShadow: `0 0 10px ${configLigne.color}40` // Petite lueur de la bonne couleur
                                                }}>
                                                    <IconeDynamique size={26} color={configLigne.color} />
                                                </div>

                                                {/* LES DEUX MENUS DÉROULANTS */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>

                                                    {/* 1. Le choix de l'application (Pêche, Magasins, etc.) */}
                                                    <select
                                                        className="px-select"
                                                        style={{ width: '100%' }}
                                                        value={row.type}
                                                        onChange={(e) => handleTypeChange(activeDay, row.id, e.target.value)}
                                                    >
                                                        {typesDisponibles.map(type => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>

                                                    {/* 2. Le choix de l'élément (Le contenu change selon l'application) */}
                                                    <select
                                                        className="px-select"
                                                        style={{ width: '100%', color: 'white', background: 'rgba(255,255,255,0.05)' }}
                                                        value={row.quoi}
                                                        onChange={(e) => updateRow(activeDay, row.id, 'quoi', e.target.value)}
                                                    >
                                                        {configLigne.listes.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>

                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>

                    <button className="px-btn-add" onClick={() => addRow(activeDay)}>
                        <Plus size={20} /> Ajouter une étape
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
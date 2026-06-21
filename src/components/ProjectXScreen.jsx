import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Calendar, ChevronLeft, Plus, Save, Download, Crown, TreePine, ShoppingBag, Fish, Utensils, Car, HelpCircle } from 'lucide-react';

const CONFIG_APPLICATIONS = {
    "Activités": { icon: TreePine, color: "#2ecc71" },
    "Magasins": { icon: ShoppingBag, color: "#f39c12" },
    "Pêche": { icon: Fish, color: "#3498db" },
    "Restaurants": { icon: Utensils, color: "#d35400" },
    "Trajets": { icon: Car, color: "#95a5a6" }
};
const typesDisponibles = Object.keys(CONFIG_APPLICATIONS);

export default function ProjectXScreen() {
    const [listesSite, setListesSite] = useState({
        "Activités": ["Chargement..."],
        "Magasins": ["Chargement..."],
        "Pêche": ["Chargement..."],
        "Restaurants": ["Chargement..."],
        "Trajets": ["Départ du Chalet", "Retour au Chalet", "En route", "Arrêt essence"]
    });

    useEffect(() => {
        async function chargerToutesLesDonnees() {
            const fetchNoms = async (table) => {
                const { data, error } = await supabase.from(table).select('nom');
                if (error || !data || data.length === 0) return ["(Aucun élément trouvé)"];
                return data.map(item => item.nom);
            };

            const activitesData = await fetchNoms('activites');
            const magasinsData = await fetchNoms('magasins');
            const pecheData = await fetchNoms('peche');
            const restaurantsData = await fetchNoms('magasins');

            setListesSite({
                "Activités": activitesData,
                "Magasins": magasinsData,
                "Pêche": pecheData,
                "Restaurants": restaurantsData,
                "Trajets": ["Départ du Chalet", "Retour au Chalet", "En route", "Arrêt essence"]
            });
        }
        chargerToutesLesDonnees();
    }, []);

    const [data, setData] = useState(() => {
        const defaultType = typesDisponibles[0];
        const newData = {
            "24": [{ id: Date.now(), quand: "12:00", type: defaultType, quoi: "Chargement..." }],
            "25": [{ id: Date.now() + 1, quand: "12:00", type: defaultType, quoi: "Chargement..." }],
            "26": [{ id: Date.now() + 2, quand: "12:00", type: defaultType, quoi: "Chargement..." }]
        };

        try {
            const saved = localStorage.getItem('projectX_current');
            if (saved) {
                let parsed = JSON.parse(saved);
                ["24", "25", "26"].forEach(day => {
                    if (parsed[day]) {
                        parsed[day] = parsed[day].map(row => {
                            if (row.type === "Activité") return { ...row, type: "Activités" };
                            if (row.type === "Restaurant") return { ...row, type: "Restaurants" };
                            return row;
                        });
                    }
                });
                return parsed;
            }
        } catch (error) {
            localStorage.removeItem('projectX_current');
        }
        return newData;
    });

    const [activeDay, setActiveDay] = useState(null);
    const [backupCode, setBackupCode] = useState("");
    const [inputCode, setInputCode] = useState("");

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

    useEffect(() => {
        localStorage.setItem('projectX_current', JSON.stringify(data));
    }, [data]);

    const updateRow = (day, id, field, value) => {
        setData(prev => ({ ...prev, [day]: prev[day].map(row => row.id === id ? { ...row, [field]: value } : row) }));
    };

    const handleTypeChange = (day, id, newType) => {
        const newQuoi = listesSite[newType][0];
        setData(prev => ({
            ...prev,
            [day]: prev[day].map(row => row.id === id ? { ...row, type: newType, quoi: newQuoi } : row)
        }));
    };

    const addRow = (day) => {
        const defaultType = typesDisponibles[0];
        setData(prev => ({
            ...prev,
            [day]: [...prev[day], { id: Date.now(), quand: "12:00", type: defaultType, quoi: listesSite[defaultType][0] }]
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
    // VUE 1 : LE TABLEAU ZOOMÉ (FIXÉ ET ÉLECTRIQUE)
    // ==========================================
    if (activeDay) {
        return (
            <div className="vue active px-zoomed-container">
                {/* L'en-tête (Fixe en haut, ne scrolle pas) */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '15px', flexShrink: 0, gap: '15px' }}>
                    <button onClick={() => setActiveDay(null)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px', borderRadius: '50%', color: 'white', cursor: 'pointer' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <h2 style={{ margin: 0, color: '#e6c280' }}>Planification du {activeDay}</h2>
                </div>

                {/* La zone de contenu (Défile indépendamment sans pousser l'écran) */}
                <div className="app-content" style={{ padding: '0 15px 20px 15px', flex: 1, overflowY: 'auto' }}>

                    {/* Le Wrapper Électrique */}
                    <div className="px-electric-table">
                        <div className="px-electric-inner">
                            <table className="px-table" style={{ tableLayout: 'fixed', width: '100%' }}>
                                <thead>
                                <tr>
                                    <th style={{ width: '25%', textAlign: 'center', background: 'rgba(0,0,0,0.6)' }}>Heure</th>
                                    <th style={{ width: '75%', paddingLeft: '15px', background: 'rgba(0,0,0,0.6)' }}>Activité Prévue</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data[activeDay].map((row) => {
                                    const configLigne = CONFIG_APPLICATIONS[row.type] || { icon: HelpCircle, color: "#ff0000" };
                                    const IconeDynamique = configLigne.icon;
                                    const listeActuelle = listesSite[row.type] || ["Erreur de liste"];

                                    return (
                                        <tr key={row.id}>
                                            <td style={{ borderRight: '1px solid rgba(255,255,255,0.1)', verticalAlign: 'middle', padding: '10px 5px' }}>
                                                <input
                                                    type="time"
                                                    className="px-input"
                                                    style={{ fontSize: '14px', width: '100%', padding: '5px' }}
                                                    value={row.quand}
                                                    onChange={(e) => updateRow(activeDay, row.id, 'quand', e.target.value)}
                                                />
                                            </td>

                                            <td style={{ padding: '10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        background: 'rgba(255,255,255,0.05)',
                                                        padding: '8px',
                                                        borderRadius: '10px',
                                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                        boxShadow: `0 0 10px ${configLigne.color}40`
                                                    }}>
                                                        <IconeDynamique size={26} color={configLigne.color} />
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
                                                        <select className="px-select" style={{ width: '100%' }} value={row.type} onChange={(e) => handleTypeChange(activeDay, row.id, e.target.value)}>
                                                            {typesDisponibles.map(type => (
                                                                <option key={type} value={type}>{type}</option>
                                                            ))}
                                                        </select>

                                                        <select className="px-select" style={{ width: '100%', color: 'white', background: 'rgba(255,255,255,0.05)' }} value={row.quoi} onChange={(e) => updateRow(activeDay, row.id, 'quoi', e.target.value)}>
                                                            {listeActuelle.map((optionNom, i) => (
                                                                <option key={`${optionNom}-${i}`} value={optionNom}>{optionNom}</option>
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
                    </div>

                    <button className="px-btn-add" onClick={() => addRow(activeDay)} style={{ marginBottom: '40px' }}>
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
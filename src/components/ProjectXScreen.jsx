import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Calendar, ChevronLeft, Plus, Save, Download, Crown, TreePine, ShoppingBag, Fish, Utensils, Car, HelpCircle } from 'lucide-react';

// ==========================================
// 1. HARMONISATION VISUELLE (Icônes et couleurs seulement)
// ==========================================
const CONFIG_APPLICATIONS = {
    "Activités": { icon: TreePine, color: "#2ecc71" },
    "Magasins": { icon: ShoppingBag, color: "#f39c12" },
    "Pêche": { icon: Fish, color: "#3498db" },
    "Restaurants": { icon: Utensils, color: "#d35400" },
    "Trajets": { icon: Car, color: "#95a5a6" }
};
const typesDisponibles = Object.keys(CONFIG_APPLICATIONS);

export default function ProjectXScreen() {
    // ==========================================
    // 2. LE MOTEUR DE RECHERCHE SUPABASE (LA MAGIE)
    // ==========================================
    // C'est ici qu'on stocke les vraies listes de ton site
    const [listesSite, setListesSite] = useState({
        "Activités": ["Chargement..."],
        "Magasins": ["Chargement..."],
        "Pêche": ["Chargement..."],
        "Restaurants": ["Chargement..."],
        "Trajets": ["Départ du Chalet", "Retour au Chalet", "En route", "Arrêt essence"] // Trajets reste fixe car ce n'est pas dans la BDD
    });

    useEffect(() => {
        async function chargerToutesLesDonnees() {
            // Fonction pour aller chercher le nom dans une table spécifique
            const fetchNoms = async (table) => {
                const { data, error } = await supabase.from(table).select('nom');
                if (error || !data || data.length === 0) return ["(Aucun élément trouvé)"];
                return data.map(item => item.nom);
            };

            // On va chercher dans toutes tes tables en même temps !
            // (Si le nom de ta table Restaurant prend un 's', change 'restaurant' pour 'restaurants' ci-dessous)
            const activitesData = await fetchNoms('activites');
            const magasinsData = await fetchNoms('magasins');
            const pecheData = await fetchNoms('peche');
            const restaurantsData = await fetchNoms('restaurant');

            // On met à jour nos listes avec les vraies données du site
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

    // ==========================================
    // 3. LA MÉMOIRE DE L'UTILISATEUR (SAUVEGARDE)
    // ==========================================
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
                // Sécurité pour mettre à jour les anciens noms
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
    // FONCTIONS DU TABLEAU
    // ==========================================
    useEffect(() => {
        localStorage.setItem('projectX_current', JSON.stringify(data));
    }, [data]);

    const updateRow = (day, id, field, value) => {
        setData(prev => ({ ...prev, [day]: prev[day].map(row => row.id === id ? { ...row, [field]: value } : row) }));
    };

    // Changement de Type -> Change la liste déroulante dynamiquement
    const handleTypeChange = (day, id, newType) => {
        // Va chercher le premier élément de la VRAIE liste chargée depuis Supabase
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
                                const configLigne = CONFIG_APPLICATIONS[row.type] || { icon: HelpCircle, color: "#ff0000" };
                                const IconeDynamique = configLigne.icon;

                                // On s'assure que la liste existe bien avant de l'afficher (Protection anti-crash)
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

                                                    {/* 1. Sélection de la catégorie */}
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

                                                    {/* 2. Sélection dynamique depuis Supabase */}
                                                    <select
                                                        className="px-select"
                                                        style={{ width: '100%', color: 'white', background: 'rgba(255,255,255,0.05)' }}
                                                        value={row.quoi}
                                                        onChange={(e) => updateRow(activeDay, row.id, 'quoi', e.target.value)}
                                                    >
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
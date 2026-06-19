// src/components/AppIcon.jsx
export default function AppIcon({ color, icon, name, onClick }) {
    return (
        // On ajoute le onClick ici pour détecter quand le doigt touche l'icône
        <div className="app-icon-wrapper" style={{ cursor: 'pointer' }} onClick={onClick}>
            <div className="app-icon" style={{ background: color }}>
                {icon}
            </div>
            <div className="app-name">{name}</div>
        </div>
    );
}
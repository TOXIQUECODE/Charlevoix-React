export default function AppIcon({ icon, name, onClick, color = "#ffffff" }) {
    return (
        <div className="app-icon-wrapper" onClick={onClick} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>

            {/* La nouvelle bordure animée qui cible l'icône */}
            <div className="electric-icon-wrapper" style={{ '--electric-color': color }}>
                <div className="electric-icon-inner">
                    {icon}
                </div>
            </div>

            {/* Le nom de l'application en dessous */}
            <span className="app-name">{name}</span>
        </div>
    );
}
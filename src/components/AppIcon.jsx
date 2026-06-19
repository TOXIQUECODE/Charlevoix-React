// src/components/AppIcon.jsx
export default function AppIcon({ icon, name, onClick }) {
    return (
        <div className="app-icon-wrapper" onClick={onClick}>
            <div className="app-icon">
                <div className="app-icon-blur">{icon}</div>
                <div className="app-icon-text">{icon}</div>
            </div>
            <span className="app-name">{name}</span>
        </div>
    );
}
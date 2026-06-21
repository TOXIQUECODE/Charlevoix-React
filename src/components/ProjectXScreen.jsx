import { Crown } from 'lucide-react';

export default function ProjectXScreen() {
    return (
        <div className="vue active">
            <div className="app-header">
                <h2>Project X</h2>
            </div>

            <div className="app-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div style={{ textAlign: 'center', opacity: 0.7 }}>
                    {/* La Couronne en grand */}
                    <Crown size={60} color="#e6c280" style={{ marginBottom: '20px' }} />
                    <p>En attente des instructions pour le Project X... 👑</p>
                </div>
            </div>
        </div>
    );
}
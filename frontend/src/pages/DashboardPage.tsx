import { useEffect, useState } from 'react';
import { Calendar, Tags, Mic2, TrendingUp } from 'lucide-react';
import api from '../lib/api';

interface Stats {
  events: number;
  categories: number;
  pembicara: number;
  upcoming: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<Stats>({ events: 0, categories: 0, pembicara: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [evRes, catRes, spkRes] = await Promise.all([
          api.get('/events'),
          api.get('/categories'),
          api.get('/pembicara'),
        ]);
        const upcoming = evRes.data.filter((e: { status: string }) => e.status === 'upcoming').length;
        setStats({
          events: evRes.data.length,
          categories: catRes.data.length,
          pembicara: spkRes.data.length,
          upcoming,
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Event', value: stats.events, icon: Calendar, color: '#6366f1' },
    { label: 'Kategori', value: stats.categories, icon: Tags, color: '#0ea5e9' },
    { label: 'Pembicara', value: stats.pembicara, icon: Mic2, color: '#f59e0b' },
    { label: 'Upcoming', value: stats.upcoming, icon: TrendingUp, color: '#10b981' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Selamat datang di Event Management System</p>
      </div>

      {loading ? (
        <div className="loading-grid">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : (
        <div className="stats-grid">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card" style={{ '--accent': color } as React.CSSProperties}>
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-info">
        <div className="info-card">
          <h3>Tentang Sistem</h3>
          <p>
            Event Management System adalah aplikasi untuk mengelola berbagai event kampus,
            termasuk seminar, workshop, dan acara lainnya. Sistem ini memungkinkan pengelolaan
            kategori event, pembicara, dan detail event secara terpadu.
          </p>
        </div>
        <div className="info-card">
          <h3>Teknologi</h3>
          <ul className="tech-list">
            <li><span className="tech-badge react">React + TypeScript</span></li>
            <li><span className="tech-badge express">Express + TypeScript</span></li>
            <li><span className="tech-badge prisma">Prisma ORM</span></li>
            <li><span className="tech-badge zustand">Zustand</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

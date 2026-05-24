import { Github, Instagram, Linkedin, Mail, MapPin, Phone, BookOpen, Code2, GraduationCap } from 'lucide-react';

const BiodataPage = () => {
  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Biodata Mahasiswa</h1><p>Profil pembuat website</p></div>
      </div>

      <div className="biodata-container">
        <div className="biodata-card profile-card">
          <div className="profile-avatar-lg">
            <span>S</span>
          </div>
          <h2 className="profile-name">Siti Triyana</h2>
          <p className="profile-nim">NIM: 24090098</p>
          <p className="profile-prodi">D-4 Teknik Informatika</p>
          <p className="profile-kampus">Universitas Politeknik Harapan Bersama</p>

          <div className="profile-contacts">
            <a href="mailto:alfian@example.com" className="contact-chip">
              <Mail size={14} /> tryana@example.com
            </a>
            <span className="contact-chip">
              <MapPin size={14} /> Tegal, Jawa Tengah
            </span>
            <span className="contact-chip">
              <Phone size={14} /> 08xx-xxxx-xxxx
            </span>
          </div>

          <div className="social-links">
            <a href="#" className="social-btn github"><Github size={18} /></a>
            <a href="#" className="social-btn linkedin"><Linkedin size={18} /></a>
            <a href="#" className="social-btn instagram"><Instagram size={18} /></a>
          </div>
        </div>

        <div className="biodata-details">
          <div className="detail-card">
            <div className="detail-header"><GraduationCap size={20} /><h3>Informasi Akademik</h3></div>
            <div className="detail-grid">
              <div className="detail-item"><span>Nama Lengkap</span><strong>ASiti Triyana</strong></div>
              <div className="detail-item"><span>NIM</span><strong>24090098</strong></div>
              <div className="detail-item"><span>Program Studi</span><strong>D-4 Teknik Informatika</strong></div>
              <div className="detail-item"><span>Fakultas</span><strong>Sekolah Vokasi</strong></div>
              <div className="detail-item"><span>Angkatan</span><strong>2024</strong></div>
              <div className="detail-item"><span>Status</span><strong>Aktif</strong></div>
              <div className="detail-item"><span>Kampus</span><strong>Kampus Mataram – Jalan Mataram No.9, Kota Tegal</strong></div>
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-header"><Code2 size={20} /><h3>Teknologi yang Digunakan</h3></div>
            <div className="tech-stack">
              {[
                { name: 'React', sub: 'TypeScript', color: '#61DAFB' },
                { name: 'Express', sub: 'TypeScript', color: '#68A063' },
                { name: 'Prisma ORM', sub: 'Supabase PostgreSQL', color: '#2D3748' },
                { name: 'Zustand', sub: 'State Management', color: '#FF6B35' },
                { name: 'Vite', sub: 'Build Tool', color: '#646CFF' },
                { name: 'Vercel', sub: 'Deployment', color: '#a0aec0' },
              ].map(({ name, sub, color }) => (
                <div key={name} className="tech-item" style={{ borderLeft: `3px solid ${color}` }}>
                  <strong style={{ color }}>{name}</strong>
                  <span>{sub}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-card">
            <div className="detail-header"><BookOpen size={20} /><h3>Tentang Proyek</h3></div>
            <p className="about-text">
              Event Management System adalah aplikasi web full-stack yang dibangun sebagai tugas
              mata kuliah Pemrograman Web. Aplikasi ini memungkinkan pengelolaan event kampus
              secara digital, meliputi kategori event, data pembicara, dan detail pelaksanaan event.
            </p>
            <p className="about-text">
              Proyek menggunakan React TypeScript + Vite di sisi frontend, Express TypeScript di backend,
              Prisma ORM dengan database Supabase PostgreSQL, serta Zustand untuk state management
              termasuk autentikasi login berbasis NIM dan Password.
            </p>
            <div className="repo-link">
              <Github size={16} />
              <a href="https://github.com/username/event-management" target="_blank" rel="noopener noreferrer">
                github.com/username/event-management
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiodataPage;

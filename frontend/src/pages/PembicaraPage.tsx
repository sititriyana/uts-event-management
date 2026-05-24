import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Mic2 } from 'lucide-react';
import api from '../lib/api';
import { Pembicara } from '../types';
import toast from 'react-hot-toast';

const defaultForm = { name: '', title: '', expertise: '', email: '', phone: '', bio: '', photoUrl: '' };

const PembicaraPage = () => {
  const [pembicara, setPembicara] = useState<Pembicara[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<Pembicara | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchPembicara = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pembicara');
      setPembicara(res.data);
    } catch {
      toast.error('Gagal memuat data pembicara');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPembicara(); }, []);

  const openAdd = () => { setEditItem(null); setForm(defaultForm); setModal(true); };
  const openEdit = (p: Pembicara) => {
    setEditItem(p);
    setForm({ name: p.name, title: p.title, expertise: p.expertise, email: p.email || '', phone: p.phone || '', bio: p.bio || '', photoUrl: p.photoUrl || '' });
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditItem(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/pembicara/${editItem.id}`, form);
        toast.success('Pembicara berhasil diperbarui');
      } else {
        await api.post('/pembicara', form);
        toast.success('Pembicara berhasil ditambahkan');
      }
      closeModal();
      fetchPembicara();
    } catch {
      toast.error('Gagal menyimpan pembicara');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus pembicara "${name}"?`)) return;
    try {
      await api.delete(`/pembicara/${id}`);
      toast.success('Pembicara berhasil dihapus');
      fetchPembicara();
    } catch {
      toast.error('Gagal menghapus pembicara');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Pembicara</h1>
          <p>Kelola data pembicara event</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={16} /> Tambah Pembicara
        </button>
      </div>

      {loading ? <div className="table-skeleton" /> : (
        <div className="cards-grid">
          {pembicara.length === 0 ? (
            <div className="empty-state full-width">
              <Mic2 size={40} />
              <p>Belum ada pembicara. Tambahkan yang pertama!</p>
            </div>
          ) : pembicara.map((p) => (
            <div key={p.id} className="speaker-card">
              <div className="speaker-avatar">
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.name} />
                ) : (
                  <span>{p.name.charAt(0)}</span>
                )}
              </div>
              <div className="speaker-info">
                <h3>{p.name}</h3>
                <p className="speaker-title">{p.title}</p>
                <p className="speaker-expertise">{p.expertise}</p>
                {p.email && <p className="speaker-contact">📧 {p.email}</p>}
                {p.phone && <p className="speaker-contact">📱 {p.phone}</p>}
                <span className="badge">{p._count?.events || 0} event</span>
              </div>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                <button className="btn-delete" onClick={() => handleDelete(p.id, p.name)}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? 'Edit Pembicara' : 'Tambah Pembicara'}</h2>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nama Lengkap *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama pembicara" required />
                </div>
                <div className="form-group">
                  <label>Jabatan/Gelar *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Dr., Prof., S.Kom., ..." required />
                </div>
              </div>
              <div className="form-group">
                <label>Keahlian/Bidang *</label>
                <input type="text" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} placeholder="Artificial Intelligence, Web Development, ..." required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                </div>
                <div className="form-group">
                  <label>Telepon</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08xx-xxxx-xxxx" />
                </div>
              </div>
              <div className="form-group">
                <label>Foto URL</label>
                <input type="url" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Biografi</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Ringkasan biografi pembicara..." rows={3} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? '...' : editItem ? 'Simpan' : 'Tambah'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PembicaraPage;

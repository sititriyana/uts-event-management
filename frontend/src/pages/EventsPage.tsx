import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Calendar, MapPin, Users, Clock } from 'lucide-react';
import api from '../lib/api';
import { Event, CategoryEvent, Pembicara } from '../types';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  upcoming: '#6366f1',
  ongoing: '#10b981',
  completed: '#6b7280',
  cancelled: '#ef4444',
};
const STATUS_LABELS: Record<string, string> = {
  upcoming: 'Akan Datang',
  ongoing: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const defaultForm = {
  title: '', description: '', date: '', time: '', location: '',
  capacity: '', status: 'upcoming', imageUrl: '', categoryId: '', pembicaraId: '',
};

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<CategoryEvent[]>([]);
  const [pembicara, setPembicara] = useState<Pembicara[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<Event | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [evRes, catRes, spkRes] = await Promise.all([
        api.get('/events'), api.get('/categories'), api.get('/pembicara'),
      ]);
      setEvents(evRes.data);
      setCategories(catRes.data);
      setPembicara(spkRes.data);
    } catch {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openAdd = () => { setEditItem(null); setForm(defaultForm); setModal(true); };
  const openEdit = (ev: Event) => {
    setEditItem(ev);
    setForm({
      title: ev.title, description: ev.description || '',
      date: ev.date.split('T')[0], time: ev.time, location: ev.location,
      capacity: String(ev.capacity), status: ev.status, imageUrl: ev.imageUrl || '',
      categoryId: String(ev.categoryId), pembicaraId: String(ev.pembicaraId),
    });
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditItem(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/events/${editItem.id}`, form);
        toast.success('Event berhasil diperbarui');
      } else {
        await api.post('/events', form);
        toast.success('Event berhasil ditambahkan');
      }
      closeModal();
      fetchAll();
    } catch {
      toast.error('Gagal menyimpan event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Hapus event "${title}"?`)) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event berhasil dihapus');
      fetchAll();
    } catch {
      toast.error('Gagal menghapus event');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Event</h1><p>Kelola semua event</p></div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16} /> Tambah Event</button>
      </div>

      {loading ? <div className="table-skeleton" /> : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>Judul Event</th><th>Kategori</th><th>Pembicara</th>
                <th>Tanggal</th><th>Lokasi</th><th>Status</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr><td colSpan={8}>
                  <div className="empty-state"><Calendar size={40} /><p>Belum ada event.</p></div>
                </td></tr>
              ) : events.map((ev, i) => (
                <tr key={ev.id}>
                  <td>{i + 1}</td>
                  <td>
                    <strong>{ev.title}</strong>
                    {ev.capacity > 0 && (
                      <div className="table-sub"><Users size={12} /> {ev.capacity} peserta</div>
                    )}
                  </td>
                  <td>
                    <span className="category-chip" style={{ background: ev.category?.color + '22', color: ev.category?.color }}>
                      {ev.category?.name}
                    </span>
                  </td>
                  <td>{ev.pembicara?.name}</td>
                  <td>
                    <div className="table-date">
                      <Calendar size={12} /> {new Date(ev.date).toLocaleDateString('id-ID')}
                    </div>
                    <div className="table-sub"><Clock size={12} /> {ev.time}</div>
                  </td>
                  <td><div className="table-sub"><MapPin size={12} /> {ev.location}</div></td>
                  <td>
                    <span className="status-badge" style={{ background: STATUS_COLORS[ev.status] + '22', color: STATUS_COLORS[ev.status] }}>
                      {STATUS_LABELS[ev.status]}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => openEdit(ev)}><Pencil size={14} /></button>
                      <button className="btn-delete" onClick={() => handleDelete(ev.id, ev.title)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal modal-xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? 'Edit Event' : 'Tambah Event'}</h2>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Judul Event *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Judul event" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Kategori *</label>
                  <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Pembicara *</label>
                  <select value={form.pembicaraId} onChange={(e) => setForm({ ...form, pembicaraId: e.target.value })} required>
                    <option value="">-- Pilih Pembicara --</option>
                    {pembicara.map((p) => <option key={p.id} value={p.id}>{p.name} - {p.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Tanggal *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Waktu *</label>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Lokasi *</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Auditorium, Zoom, ..." required />
                </div>
                <div className="form-group">
                  <label>Kapasitas</label>
                  <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} placeholder="0 = unlimited" min="0" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="upcoming">Akan Datang</option>
                    <option value="ongoing">Berlangsung</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>URL Gambar</label>
                  <input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Deskripsi event..." rows={3} />
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

export default EventsPage;

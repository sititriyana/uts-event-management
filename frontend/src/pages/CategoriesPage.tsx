import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Tags } from 'lucide-react';
import api from '../lib/api';
import { CategoryEvent } from '../types';
import toast from 'react-hot-toast';

const defaultForm = { name: '', description: '', color: '#6366f1' };

const CategoriesPage = () => {
  const [categories, setCategories] = useState<CategoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState<CategoryEvent | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch {
      toast.error('Gagal memuat data kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(defaultForm);
    setModal(true);
  };

  const openEdit = (cat: CategoryEvent) => {
    setEditItem(cat);
    setForm({ name: cat.name, description: cat.description || '', color: cat.color });
    setModal(true);
  };

  const closeModal = () => { setModal(false); setEditItem(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editItem) {
        await api.put(`/categories/${editItem.id}`, form);
        toast.success('Kategori berhasil diperbarui');
      } else {
        await api.post('/categories', form);
        toast.success('Kategori berhasil ditambahkan');
      }
      closeModal();
      fetchCategories();
    } catch {
      toast.error('Gagal menyimpan kategori');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Kategori berhasil dihapus');
      fetchCategories();
    } catch {
      toast.error('Gagal menghapus kategori');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Kategori Event</h1>
          <p>Kelola kategori untuk event Anda</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      {loading ? (
        <div className="table-skeleton" />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Warna</th>
                <th>Nama Kategori</th>
                <th>Deskripsi</th>
                <th>Jumlah Event</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <Tags size={40} />
                      <p>Belum ada kategori. Tambahkan yang pertama!</p>
                    </div>
                  </td>
                </tr>
              ) : categories.map((cat, i) => (
                <tr key={cat.id}>
                  <td>{i + 1}</td>
                  <td>
                    <span className="color-dot" style={{ background: cat.color }} />
                  </td>
                  <td><strong>{cat.name}</strong></td>
                  <td>{cat.description || '-'}</td>
                  <td>
                    <span className="badge">{cat._count?.events || 0} event</span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => openEdit(cat)}>
                        <Pencil size={14} />
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(cat.id, cat.name)}>
                        <Trash2 size={14} />
                      </button>
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editItem ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
              <button onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Nama Kategori *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Seminar, Workshop, ..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi kategori (opsional)"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Warna</label>
                <div className="color-picker-row">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                  />
                  <span className="color-preview" style={{ background: form.color }}>
                    {form.color}
                  </span>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? '...' : editItem ? 'Simpan Perubahan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

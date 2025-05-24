import { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../_app';

export default function Actualites() {
  const { role, isAuthenticated } = useContext(AuthContext);

  const [newsPosts, setNewsPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({
    id: null,
    title: '',
    content: '',
    date: '',
  });

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      // Redirect to admin login or homepage if not authorized
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, role]);

  useEffect(() => {
    const savedNews = localStorage.getItem('newsPosts');
    if (savedNews) {
      setNewsPosts(JSON.parse(savedNews));
    }
  }, []);

  const saveNewsPosts = (posts) => {
    setNewsPosts(posts);
    localStorage.setItem('newsPosts', JSON.stringify(posts));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.date) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
    if (editingPost) {
      const updatedPosts = newsPosts.map(post => post.id === editingPost.id ? form : post);
      saveNewsPosts(updatedPosts);
    } else {
      const newPost = { ...form, id: Date.now() };
      saveNewsPosts([newPost, ...newsPosts]);
    }
    setForm({ id: null, title: '', content: '', date: '' });
    setEditingPost(null);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setForm(post);
  };

  const handleDelete = (id) => {
    if (confirm('Voulez-vous vraiment supprimer cette actualité ?')) {
      const updatedPosts = newsPosts.filter(post => post.id !== id);
      saveNewsPosts(updatedPosts);
    }
  };

  return (
    <div id="wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
        <div id="content" className="container mt-4 flex-grow-1">
          <h1>Gestion des Actualités</h1>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Titre</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={form.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={form.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Contenu</label>
              <textarea
                id="content"
                name="content"
                className="form-control"
                rows="5"
                value={form.content}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingPost ? 'Mettre à jour' : 'Créer'}
            </button>
            {editingPost && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingPost(null);
                  setForm({ id: null, title: '', content: '', date: '' });
                }}
              >
                Annuler
              </button>
            )}
          </form>

          <h2>Actualités existantes</h2>
          {newsPosts.length === 0 ? (
            <p>Aucune actualité enregistrée.</p>
          ) : (
            <div className="list-group">
              {newsPosts.map(post => (
                <div key={post.id} className="list-group-item">
                  <h5>{post.title}</h5>
                  <small className="text-muted">{new Date(post.date).toLocaleDateString()}</small>
                  <p>{post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}</p>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(post)}>Modifier</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(post.id)}>Supprimer</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

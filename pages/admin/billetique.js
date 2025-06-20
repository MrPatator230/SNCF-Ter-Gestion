import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

export default function Billetique() {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [newTicketName, setNewTicketName] = useState('');
  const [newTicketPrice, setNewTicketPrice] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('Billet');
  const [editTicketId, setEditTicketId] = useState(null);
  const [editTicketName, setEditTicketName] = useState('');
  const [editTicketPrice, setEditTicketPrice] = useState('');
  const [editTicketCategory, setEditTicketCategory] = useState('Billet');

  useEffect(() => {
    const savedTicketTypes = localStorage.getItem('ticketTypes');
    if (savedTicketTypes) {
      setTicketTypes(JSON.parse(savedTicketTypes));
    }
  }, []);

  const saveTicketTypes = (types) => {
    setTicketTypes(types);
    localStorage.setItem('ticketTypes', JSON.stringify(types));
  };

  const handleAddTicketType = (e) => {
    e.preventDefault();
    if (!newTicketName || !newTicketPrice) {
      alert('Veuillez remplir le nom et le prix du type de billet.');
      return;
    }
    const price = parseFloat(newTicketPrice);
    if (isNaN(price) || price < 0) {
      alert('Veuillez entrer un prix valide.');
      return;
    }
    const newType = {
      id: Date.now().toString(),
      name: newTicketName,
      price: price.toFixed(2),
      category: newTicketCategory,
    };
    const updatedTypes = [...ticketTypes, newType];
    saveTicketTypes(updatedTypes);
    setNewTicketName('');
    setNewTicketPrice('');
    setNewTicketCategory('Billet');
  };

  const handleEditClick = (type) => {
    setEditTicketId(type.id);
    setEditTicketName(type.name);
    setEditTicketPrice(type.price);
    setEditTicketCategory(type.category || 'Billet');
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editTicketName || !editTicketPrice) {
      alert('Veuillez remplir le nom et le prix du type de billet.');
      return;
    }
    const price = parseFloat(editTicketPrice);
    if (isNaN(price) || price < 0) {
      alert('Veuillez entrer un prix valide.');
      return;
    }
    const updatedTypes = ticketTypes.map((type) =>
      type.id === editTicketId ? { ...type, name: editTicketName, price: price.toFixed(2), category: editTicketCategory } : type
    );
    saveTicketTypes(updatedTypes);
    setEditTicketId(null);
    setEditTicketName('');
    setEditTicketPrice('');
    setEditTicketCategory('Billet');
  };

  const handleEditCancel = () => {
    setEditTicketId(null);
    setEditTicketName('');
    setEditTicketPrice('');
    setEditTicketCategory('Billet');
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type de billet ?')) {
      const updatedTypes = ticketTypes.filter((type) => type.id !== id);
      saveTicketTypes(updatedTypes);
      if (editTicketId === id) {
        handleEditCancel();
      }
    }
  };

  return (
    <div id="wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
        <div id="content" className="container mt-4 flex-grow-1">
          <h1>Gestion des types de billets / abonnements</h1>

          {/* Ticket Types Configuration */}
          <section className="mb-5">
            <form onSubmit={editTicketId ? handleEditSave : handleAddTicketType} className="row g-3 align-items-center">
              <div className="col-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom du type de billet"
                  value={editTicketId ? editTicketName : newTicketName}
                  onChange={(e) => (editTicketId ? setEditTicketName(e.target.value) : setNewTicketName(e.target.value))}
                />
              </div>
              <div className="col-auto">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  placeholder="Prix (€)"
                  value={editTicketId ? editTicketPrice : newTicketPrice}
                  onChange={(e) => (editTicketId ? setEditTicketPrice(e.target.value) : setNewTicketPrice(e.target.value))}
                />
              </div>
              <div className="col-auto">
                <select
                  className="form-select"
                  value={editTicketId ? editTicketCategory : newTicketCategory}
                  onChange={(e) => (editTicketId ? setEditTicketCategory(e.target.value) : setNewTicketCategory(e.target.value))}
                >
                  <option value="Billet">Billet</option>
                  <option value="Abonnement">Abonnement</option>
                </select>
              </div>
              <div className="col-auto">
                <button type="submit" className="btn btn-success">
                  {editTicketId ? 'Enregistrer' : 'Ajouter'}
                </button>
                {editTicketId && (
                  <button type="button" className="btn btn-secondary ms-2" onClick={handleEditCancel}>
                    Annuler
                  </button>
                )}
              </div>
            </form>
            {ticketTypes.length === 0 ? (
              <p className="mt-3">Aucun type de billet configuré.</p>
            ) : (
              <ul className="list-group mt-3">
                {ticketTypes.map((type) => (
                  <li key={type.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{type.name}</strong> - {type.price} € ({type.category})
                    </div>
                    <div>
                      <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditClick(type)}>
                        Modifier
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(type.id)}>
                        Supprimer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

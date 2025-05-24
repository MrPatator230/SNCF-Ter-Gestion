import { useState, useEffect } from 'react';

export default function Actualites() {
  const [newsPosts, setNewsPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const savedNews = localStorage.getItem('newsPosts');
    if (savedNews) {
      setNewsPosts(JSON.parse(savedNews));
    }
  }, []);

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <>
      <header className="bg-white shadow mb-4">
        <nav className="container navbar navbar-expand-lg navbar-light">
          <a className="navbar-brand fw-bold" href="#">TER Bourgogne - Franche-Comté</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link " aria-current="page" href="/">Accueil</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/horaires-par-gares">Horaires</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="/actualites">Actualités</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/prochains-departs">Prochains Départs</a>
              </li>
              <li className="nav-item">
                <a className="btn btn-outline-success ms-3" href="/login">Se connecter</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      <div className="container my-5">
        <h1>Actualités</h1>
        {newsPosts.length === 0 ? (
          <p>Aucune actualité disponible.</p>
        ) : (
          <div className="list-group">
            {newsPosts.map(post => (
              <div
                key={post.id}
                className="list-group-item list-group-item-action"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal(post)}
              >
                <h5>{post.title}</h5>
                <small className="text-muted">{new Date(post.date).toLocaleDateString()}</small>
                <p>{post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedPost && (
          <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex="-1"
            role="dialog"
            onClick={closeModal}
          >
            <div
              className="modal-dialog modal-lg"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedPost.title}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <small className="text-muted">{new Date(selectedPost.date).toLocaleDateString()}</small>
                  <p>{selectedPost.content}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Fermer</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

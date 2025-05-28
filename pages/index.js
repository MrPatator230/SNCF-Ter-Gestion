import Header from '../components/Header';
import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import buttonStyles from '../styles/buttons.module.css';
import Footer from '../components/Footer';

const logoNameMap = {
  '/images/logo-ter-aura.svg': 'SNCF TER Aura',
  '/images/logo-ter-bretagne.svg': 'SNCF TER Bretagne',
  '/images/logo-ter-centre.svg': 'SNCF TER Centre',
  '/images/logo-ter-grand_est.svg': 'SNCF TER Grand Est',
  '/images/logo-ter-hdf.svg': 'SNCF TER Hauts-de-France',
  '/images/logo-ter-mobigo.svg': 'SNCF TER Mobigo',
  '/images/logo-ter-normandie.svg': 'SNCF TER Normandie',
  '/images/logo-ter-nouvelle_aquitaine.svg': 'SNCF TER Nouvelle Aquitaine',
  '/images/logo-ter-occitanie.svg': 'SNCF TER Occitanie',
  '/images/logo-ter-paca.svg': 'SNCF TER PACA',
  '/images/logo-ter-pddl.svg': 'SNCF TER PDDL',
};

export default function Home() {
  const { logoUrl } = useContext(SettingsContext);
  const displayName = logoNameMap[logoUrl] || 'SNCF TER Mobigo';

  const [trafficInfos, setTrafficInfos] = useState([]);

  useEffect(() => {
    const savedTrafficInfos = localStorage.getItem('trafficInfos');
    if (savedTrafficInfos) {
      setTrafficInfos(JSON.parse(savedTrafficInfos));
    }
  }, []);

  // Helper to format date string "YYYY-MM-DD" to "JJ mois" in French
  const formatDateFrench = (dateStr) => {
    if (!dateStr) return '';
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  return (
    <>
      <div className="main-wrapper">

      <Header />
      <main className="main-container">
        <div className="container-fluid">
          <h1 className="sncf-title mb-4">Bienvenue sur {displayName}</h1>
          
          <div className="row g-4">
            <div className="col-md-6">
              <div className="sncf-card h-100">
                <div className="sncf-card-body">
                  <h2 className="h4 mb-3">Actualités</h2>
                  <p>Restez informé des dernières actualités concernant votre réseau de transport.</p>
                  <a href="/actualites" className={`btn btn-primary ${buttonStyles['btn-primary']}`}>
                    <span className="material-icons me-2">article</span>
                    Voir les actualités
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="sncf-card h-100">
                <div className="sncf-card-body">
                  <h2 className="h4 mb-3">Horaires et Itinéraires</h2>
                  <p>Consultez les horaires et planifiez vos trajets en quelques clics.</p>
                  <a href="/verifier-horaires" className={`btn btn-primary ${buttonStyles['btn-primary']}`}>
                    <span className="material-icons me-2">schedule</span>
                    Vérifier les horaires
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="sncf-card h-100">
                <div className="sncf-card-body">
                  <h2 className="h4 mb-3">Abonnements & Billets</h2>
                  <p>Découvrez nos offres d'abonnement et achetez vos billets en ligne.</p>
                  <a href="/abonnements-et-billets" className={`btn btn-primary ${buttonStyles['btn-primary']}`}>
                    <span className="material-icons me-2">card_membership</span>
                    Voir les offres
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="sncf-card h-100">
                <div className="sncf-card-body">
                  <h2 className="h4 mb-3">Nos Gares</h2>
                  <p>Trouvez toutes les informations sur les gares de votre région.</p>
                  <a href="/stations" className={`btn btn-primary ${buttonStyles['btn-primary']}`}>
                    <span className="material-icons me-2">train</span>
                    Explorer les gares
                  </a>
                </div>
              </div>
            </div>

            {/* Traffic info section */}
            <div className="col-12">
              <div className="sncf-card">
                <div className="sncf-card-body">
                  <h2 className="h4 mb-3">Infos Trafic</h2>
                  {trafficInfos.length === 0 ? (
                    <p>Aucune info trafic enregistrée.</p>
                  ) : (
                    <div className="row g-3">
                      {trafficInfos.map(info => (
                        <div key={info.id} className="col-md-6 col-lg-4">
                          <div className="card h-100 border-primary">
                            <div className="card-body d-flex flex-column">
                              <h5 className="card-title">{info.title}</h5>
                          <h6 className="card-subtitle mb-2 text-muted">
                            {info.startDate ? `Du ${formatDateFrench(info.startDate)}` : '-'} {info.endDate ? ` au ${formatDateFrench(info.endDate)}` : ''}
                          </h6>
                              <p className="card-text flex-grow-1">{info.description}</p>
                              <div>
                                <span className={`badge ${{
                                  Retard: 'bg-warning text-dark',
                                  Suppression: 'bg-danger',
                                  Information: 'bg-primary',
                                  Modification: 'bg-info text-dark',
                                }[info.impactType] || 'bg-secondary'}`}>
                                  {info.impactType}
                                </span>
                              </div>
                              <div className="mt-2">
                                <strong>Horaires impactés: </strong>
                                {info.impactedTrains.length === 0 ? '-' : info.impactedTrains.join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    <style jsx>{`
      .sncf-card {
        border-color: var(--primary-color);
      }
      .sncf-title {
        color: var(--primary-color);
      }
    `}</style>
    </>
  );
}

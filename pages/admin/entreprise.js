import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../src/contexts/AuthContext';
import { SettingsContext } from '../../contexts/SettingsContext';
import Sidebar from '../../components/Sidebar';
import buttonStyles from '../../styles/buttons.module.css';


const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' }
];

const BUTTON_STYLES = [
  { value: 'rounded', label: 'Arrondi' },
  { value: 'square', label: 'Carré' }
];

const HEADER_STYLES = [
  { value: 'default', label: 'Par défaut' },
  { value: 'centered', label: 'Centré' },
  { value: 'minimal', label: 'Minimal' }
];

export default function Entreprise() {
  const { role, isAuthenticated } = useContext(AuthContext);
  const {
    companyName, setCompanyName,
    companySlogan, setCompanySlogan,
    companyDescription, setCompanyDescription,
    primaryColor, setPrimaryColor,
    secondaryColor, setSecondaryColor,
    accentColor, setAccentColor,
    appName, setAppName,
    logoUrl, setLogoUrl,
    faviconUrl, setFaviconUrl,
    fontFamily, setFontFamily,
    buttonStyle, setButtonStyle,
    headerStyle, setHeaderStyle,
    footerContent, setFooterContent,
    footerRegions, setFooterRegions,
    customCss, setCustomCss
  } = useContext(SettingsContext);

  const [newFooterRegionName, setNewFooterRegionName] = useState('');
  const [newFooterRegionLink, setNewFooterRegionLink] = useState('');

  const addFooterRegion = () => {
    if (newFooterRegionName.trim() === '' || newFooterRegionLink.trim() === '') return;
    setFooterRegions([...footerRegions, { name: newFooterRegionName.trim(), link: newFooterRegionLink.trim() }]);
    setNewFooterRegionName('');
    setNewFooterRegionLink('');
  };

  const updateFooterRegion = (index, field, value) => {
    const updatedRegions = [...footerRegions];
    updatedRegions[index][field] = value;
    setFooterRegions(updatedRegions);
  };

  const removeFooterRegion = (index) => {
    const updatedRegions = [...footerRegions];
    updatedRegions.splice(index, 1);
    setFooterRegions(updatedRegions);
  };

  const [previewVisible, setPreviewVisible] = useState(false);
  const [trainTypes, setTrainTypes] = useState([]);
  const [newTrainType, setNewTrainType] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedTrainTypes = localStorage.getItem('trainTypes');
    if (savedTrainTypes) {
      setTrainTypes(JSON.parse(savedTrainTypes));
    }
  }, []);

  const addTrainType = () => {
    if (!newTrainType.trim()) return;
    const updatedTypes = [...trainTypes, newTrainType.trim()];
    setTrainTypes(updatedTypes);
    localStorage.setItem('trainTypes', JSON.stringify(updatedTypes));
    setNewTrainType('');
  };

  const updateTrainType = (index, value) => {
    const updatedTypes = [...trainTypes];
    updatedTypes[index] = value;
    setTrainTypes(updatedTypes);
    localStorage.setItem('trainTypes', JSON.stringify(updatedTypes));
  };

  const removeTrainType = (index) => {
    const updatedTypes = trainTypes.filter((_, i) => i !== index);
    setTrainTypes(updatedTypes);
    localStorage.setItem('trainTypes', JSON.stringify(updatedTypes));
  };

  // Function to get CSS style string based on logo URL
  const getCssForLogo = (logo) => {
    switch (logo) {
      case '/images/logo-ter-aura.svg':
        return `
.aura-theme {
  --primary-color: #0055a4;
  --secondary-color: #00a1de;
  --accent-color: #fdb813;
}`;
      case '/images/logo-ter-bretagne.svg':
        return `
.bretagne-theme {
  --primary-color: #0085ca;
  --secondary-color: #f58220;
  --accent-color: #fdb813;
}`;
      case '/images/logo-ter-centre.svg':
        return `
.centre-theme {
  --primary-color: #007a33;
  --secondary-color: #fdb813;
  --accent-color: #e4002b;
}`;
      case '/images/logo-ter-grand_est.svg':
        return `
.grand_est-theme {
  --primary-color: #003366;
  --secondary-color: #e4002b;
  --accent-color: #fdb813;
}`;
      case '/images/logo-ter-hdf.svg':
        return `
.hdf-theme {
  --primary-color: #003366;
  --secondary-color: #fdb813;
  --accent-color: #e4002b;
}`;
      case '/images/logo-ter-mobigo.svg':
        return `
.mobigo-theme {
  --primary-color: #00682b;
  --secondary-color: #fdb813;
  --accent-color: #e4002b;
}`;
      case '/images/logo-ter-normandie.svg':
        return `
.normandie-theme {
  --primary-color: #003366;
  --secondary-color: #fdb813;
  --accent-color: #e4002b;
}`;
      case '/images/logo-ter-nouvelle_aquitaine.svg':
        return `
.nouvelle_aquitaine-theme {
  --primary-color: #003366;
  --secondary-color: #fdb813;
  --accent-color: #e4002b;
}`;
      case '/images/logo-ter-occitanie.svg':
        return `
.occitanie-theme {
  --primary-color: #e4002b;
  --secondary-color: #fdb813;
  --accent-color: #003366;
}`;
      case '/images/logo-ter-paca.svg':
        return `
.paca-theme {
  --primary-color: #003366;
  --secondary-color: #fdb813;
  --accent-color: #e4002b;
}`;
      case '/images/logo-ter-pddl.svg':
        return `
.pddl-theme {
  --primary-color: #003366;
  --secondary-color: #fdb813;
  --accent-color: #e4002b;
}`;
      default:
        return '';
    }
  };

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, role, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const settings = {
      companyName,
      companySlogan,
      companyDescription,
      primaryColor,
      secondaryColor,
      accentColor,
      appName,
      logoUrl,
      faviconUrl,
      fontFamily,
      buttonStyle,
      headerStyle,
      footerContent,
      footerRegions,
      customCss
    };
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        alert('Paramètres enregistrés avec succès !');
      } else {
        alert('Erreur lors de l\'enregistrement des paramètres.');
      }
    } catch (error) {
      alert('Erreur lors de l\'enregistrement des paramètres.');
    }
  };

  return (
    <div id="wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
        <div id="content" className="container mt-4 flex-grow-1">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Personnalisation de l'application</h1>
            <button 
              className={`btn btn-secondary ${buttonStyles['btn-secondary']}`}
              onClick={() => setPreviewVisible(!previewVisible)}
            >
              {previewVisible ? 'Masquer' : 'Afficher'} l'aperçu
            </button>
          </div>

          <div className="row">
            <div className={`${previewVisible ? 'col-md-8' : 'col-12'}`}>
              <form onSubmit={handleSubmit}>
                <div className="card mb-4">
                  <div className="card-header">
                    <h4 className="mb-0">Identité de l'entreprise</h4>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="companyName" className="form-label">Nom de l'entreprise</label>
                      <input
                        type="text"
                        id="companyName"
                        className="form-control"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="companySlogan" className="form-label">Slogan</label>
                      <input
                        type="text"
                        id="companySlogan"
                        className="form-control"
                        value={companySlogan}
                        onChange={(e) => setCompanySlogan(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="companyDescription" className="form-label">Description</label>
                      <textarea
                        id="companyDescription"
                        className="form-control"
                        rows="4"
                        value={companyDescription}
                        onChange={(e) => setCompanyDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="logoSelect" className="form-label">Logo</label>
                      <select
                        id="logoSelect"
                        className="form-select mb-2"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                      >
                        <option value="">Sélectionnez un logo</option>
                        <option value="/images/logo-ter-aura.svg">TER Auvergne - Rhône-Alpes</option>
                        <option value="/images/logo-ter-bretagne.svg">TER Bretagne</option>
                        <option value="/images/logo-ter-centre.svg">TER Centre - Val-de-Loire</option>
                        <option value="/images/logo-ter-grand_est.svg">TER Grand Est</option>
                        <option value="/images/logo-ter-hdf.svg">TER Hauts-de-France</option>
                        <option value="/images/logo-ter-mobigo.svg">TER Mobigo</option>
                        <option value="/images/logo-ter-normandie.svg">TER Normandie</option>
                        <option value="/images/logo-ter-nouvelle_aquitaine.svg">TER Nouvelle Aquitaine</option>
                        <option value="/images/logo-ter-occitanie.svg">TER Occitanie</option>
                        <option value="/images/logo-ter-paca.svg">TER Provence-Alpes-Côte d'Azur</option>
                        <option value="/images/logo-ter-pddl.svg">TER Pays de la Loire</option>
                      </select>
                      {logoUrl && (
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={logoUrl}
                            alt="Logo sélectionné"
                            style={{ height: '50px', width: 'auto' }}
                          />
                          <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', backgroundColor: '#f8f9fa', padding: '0.5rem', borderRadius: '0.25rem', flex: 1 }}>
                            {getCssForLogo(logoUrl)}
                          </pre>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Favicon</label>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={faviconUrl} 
                          alt="Favicon" 
                          style={{ height: '32px', width: '32px' }} 
                        />
                        <input
                          type="text"
                          className="form-control"
                          value={faviconUrl}
                          onChange={(e) => setFaviconUrl(e.target.value)}
                          placeholder="URL du favicon"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header">
                    <h4 className="mb-0">Apparence</h4>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label htmlFor="primaryColor" className="form-label">Couleur principale</label>
                        <input
                          type="color"
                          id="primaryColor"
                          className="form-control form-control-color w-100"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          title="Choisissez la couleur principale"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="secondaryColor" className="form-label">Couleur secondaire</label>
                        <input
                          type="color"
                          id="secondaryColor"
                          className="form-control form-control-color w-100"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          title="Choisissez la couleur secondaire"
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label htmlFor="accentColor" className="form-label">Couleur d'accent</label>
                        <input
                          type="color"
                          id="accentColor"
                          className="form-control form-control-color w-100"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          title="Choisissez la couleur d'accent"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="fontFamily" className="form-label">Police de caractères</label>
                      <select
                        id="fontFamily"
                        className="form-select"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                      >
                        {FONT_OPTIONS.map(font => (
                          <option key={font.value} value={font.value}>{font.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="buttonStyle" className="form-label">Style des boutons</label>
                      <select
                        id="buttonStyle"
                        className="form-select"
                        value={buttonStyle}
                        onChange={(e) => setButtonStyle(e.target.value)}
                      >
                        {BUTTON_STYLES.map(style => (
                          <option key={style.value} value={style.value}>{style.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="headerStyle" className="form-label">Style de l'en-tête</label>
                      <select
                        id="headerStyle"
                        className="form-select"
                        value={headerStyle}
                        onChange={(e) => setHeaderStyle(e.target.value)}
                      >
                        {HEADER_STYLES.map(style => (
                          <option key={style.value} value={style.value}>{style.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header">
                    <h4 className="mb-0">Paramètres avancés</h4>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="appName" className="form-label">Nom de l'application</label>
                      <input
                        type="text"
                        id="appName"
                        className="form-control"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="footerContent" className="form-label">Contenu du pied de page</label>
                      <textarea
                        id="footerContent"
                        className="form-control"
                        rows="2"
                        value={footerContent}
                        onChange={(e) => setFooterContent(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="customCss" className="form-label">CSS personnalisé</label>
                      <textarea
                        id="customCss"
                        className="form-control font-monospace"
                        rows="6"
                        value={customCss}
                        onChange={(e) => setCustomCss(e.target.value)}
                        placeholder=":root { /* Vos variables CSS */ }"
                      />
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header">
                    <h4 className="mb-0">Footer</h4>
                  </div>
                  <div className="card-body">
                    {footerRegions.map((region, index) => (
                      <div key={index} className="d-flex mb-3 align-items-center gap-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Nom public"
                          value={region.name}
                          onChange={(e) => updateFooterRegion(index, 'name', e.target.value)}
                          required
                        />
                        <input
                          type="url"
                          className="form-control"
                          placeholder="Lien de redirection"
                          value={region.link}
                          onChange={(e) => updateFooterRegion(index, 'link', e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className={`btn btn-danger ${buttonStyles['btn-secondary']}`}
                          onClick={() => removeFooterRegion(index)}
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                    <div className="d-flex mb-3 gap-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Nom public"
                        value={newFooterRegionName}
                        onChange={(e) => setNewFooterRegionName(e.target.value)}
                      />
                      <input
                        type="url"
                        className="form-control"
                        placeholder="Lien de redirection"
                        value={newFooterRegionLink}
                        onChange={(e) => setNewFooterRegionLink(e.target.value)}
                      />
                      <button
                        type="button"
                        className={`btn btn-primary ${buttonStyles['btn-primary']}`}
                        onClick={addFooterRegion}
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header">
                    <h4 className="mb-0">Types de Trains</h4>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label htmlFor="trainTypeName" className="form-label">Nom du type de train</label>
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          id="trainTypeName"
                          className="form-control"
                          placeholder="Ex: TGV InOui"
                          value={newTrainType}
                          onChange={(e) => setNewTrainType(e.target.value)}
                        />
                        <button
                          type="button"
                          className={`btn btn-primary ${buttonStyles['btn-primary']}`}
                          onClick={addTrainType}
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>

                    <div className="train-types-list">
                      {trainTypes.map((type, index) => (
                        <div key={index} className="d-flex align-items-center gap-2 mb-2">
                          <input
                            type="text"
                            className="form-control"
                            value={type}
                            onChange={(e) => updateTrainType(index, e.target.value)}
                          />
                          <button
                            type="button"
                            className={`btn btn-danger ${buttonStyles['btn-secondary']}`}
                            onClick={() => removeTrainType(index)}
                          >
                            Supprimer
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mb-4">
                <button type="submit" className={`btn btn-primary ${buttonStyles['btn-primary']}`}>
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            </div>

            {previewVisible && (
              <div className="col-md-4">
                <div className="card preview-card" style={{ position: 'sticky', top: '1rem' }}>
                  <div className="card-header">
                    <h4 className="mb-0">Aperçu</h4>
                  </div>
                  <div className="card-body">
                    <div className="preview-header p-3 mb-3" style={{
                      backgroundColor: primaryColor,
                      color: '#fff',
                      borderRadius: buttonStyle === 'rounded' ? '0.5rem' : '0'
                    }}>
                      <h5 className="mb-0">{companyName}</h5>
                    </div>

                    <div className="preview-content">
                      <button className="btn mb-2" style={{
                        backgroundColor: primaryColor,
                        color: '#fff',
                        borderRadius: buttonStyle === 'rounded' ? '2rem' : '0'
                      }}>
                        Bouton principal
                      </button>

                      <button className="btn mb-2 mx-2" style={{
                        backgroundColor: secondaryColor,
                        color: '#fff',
                        borderRadius: buttonStyle === 'rounded' ? '2rem' : '0'
                      }}>
                        Bouton secondaire
                      </button>

                      <div className="preview-text mt-3">
                        <p style={{ color: accentColor }}>{companySlogan}</p>
                        <small className="text-muted">{footerContent}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .preview-card {
          font-family: ${fontFamily}, sans-serif;
        }
        
        .form-control-color {
          height: 40px;
        }
      `}</style>
    </div>
  );
}

import { useState, useEffect, useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Sidebar from '../../components/Sidebar';
import DraggableRollingStock from '../../components/admin/DraggableRollingStock';
import CompositionDropZone from '../../components/admin/CompositionDropZone';
import TrainVisualSlider from '../../components/TrainVisualSlider';
import { SettingsContext } from '../../contexts/SettingsContext';

export default function CompositionsTrains() {
  const { primaryColor, buttonStyle } = useContext(SettingsContext);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [materielsRoulants, setMaterielsRoulants] = useState([]);
  const [composition, setComposition] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [trainNumber, setTrainNumber] = useState('');
  const [error, setError] = useState('');
  const [editingMaterielId, setEditingMaterielId] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [showTrainVisual, setShowTrainVisual] = useState(false);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedSchedules = localStorage.getItem('schedules');
        const savedMateriels = localStorage.getItem('materielsRoulants');
        
        if (savedSchedules) {
          const parsedSchedules = JSON.parse(savedSchedules);
          setSchedules(parsedSchedules);
        }
        
        if (savedMateriels) {
          const parsedMateriels = JSON.parse(savedMateriels);
          setMaterielsRoulants(parsedMateriels);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  const handleTrainNumberSubmit = (e) => {
    e.preventDefault();
    const schedule = schedules.find(s => s.trainNumber === trainNumber);
    if (schedule) {
      setSelectedSchedule(schedule);
      setComposition(schedule?.composition || []);
      setError('');
      setShowTrainVisual(false);
    } else {
      setError('Numéro de train non trouvé');
      setSelectedSchedule(null);
      setComposition([]);
      setShowTrainVisual(false);
    }
  };

  const handleDrop = (item) => {
    if (Array.isArray(item)) {
      setComposition(item);
    } else {
      setComposition(prev => [...prev, item]);
    }
    setShowTrainVisual(false);
  };

  const handleSaveComposition = () => {
    if (!selectedSchedule) {
      alert('Veuillez sélectionner un horaire');
      return;
    }

    try {
      // Update the schedule with composition
      const updatedSchedules = schedules.map(schedule => {
        if (schedule.id === selectedSchedule.id) {
          return {
            ...schedule,
            composition: composition,
            lastUpdated: new Date().toISOString()
          };
        }
        return schedule;
      });

      // Save to localStorage
      localStorage.setItem('schedules', JSON.stringify(updatedSchedules));
      setSchedules(updatedSchedules);
      
      // Update selected schedule
      setSelectedSchedule(prev => ({
        ...prev,
        composition: composition,
        lastUpdated: new Date().toISOString()
      }));
      
      setShowTrainVisual(true);
      alert('Composition enregistrée avec succès');
    } catch (error) {
      console.error('Error saving composition:', error);
      alert('Erreur lors de l\'enregistrement de la composition');
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleMaterielSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !type.trim() || (editingMaterielId === null && !imageFile)) {
      alert('Veuillez remplir tous les champs et ajouter une image.');
      return;
    }

    const processSave = (imageData) => {
      let updatedMateriels;
      if (editingMaterielId !== null) {
        updatedMateriels = materielsRoulants.map(m => {
          if (m.id === editingMaterielId) {
            return {
              ...m,
              name: name.trim(),
              type: type.trim(),
              imageData: imageData || m.imageData,
              imageName: `${name.toLowerCase().replace(/\s+/g, '-')}.png`
            };
          }
          return m;
        });
      } else {
        const newMateriel = {
          id: Date.now(),
          name: name.trim(),
          type: type.trim(),
          imageData,
          imageName: `${name.toLowerCase().replace(/\s+/g, '-')}.png`
        };
        updatedMateriels = [...materielsRoulants, newMateriel];
      }
      
      localStorage.setItem('materielsRoulants', JSON.stringify(updatedMateriels));
      setMaterielsRoulants(updatedMateriels);
      setEditingMaterielId(null);
      setName('');
      setType('');
      setImageFile(null);
      e.target.reset();
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processSave(reader.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      processSave(null);
    }
  };

  const handleEdit = (materiel) => {
    setEditingMaterielId(materiel.id);
    setName(materiel.name);
    setType(materiel.type);
    setImageFile(null);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce matériel roulant ?')) {
      const newMateriels = materielsRoulants.filter(m => m.id !== id);
      localStorage.setItem('materielsRoulants', JSON.stringify(newMateriels));
      setMaterielsRoulants(newMateriels);
      if (editingMaterielId === id) {
        setEditingMaterielId(null);
        setName('');
        setType('');
        setImageFile(null);
      }
    }
  };

  const getBorderRadius = () => {
    switch (buttonStyle) {
      case 'rounded':
        return '25px';
      case 'square':
        return '0';
      default:
        return '4px';
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div id="wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
          <div id="content" className="container-fluid py-4">
            <h1 className="h3 mb-4" style={{ color: primaryColor }}>
              Compositions des Trains
            </h1>

            <div className="row">
              <div className="col-lg-8">
                {/* Train Number Search */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <form onSubmit={handleTrainNumberSubmit} className="row g-3 align-items-end">
                    <div className="col-md-8">
                      <label className="form-label">Numéro du train</label>
                      <input
                        type="text"
                        className={`form-control ${error ? 'is-invalid' : ''}`}
                        value={trainNumber}
                        onChange={(e) => setTrainNumber(e.target.value)}
                        placeholder="Entrez le numéro du train"
                        style={{ borderRadius: getBorderRadius() }}
                      />
                      {error && <div className="invalid-feedback">{error}</div>}
                    </div>
                    <div className="col-md-4">
                      <button
                        type="submit"
                        className="btn w-100"
                        style={{
                          backgroundColor: primaryColor,
                          color: 'white',
                          borderRadius: getBorderRadius()
                        }}
                      >
                        Rechercher
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {selectedSchedule && (
                <>
                  {/* Train Visual */}
                  {showTrainVisual && (
                    <div className="card shadow-sm mb-4">
                      <div className="card-body">
                        <h2 className="h5 mb-4" style={{ color: primaryColor }}>
                          Visualisation du Train {selectedSchedule.trainNumber}
                        </h2>
                        <TrainVisualSlider
                          trainNumber={selectedSchedule.trainNumber}
                          composition={composition}
                        />
                      </div>
                    </div>
                  )}

                  {/* Composition Management */}
                  <div className="card shadow-sm mb-4">
                    <div className="card-body">
                      <h2 className="h5 mb-4" style={{ color: primaryColor }}>
                        Composition du Train {selectedSchedule.trainNumber}
                      </h2>
                      <CompositionDropZone
                        onDrop={handleDrop}
                        composition={composition}
                      />
                      <button
                        onClick={handleSaveComposition}
                        className="btn w-100 mt-3"
                        style={{
                          backgroundColor: primaryColor,
                          color: 'white',
                          borderRadius: getBorderRadius()
                        }}
                      >
                        Enregistrer la Composition
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Matériel Roulant Management */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h2 className="h5 mb-4" style={{ color: primaryColor }}>
                    Gestion du Matériel Roulant
                  </h2>
                  

                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Rechercher un matériel roulant..."
                      className="form-control"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ borderRadius: getBorderRadius() }}
                    />
                  </div>

                  <div className="row g-3">
                    {materielsRoulants
                      .filter(materiel =>
                        materiel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        materiel.type?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(materiel => (
                        <div key={materiel.id} className="col-md-6">
                          <DraggableRollingStock 
                            item={materiel}
                            onEdit={() => handleEdit(materiel)}
                            onDelete={() => handleDelete(materiel.id)}
                          />
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              {selectedSchedule && (
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h2 className="h5 mb-4" style={{ color: primaryColor }}>
                      Arrêts desservis
                    </h2>
                    <div className="timeline">
                      {selectedSchedule.stops?.map((stop, index) => (
                        <div key={index} className="timeline-item">
                          <div className="timeline-content">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <strong style={{ color: primaryColor }}>{stop.station}</strong>
                              <span className="text-muted small">
                                {stop.arrivalTime || stop.departureTime}
                              </span>
                            </div>
                            {stop.platform && (
                              <span className="badge bg-light text-dark">
                                Voie {stop.platform}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .timeline-item {
          position: relative;
          padding-left: 20px;
          margin-bottom: 1rem;
        }
        .timeline-item:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: ${primaryColor};
        }
        .timeline-item:after {
          content: '';
          position: absolute;
          left: -4px;
          top: 8px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: ${primaryColor};
        }
        .form-control:focus {
          border-color: ${primaryColor};
          box-shadow: 0 0 0 0.25rem ${primaryColor}40;
        }
      `}</style>
    </DndProvider>
  );
}

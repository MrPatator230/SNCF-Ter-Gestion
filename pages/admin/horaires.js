import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../src/contexts/AuthContext';
import { getAllSchedules, addSchedule, updateSchedule, deleteSchedule } from '../../utils/scheduleUtils';
import TrainVisualSlider from '../../components/TrainVisualSlider';
import Layout from '@/components/Layout';

const WEEK_DAYS = [
  { label: 'Lundi', value: 'Monday' },
  { label: 'Mardi', value: 'Tuesday' },
  { label: 'Mercredi', value: 'Wednesday' },
  { label: 'Jeudi', value: 'Thursday' },
  { label: 'Vendredi', value: 'Friday' },
  { label: 'Samedi', value: 'Saturday' },
  { label: 'Dimanche', value: 'Sunday' },
];

export default function Horaires() {
  const { role, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const [schedules, setSchedules] = useState([]);
  const [folders, setFolders] = useState([]);
  const [scheduleFolderMap, setScheduleFolderMap] = useState({});
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [stations, setStations] = useState([]);
  const [materielsRoulants, setMaterielsRoulants] = useState([]);

  // New state for schedule order
  const [scheduleOrder, setScheduleOrder] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Form fields
  const [trainNumber, setTrainNumber] = useState('');
  const [departureStation, setDepartureStation] = useState('');
  const [arrivalStation, setArrivalStation] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [trainTypes, setTrainTypes] = useState([]);
  const [trainType, setTrainType] = useState('');
  const [servedStations, setServedStations] = useState([{ name: '', arrivalTime: '', departureTime: '' }]);
  const [joursCirculation, setJoursCirculation] = useState([]);
  const [folderId, setFolderId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, role, router]);

  useEffect(() => {
    // Load data from localStorage
    setSchedules(getAllSchedules());

    // Load schedule order from localStorage
    const savedOrder = localStorage.getItem('scheduleOrder');
    if (savedOrder) {
      setScheduleOrder(JSON.parse(savedOrder));
    }
    
    // Load train types
    const savedTrainTypes = localStorage.getItem('trainTypes');
    if (savedTrainTypes) {
      const types = JSON.parse(savedTrainTypes);
      setTrainTypes(types);
      if (types.length > 0) {
        setTrainType(types[0]);
      }
    }

    const savedStations = localStorage.getItem('stations');
    if (savedStations) {
      setStations(JSON.parse(savedStations));
    }
    const savedMateriels = localStorage.getItem('materielsRoulants');
    if (savedMateriels) {
      setMaterielsRoulants(JSON.parse(savedMateriels));
    }
    const savedFolders = localStorage.getItem('scheduleFolders');
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
    const savedMap = localStorage.getItem('scheduleFolderMap');
    if (savedMap) {
      setScheduleFolderMap(JSON.parse(savedMap));
    }
  }, []);

  const saveFolders = (newFolders) => {
    setFolders(newFolders);
    localStorage.setItem('scheduleFolders', JSON.stringify(newFolders));
  };

  const saveScheduleFolderMap = (newMap) => {
    setScheduleFolderMap(newMap);
    localStorage.setItem('scheduleFolderMap', JSON.stringify(newMap));
  };

  const saveStations = (newStations) => {
    setStations(newStations);
    localStorage.setItem('stations', JSON.stringify(newStations));
  };

  const handleCreateSchedule = () => {
    setShowModal(true);
  };

  const handleCreateFolder = () => {
    const folderName = prompt('Nom du nouveau dossier:');
    if (folderName && folderName.trim() !== '') {
      const newFolder = { id: Date.now(), name: folderName.trim() };
      const newFolders = [...folders, newFolder];
      saveFolders(newFolders);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSchedule(null);
    setFolderId(null);
    // Reset form
    setTrainNumber('');
    setDepartureStation('');
    setArrivalStation('');
    setArrivalTime('');
    setDepartureTime('');
    setTrainType('');
    setServedStations([{ name: '', arrivalTime: '', departureTime: '' }]);
    setJoursCirculation([]);
  };

  const handleJoursCirculationChange = (day) => {
    if (joursCirculation.includes(day)) {
      setJoursCirculation(joursCirculation.filter(d => d !== day));
    } else {
      setJoursCirculation([...joursCirculation, day]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!trainNumber || !departureStation || !arrivalStation || !arrivalTime || !departureTime || !trainType || !joursCirculation || joursCirculation.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires, y compris les jours de circulation.');
      return;
    }

    // Filtrer les gares desservies valides
    const servedStationsList = servedStations.filter(s => 
      s.name.trim() !== '' && 
      s.name !== departureStation && 
      s.name !== arrivalStation
    );

    // Add new stations if not exist
    let updatedStations = [...stations];
    servedStationsList.forEach(station => {
      if (!updatedStations.find(s => s.name === station.name)) {
        updatedStations.push({ name: station.name, categories: [] });
      }
    });
    if (departureStation && !updatedStations.find(s => s.name === departureStation)) {
      updatedStations.push({ name: departureStation, categories: [] });
    }
    if (arrivalStation && !updatedStations.find(s => s.name === arrivalStation)) {
      updatedStations.push({ name: arrivalStation, categories: [] });
    }
    saveStations(updatedStations);

    const scheduleData = {
      trainNumber,
      departureStation,
      arrivalStation,
      arrivalTime,
      departureTime,
      trainType,
      rollingStockFileName: null,
      composition: editingSchedule?.composition || [],
      servedStations: servedStationsList,
      joursCirculation,
    };

    if (editingSchedule) {
      // Update existing schedule
      updateSchedule(editingSchedule.id, scheduleData);
      setSchedules(getAllSchedules());
    } else {
      // Create new schedule
      addSchedule(scheduleData);
      setSchedules(getAllSchedules());

      // Update scheduleOrder to include new schedule id
      // Fix: use the actual id of the newly added schedule from getAllSchedules
      const allSchedules = getAllSchedules();
      const newSchedule = allSchedules[allSchedules.length - 1];
      if (newSchedule) {
        const newScheduleId = newSchedule.id;
        setScheduleOrder(prevOrder => {
          const newOrder = prevOrder.length > 0 ? [...prevOrder, newScheduleId] : [newScheduleId];
          localStorage.setItem('scheduleOrder', JSON.stringify(newOrder));
          return newOrder;
        });

        // Update scheduleFolderMap with folderId for this schedule
        if (folderId) {
          const newMap = { ...scheduleFolderMap, [newScheduleId]: folderId };
          saveScheduleFolderMap(newMap);
        }
      }
    }

    handleModalClose();
  };

  // Drag and drop handlers
  const onDragStart = (e, scheduleId) => {
    e.dataTransfer.setData('scheduleId', scheduleId);
  };

  const onDrop = (e, folderId) => {
    e.preventDefault();
    const scheduleId = e.dataTransfer.getData('scheduleId');
    if (!scheduleId) return;

    const newMap = { ...scheduleFolderMap, [scheduleId]: folderId };
    saveScheduleFolderMap(newMap);
    // Update schedules state to reflect change
    setSchedules(getAllSchedules());
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  // Filter schedules by folder
  const schedulesInFolder = (folderId) => {
    return schedules.filter(s => scheduleFolderMap[s.id] === folderId);
  };

  // Filter schedules to display based on selectedFolderId
  // Reorder schedules according to scheduleOrder
  const schedulesToDisplay = selectedFolderId ? schedulesInFolder(selectedFolderId) : schedules;

  // Create a map for quick lookup of schedules by id
  const scheduleMap = schedulesToDisplay.reduce((acc, schedule) => {
    acc[schedule.id] = schedule;
    return acc;
  }, {});

  // Order schedules according to scheduleOrder, append any not in order at the end
  const displayedSchedules = scheduleOrder.length > 0
    ? scheduleOrder.map(id => scheduleMap[id]).filter(Boolean)
    : schedulesToDisplay;

  return (
    <div id="wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
      <meta charSet="UTF-8" />
      <style href='../../node_modules/@sncf/bootstrap-sncf.min.css'></style>
      <div style={{ height: '100vh', overflowY: 'auto' }}>
        <Sidebar />
      </div>
      <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
        <div id="content" className="container mt-4 flex-grow-1">
          <h1>Gestion des horaires de trains</h1>
          <div className="d-flex mb-3">
            <button className="btn btn-primary me-3" onClick={handleCreateSchedule}>
              Créer un horaire
            </button>
            <button className="btn btn-secondary" onClick={handleCreateFolder}>
              Créer un dossier
            </button>
          </div>

          <div className="d-flex">
            <div style={{ flexBasis: '25%', minWidth: '250px', maxWidth: '400px', marginRight: '1rem', maxHeight: '80vh', overflowY: 'auto', border: '1px solid #ccc', padding: '0.5rem' }}>
              <h5>Dossiers</h5>
              {folders.length === 0 ? (
                <p>Aucun dossier créé</p>
              ) : (
                folders.map(folder => (
                  <div
                    key={folder.id}
                    onClick={() => setSelectedFolderId(folder.id)}
                    onDrop={(e) => onDrop(e, folder.id)}
                    onDragOver={onDragOver}
                    style={{
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                      border: selectedFolderId === folder.id ? '2px solid #0056b3' : '1px solid #007bff',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: selectedFolderId === folder.id ? '#cce5ff' : 'transparent',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      onClick={() => setSelectedFolderId(folder.id)}
                      style={{ flexGrow: 1, cursor: 'pointer' }}
                    >
                      <strong>{folder.name}</strong>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        {schedulesInFolder(folder.id).length} horaires
                      </div>
                    </div>
                    <div>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newName = prompt('Modifier le nom du dossier:', folder.name);
                          if (newName && newName.trim() !== '') {
                            const newFolders = folders.map(f => f.id === folder.id ? { ...f, name: newName.trim() } : f);
                            saveFolders(newFolders);
                          }
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
                            const newFolders = folders.filter(f => f.id !== folder.id);
                            saveFolders(newFolders);
                            // Remove folder references from scheduleFolderMap
                            const newMap = { ...scheduleFolderMap };
                            Object.keys(newMap).forEach(key => {
                              if (newMap[key] === folder.id) {
                                delete newMap[key];
                              }
                            });
                            saveScheduleFolderMap(newMap);
                            if (selectedFolderId === folder.id) {
                              setSelectedFolderId(null);
                            }
                          }
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))
              )}
              {selectedFolderId && (
                <button className="btn btn-link mt-2" onClick={() => setSelectedFolderId(null)}>
                  Afficher tous les horaires
                </button>
              )}
            </div>

            <div style={{ flexGrow: 1, maxHeight: '80vh', overflowY: 'auto', border: '1px solid #ccc', padding: '0.5rem' }}>
              <h5>Horaires</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Numéro du Train</th>
                    <th>Gare de Provenance</th>
                    <th>Gare de Destination</th>
                    <th>Heure de Départ</th>
                    <th>Type de Train</th>
                    <th>Matériel Roulant</th>
                    <th>Jours de Circulation</th>
                    <th>Dossier</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedSchedules.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center">Aucun horaire créé</td>
                    </tr>
                  ) : (
                    displayedSchedules.map((schedule, index) => (
                    <tr
                      key={schedule.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('scheduleId', schedule.id.toString());
                        e.dataTransfer.setData('scheduleIndex', index.toString());
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const draggedIndex = Number(e.dataTransfer.getData('scheduleIndex'));
                        const targetIndex = index;
                        if (draggedIndex === targetIndex) return;

                        const newOrder = [...scheduleOrder];
                        // If scheduleOrder is empty, initialize it with current displayedSchedules ids
                        if (newOrder.length === 0) {
                          newOrder.push(...displayedSchedules.map(s => s.id));
                        }
                        // Remove dragged id
                        const [movedId] = newOrder.splice(draggedIndex, 1);
                        // Insert at target index
                        newOrder.splice(targetIndex, 0, movedId);
                        setScheduleOrder(newOrder);
                        localStorage.setItem('scheduleOrder', JSON.stringify(newOrder));
                      }}
                      style={{ cursor: 'grab' }}
                      onClick={() => { setSelectedSchedule(schedule); setShowDetailsModal(true); }}
                    >
                        <td>{schedule.trainNumber}</td>
                        <td>{schedule.departureStation}</td>
                        <td>{schedule.arrivalStation}</td>
                        <td>{schedule.departureTime}</td>
                        <td>{schedule.trainType}</td>
                        <td>
                          <a 
                            href="/admin/compositions-trains" 
                            className={schedule.rollingStockFileName ? "text-primary" : "text-muted"}
                          >
                            {schedule.rollingStockFileName ? "Voir la composition" : "Définir la composition"}
                          </a>
                        </td>
                        <td>{schedule.joursCirculation ? schedule.joursCirculation.join(', ') : '-'}</td>
                        <td>{folders.find(f => f.id === scheduleFolderMap[schedule.id])?.name || '-'}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-warning me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSchedule(schedule);
                              setTrainNumber(schedule.trainNumber);
                              setDepartureStation(schedule.departureStation);
                              setArrivalStation(schedule.arrivalStation);
                              setArrivalTime(schedule.arrivalTime);
                              setDepartureTime(schedule.departureTime);
                              setTrainType(schedule.trainType);
                              setServedStations(schedule.servedStations && schedule.servedStations.length > 0 ? schedule.servedStations : [{ name: '', arrivalTime: '', departureTime: '' }]);
                              setJoursCirculation(schedule.joursCirculation || []);
                              setFolderId(scheduleFolderMap[schedule.id] || null);
                              setShowModal(true);
                            }}
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) {
                                deleteSchedule(schedule.id);
                                setSchedules(getAllSchedules());
                                if (selectedSchedule && selectedSchedule.id === schedule.id) {
                                  setSelectedSchedule(null);
                                  setShowDetailsModal(false);
                                }
                                // Remove from folder map
                                const newMap = { ...scheduleFolderMap };
                                delete newMap[schedule.id];
                                saveScheduleFolderMap(newMap);
                              }
                            }}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showModal && (
            <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <form onSubmit={handleSubmit}>
                    <div className="modal-header">
                      <h5 className="modal-title">{editingSchedule ? 'Modifier un horaire' : 'Créer un horaire'}</h5>
                      <button type="button" className="btn-close" aria-label="Close" onClick={handleModalClose}></button>
                    </div>
                    <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                      <div className="mb-3">
                        <label htmlFor="trainNumber" className="form-label">Numéro du Train</label>
                        <input
                          type="text"
                          id="trainNumber"
                          className="form-control"
                          value={trainNumber}
                          onChange={(e) => setTrainNumber(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="departureStation" className="form-label">Gare de Provenance</label>
                        <input
                          type="text"
                          id="departureStation"
                          className="form-control"
                          value={departureStation}
                          onChange={(e) => setDepartureStation(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="arrivalStation" className="form-label">Gare de Destination</label>
                        <input
                          type="text"
                          id="arrivalStation"
                          className="form-control"
                          value={arrivalStation}
                          onChange={(e) => setArrivalStation(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="arrivalTime" className="form-label">Heure d'Arrivée</label>
                        <input
                          type="time"
                          id="arrivalTime"
                          className="form-control"
                          value={arrivalTime}
                          onChange={(e) => setArrivalTime(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="departureTime" className="form-label">Heure de Départ</label>
                        <input
                          type="time"
                          id="departureTime"
                          className="form-control"
                          value={departureTime}
                          onChange={(e) => setDepartureTime(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="trainType" className="form-label">Type de Train</label>
                        <select
                          id="trainType"
                          className="form-select"
                          value={trainType}
                          onChange={(e) => setTrainType(e.target.value)}
                          required
                        >
                          <option value="">Sélectionnez un type</option>
                          {trainTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="folderSelect" className="form-label">Dossier</label>
                        <select
                          id="folderSelect"
                          className="form-select"
                          value={folderId || ''}
                          onChange={(e) => setFolderId(e.target.value ? Number(e.target.value) : null)}
                        >
                          <option value="">-- Aucun --</option>
                          {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>{folder.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Composition du Train</label>
                        <TrainVisualSlider 
                          trainNumber={trainNumber}
                          composition={editingSchedule?.composition || []}
                          visualHeight={200}
                        />
                        <div className="mt-2 text-center">
                          <a 
                            href="/admin/compositions-trains" 
                            className="text-info"
                          >
                            <span className="material-icons align-middle me-1">info</span>
                            {editingSchedule?.composition && editingSchedule.composition.length > 0 
                              ? "Modifier la composition dans la section Compositions Trains"
                              : "Définir la composition dans la section Compositions Trains"
                            }
                          </a>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Liste des Gares Desservies</label>
                        {servedStations.map((station, index) => (
                          <div key={index} className="d-flex mb-2 align-items-center">
                            <input
                              type="text"
                              className="form-control me-2 flex-grow-1"
                              placeholder="Nom de la gare"
                              value={station.name}
                              onChange={(e) => {
                                const newStations = [...servedStations];
                                newStations[index].name = e.target.value;
                                setServedStations(newStations);
                              }}
                            />
                            <input
                              type="time"
                              className="form-control me-2"
                              placeholder="Heure d'arrivée"
                              value={station.arrivalTime}
                              onChange={(e) => {
                                const newStations = [...servedStations];
                                newStations[index].arrivalTime = e.target.value;
                                setServedStations(newStations);
                              }}
                            />
                            <input
                              type="time"
                              className="form-control me-2"
                              placeholder="Heure de départ"
                              value={station.departureTime}
                              onChange={(e) => {
                                const newStations = [...servedStations];
                                newStations[index].departureTime = e.target.value;
                                setServedStations(newStations);
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => {
                                const newStations = servedStations.filter((_, i) => i !== index);
                                setServedStations(newStations);
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setServedStations([...servedStations, { name: '', arrivalTime: '', departureTime: '' }])}
                        >
                          +
                        </button>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Jours de Circulation</label>
                        <div className="d-flex flex-wrap">
                          {WEEK_DAYS.map(day => (
                            <div key={day.value} className="form-check me-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`day-${day.value}`}
                                checked={joursCirculation.includes(day.value)}
                                onChange={() => handleJoursCirculationChange(day.value)}
                              />
                              <label className="form-check-label" htmlFor={`day-${day.value}`}>
                                {day.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">Enregistrer</button>
                      <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Annuler</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
          {showDetailsModal && selectedSchedule && (
            <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Détails de l'horaire</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowDetailsModal(false)}></button>
                  </div>
                  <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <p><strong>Numéro du Train:</strong> {selectedSchedule.trainNumber}</p>
                    <p><strong>Gare de Provenance:</strong> {selectedSchedule.departureStation}</p>
                    <p><strong>Gare de Destination:</strong> {selectedSchedule.arrivalStation}</p>
                    <p><strong>Heure d'Arrivée:</strong> {selectedSchedule.arrivalTime}</p>
                    <p><strong>Heure de Départ:</strong> {selectedSchedule.departureTime}</p>
                    <p><strong>Type de Train:</strong> {selectedSchedule.trainType}</p>
                    <div className="mb-4">
                      <strong>Composition du Train:</strong>
                      <TrainVisualSlider 
                        trainNumber={selectedSchedule.trainNumber}
                        composition={selectedSchedule.composition || []}
                        visualHeight={200}
                      />
                      <div className="mt-2 text-center">
                        <a 
                          href="/admin/compositions-trains" 
                          className={selectedSchedule.composition && selectedSchedule.composition.length > 0 ? "text-primary" : "text-muted"}
                        >
                          {selectedSchedule.composition && selectedSchedule.composition.length > 0 ? "Modifier la composition" : "Définir la composition"}
                        </a>
                      </div>
                    </div>
                    <div>
                      <strong>Gares Desservies:</strong>
                      {selectedSchedule.servedStations && selectedSchedule.servedStations.length > 0 ? (
                        <ul>
                          {selectedSchedule.servedStations.map((station, idx) => {
                            if (typeof station === 'object' && station !== null) {
                              return (
                                <li key={idx}>
                                  {station.name} (Arrivée: {station.arrivalTime || '-'}, Départ: {station.departureTime || '-'})
                                </li>
                              );
                            } else {
                              return (
                                <li key={idx}>
                                  {station}
                                </li>
                              );
                            }
                          })}
                        </ul>
                      ) : (
                        <p>-</p>
                      )}
                    </div>
                    <div>
                      <strong>Jours de Circulation:</strong> {selectedSchedule.joursCirculation ? selectedSchedule.joursCirculation.join(', ') : '-'}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Fermer</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Sidebar from '../../components/Sidebar';
import { getAllSchedules, updateSchedule } from '../../utils/scheduleUtils';
import { useTrackAssignments } from '../../src/contexts/TrackAssignmentContext';

export default function GestionHoraires() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuaiModal, setShowQuaiModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const { trackAssignments, updateTrackAssignment } = useTrackAssignments();
  const [quaiAssignments, setQuaiAssignments] = useState({});

  useEffect(() => {
      setSchedules(getAllSchedules());
      setLoading(false);
    }, []);
    
  const handleChange = (id, field, value) => {
    const updatedSchedule = schedules.find(s => s.id === id);
    if (!updatedSchedule) return;
    const newSchedule = { ...updatedSchedule, [field]: value };
    updateSchedule(id, newSchedule);

    setSchedules(prev =>
      prev.map(s => (s.id === id ? newSchedule : s))
    );
  };

  const handleReset = () => {
    schedules.forEach(schedule => {
      updateSchedule(schedule.id, { delayMinutes: 0, isCancelled: false });
    });
    setSchedules(getAllSchedules());
  };

  const handleQuaiChange = (stationName, value) => {
    if (selectedSchedule) {
      updateTrackAssignment(selectedSchedule.id, stationName, value);
      setQuaiAssignments(prev => ({
        ...prev,
        [stationName]: value
      }));
    }
  };

  const closeQuaiModal = () => {
    setShowQuaiModal(false);
    setSelectedSchedule(null);
    setQuaiAssignments({});
  };

  if (loading) return <Layout><div><p>Chargement...</p></div></Layout>;

  return (
    <div id="wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <div className="container py-4">
          <h1>Gestion des Horaires</h1>
          <button className="btn btn-danger mb-3" onClick={handleReset}>
            Remettre à zéro retards et suppressions
          </button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Train</th>
                <th>Départ</th>
                <th>Arrivée</th>
                <th>Quai</th>
                <th>Retard (min)</th>
                <th>Supprimé</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(schedule => (
                <tr key={schedule.id} style={schedule.isCancelled ? { textDecoration: 'line-through', color: 'red' } : {}}>
                  <td>{schedule.trainNumber}</td>
                  <td>{schedule.departureStation}</td>
                  <td>{schedule.arrivalStation}</td>
                  <td className="d-flex align-items-center gap-2">
                    
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        const assignments = {};
                        if (schedule.departureStation) {
                          assignments[schedule.departureStation] = trackAssignments[schedule.id]?.[schedule.departureStation] || '';
                        }
                        if (schedule.servedStations) {
                          schedule.servedStations.forEach(station => {
                            const stationName = typeof station === 'object' ? station.name : station;
                            assignments[stationName] = trackAssignments[schedule.id]?.[stationName] || '';
                          });
                        }
                        if (schedule.arrivalStation) {
                          assignments[schedule.arrivalStation] = trackAssignments[schedule.id]?.[schedule.arrivalStation] || '';
                        }
                        setQuaiAssignments(assignments);
                        setSelectedSchedule(schedule);
                        setShowQuaiModal(true);
                      }}
                    >
                      Attribution
                    </button>
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={schedule.delayMinutes || 0}
                      onChange={e => handleChange(schedule.id, 'delayMinutes', Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!schedule.isCancelled}
                      onChange={e => handleChange(schedule.id, 'isCancelled', e.target.checked)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showQuaiModal && selectedSchedule && (
            <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Attribution des quais - Train {selectedSchedule.trainNumber}</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={closeQuaiModal}></button>
                  </div>
                  <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <form>
                      {[selectedSchedule.departureStation]
                        .concat(selectedSchedule.servedStations?.map(s => (typeof s === 'object' ? s.name : s)) || [])
                        .concat([selectedSchedule.arrivalStation])
                        .map((stationName, idx) => (
                          <div key={idx} className="mb-3">
                            <label className="form-label">{stationName}</label>
                            <input
                              type="text"
                              className="form-control"
                              value={quaiAssignments[stationName] || ''}
                              onChange={e => handleQuaiChange(stationName, e.target.value)}
                              placeholder="Quai"
                            />
                          </div>
                        ))}
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeQuaiModal}>Fermer</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <style jsx>{`
            .container {
              max-width: 900px;
            }
            input[type="number"] {
              width: 100px;
            }
            .modal-content {
              max-width: 500px;
              margin: auto;
            }
          `}</style>
        </div>
      </Layout>
    </div>
  );
}

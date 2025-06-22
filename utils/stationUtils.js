// Fonction pour extraire toutes les gares uniques d'un horaire
export const extractStationsFromSchedule = (schedule) => {
  const stations = new Set();
  stations.add(schedule.departureStation);
  stations.add(schedule.arrivalStation);
  if (schedule.viaStations && Array.isArray(schedule.viaStations)) {
    schedule.viaStations.forEach(station => stations.add(station));
  }
  return Array.from(stations);
};

// Fonction pour mettre à jour la liste des gares dans la base de données MySQL via API
export const updateStationsFromSchedule = async (schedule) => {
  if (typeof window === 'undefined') return;

  // Récupérer les gares existantes depuis l'API
  const res = await fetch('/api/stations');
  const existingStations = await res.json();
  const existingStationNames = new Set(existingStations.map(s => s.name));

  // Extraire les gares de l'horaire
  const scheduleStations = extractStationsFromSchedule(schedule);

  // Ajouter les nouvelles gares via l'API
  for (const stationName of scheduleStations) {
    if (!existingStationNames.has(stationName)) {
      await fetch('/api/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: stationName }),
      });
    }
  }
};

// Fonction pour mettre à jour la liste des gares à partir de plusieurs horaires
export const updateStationsFromSchedules = (schedules) => {
  if (!Array.isArray(schedules)) return;
  schedules.forEach(schedule => updateStationsFromSchedule(schedule));
};

// Fonction pour ajouter une nouvelle gare
export const addStation = async (stationName) => {
  if (typeof window === 'undefined' || !stationName) return false;

  // Vérifier si la gare existe déjà
  const res = await fetch('/api/stations');
  const existingStations = await res.json();
  if (!existingStations.some(s => s.name === stationName)) {
    await fetch('/api/stations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: stationName }),
    });
    return true;
  }
  return false;
};

// Fonction pour récupérer toutes les gares
export const getAllStations = async () => {
  if (typeof window === 'undefined') return [];
  const res = await fetch('/api/stations');
  return await res.json();
};

// Fonction pour vérifier si une gare existe
export const stationExists = async (stationName) => {
  if (typeof window === 'undefined' || !stationName) return false;
  const stations = await getAllStations();
  return stations.some(s => s.name === stationName);
};

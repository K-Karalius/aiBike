import { useState, useEffect } from 'react';
import { getStation } from '@/apis/stationApis';

export function useStationName(stationId: string | null) {
  const [stationName, setStationName] = useState<string | null>(null);

  useEffect(() => {
    if (!stationId) {
      setStationName(null);
      return;
    }

    getStation(stationId)
      .then((station) => setStationName(station.name))
      .catch(() => setStationName('Unknown'));
  }, [stationId]);

  return stationName;
}

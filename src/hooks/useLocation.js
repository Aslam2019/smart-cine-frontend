import { useState, useEffect } from 'react'
import { theatresAPI } from '../api'

export function useLocation() {
  const [location, setLocation] = useState(null)
  const [locationName, setLocationName] = useState('Detecting...')
  const [nearbyTheatres, setNearbyTheatres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const haversine = (lat1, lng1, lat2, lng2) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
    return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1))
  }

  const fetchNearby = async (lat, lng) => {
    try {
      const res = await theatresAPI.getNearby({ lat, lng, radius: 30 })
      setNearbyTheatres(res.data.theatres || [])
    } catch {
      // Fallback: all theatres with calculated distance
      try {
        const res = await theatresAPI.getAll()
        const theatres = res.data.theatres.map(t => ({
          ...t,
          distance: haversine(lat, lng, t.location.coordinates[1], t.location.coordinates[0])
        })).sort((a, b) => a.distance - b.distance)
        setNearbyTheatres(theatres)
      } catch {}
    }
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationName('Trichy, TN')
      setError('Geolocation not supported')
      setLoading(false)
      // Use Trichy center as fallback
      fetchNearby(10.8151, 78.6940)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({ lat: latitude, lng: longitude })
        setLocationName('Trichy, TN')
        fetchNearby(latitude, longitude)
        setLoading(false)
      },
      () => {
        setLocationName('Trichy (approx)')
        setError('Location permission denied')
        setLoading(false)
        fetchNearby(10.8151, 78.6940)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [])

  return { location, locationName, nearbyTheatres, loading, error }
}

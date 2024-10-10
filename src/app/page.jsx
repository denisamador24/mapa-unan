'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus } from "lucide-react"

// Coordenadas de UNAN Managua
const UNAN_MANAGUA = { lat: 12.105780, lng: -86.270792 }

// Componente para actualizar la vista del mapa
function ChangeView({ center, zoom }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

// Icono personalizado para marcadores
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
})

export default function UniversityMapSearch() {
  const [center, setCenter] = useState([UNAN_MANAGUA.lat, UNAN_MANAGUA.lng])
  const [zoom, setZoom] = useState(16)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [places, setPlaces] = useState([
    { name: 'Porton #7 UNAN', lat: 12.1058288, lng: -86.272669 },
    { name: 'Departamento de Quimica', lat: 12.1058288, lng: -86.272669 },
    { name: 'Comerdor de la UNAN', lat: 12.1060099, lng: -86.2728715 }
  ])
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [password, setPassword] = useState('')
  const [newPlace, setNewPlace] = useState({ name: '', lat: '', lng: '' })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
        },
        (error) => {
          console.error("Error getting user location:", error)
        }
      )
    }

    // Cargar lugares desde localStorage
    const storedPlaces = localStorage.getItem('universityPlaces')
    if (storedPlaces) {
      setPlaces(JSON.parse(storedPlaces))
    }
  }, [])

  useEffect(() => {
    // Guardar lugares en localStorage cuando se actualicen
    localStorage.setItem('universityPlaces', JSON.stringify(places))
  }, [places])

  const handleSearch = (event) => {
    const value = event.target.value
    setSearchTerm(value)
    if (value.length > 0) {
      const filteredPlaces = places.filter(place =>
        place.name.toLowerCase().includes(value.toLowerCase())
      )
      setSearchResults(filteredPlaces)
    } else {
      setSearchResults([])
    }
  }

  const handleSelectPlace = (place) => {
    setCenter([place.lat, place.lng])
    setZoom(18)
    setSearchTerm(place.name)
    setSearchResults([])
    setSearchHistory(prev => [place.name, ...prev.filter(p => p !== place.name).slice(0, 4)])
    setSelectedPlace(place)
  }

  const handleAdminLogin = () => {
    // En una aplicación real, esto debería ser una autenticación segura
    if (password === 'admin123') {
      setIsAdmin(true)
    } else {
      alert('Contraseña incorrecta')
    }
  }

  const handleAddPlace = () => {
    if (newPlace.name && newPlace.lat && newPlace.lng) {
      setPlaces(prev => [...prev, { ...newPlace, lat: parseFloat(newPlace.lat), lng: parseFloat(newPlace.lng) }])
      setNewPlace({ name: '', lat: '', lng: '' })
    }
  }

  return (
    <div className="flex h-screen">
      <div className='flex z-10'>


        <aside className="w-64 bg-background border-r">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Buscar lugares</h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar en la universidad"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-8"
              />
            </div>
            {searchResults.length > 0 && (
              <ScrollArea className="h-40 mt-2">
                <ul className="space-y-1">
                  {searchResults.map((place, index) => (
                    <li
                      key={index}
                      className="px-2 py-1 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => handleSelectPlace(place)}
                    >
                      {place.name}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
          <Separator />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">Búsquedas recientes</h3>
            <ScrollArea className="h-40">
              <ul className="space-y-1">
                {searchHistory.map((placeName, index) => (
                  <li
                    key={index}
                    className="px-2 py-1 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => {
                      const place = places.find(p => p.name === placeName)
                      if (place) handleSelectPlace(place)
                    }}
                  >
                    {placeName}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
          <Separator />
          <div className="p-4 z-10">
            <Dialog className=''>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Agregar lugar
                </Button>
              </DialogTrigger>
              <DialogContent className=''>
                <DialogHeader>
                  <DialogTitle>Agregar nuevo lugar</DialogTitle>
                </DialogHeader>
                {isAdmin ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="place-name">Nombre del lugar</Label>
                      <Input
                        id="place-name"
                        value={newPlace.name}
                        onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="place-lat">Latitud</Label>
                      <Input
                        id="place-lat"
                        value={newPlace.lat}
                        onChange={(e) => setNewPlace({ ...newPlace, lat: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="place-lng">Longitud</Label>
                      <Input
                        id="place-lng"
                        value={newPlace.lng}
                        onChange={(e) => setNewPlace({ ...newPlace, lng: e.target.value })}
                      />
                    </div>
                    <Button onClick={handleAddPlace}>Agregar lugar</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      type="password"
                      placeholder="Contraseña de administrador"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handleAdminLogin}>Iniciar sesión</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </aside>
      </div>
      <main className="flex-1 z-0">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ChangeView center={center} zoom={zoom} />
          {selectedPlace ? (
            <Marker position={[selectedPlace.lat, selectedPlace.lng]} icon={customIcon}>
              <Popup>{selectedPlace.name}</Popup>
            </Marker>
          ) : (
            places.map((place, index) => (
              <Marker key={index} position={[place.lat, place.lng]} icon={customIcon}>
                <Popup>{place.name}</Popup>
              </Marker>
            ))
          )}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>Tu ubicación</Popup>
            </Marker>
          )}
        </MapContainer>
      </main>
    </div>
  )
}
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
  iconUrl: '/location.png',
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
    {
      "name": "Centro de innovación y diseño",
      "lat": 12.107481,
      "lng": -86.2732385
    },
    {
      "name": "Laboratorio de electrónica básica 1",
      "lat": 12.1068031,
      "lng": -86.2731997
    },
    {
      "name": "Estadio nacional",
      "lat": 12.1092217,
      "lng": -86.2732362
    },
    {
      "name": "Canchas Marlon Zelaya",
      "lat": 12.1072128,
      "lng": -86.2729479
    },
    {
      "name": "Portón #8",
      "lat": 12.1056613,
      "lng": -86.2739644
    },
    {
      "name": "Pabellón 11",
      "lat": 12.105677,
      "lng": -86.2738109
    },
    {
      "name": "Gimnasio, karate, yudo",
      "lat": 12.1063346,
      "lng": -86.2735185
    },
    {
      "name": "Laboratorio de geología",
      "lat": 12.1058983,
      "lng": -86.27383
    },
    {
      "name": "Portón 7",
      "lat": 12.1055174,
      "lng": -86.2730535
    },
    {
      "name": "Editorial universidad UNAN-CNU",
      "lat": 12.1059055,
      "lng": -86.2731695
    },
    {
      "name": "Departamento de Química",
      "lat": 12.1062481,
      "lng": -86.2731215
    },
    {
      "name": "Pabellón 15",
      "lat": 12.1060488,
      "lng": -86.2737445
    },
    {
      "name": "Departamento de Psicología",
      "lat": 12.106547,
      "lng": -86.2729445
    },
    {
      "name": "Departamento de Pedagogía",
      "lat": 12.1065084,
      "lng": -86.2727765
    },
    {
      "name": "Departamento de Cultura",
      "lat": 12.1063402,
      "lng": -86.2730518
    },
    {
      "name": "Portón 1",
      "lat": 12.1066188,
      "lng": -86.2724922
    },
    {
      "name": "Club Universitario UNAN",
      "lat": 12.1070007,
      "lng": -86.2729442
    },
    {
      "name": "Baños del Pabellón 7",
      "lat": 12.1067716,
      "lng": -86.2729214
    },
    {
      "name": "Pabellón 19",
      "lat": 12.106568,
      "lng": -86.2733535
    },
    {
      "name": "Comedor central de UNAN",
      "lat": 12.1050682,
      "lng": -86.2731792
    },
    {
      "name": "Estacionamiento Portón 8",
      "lat": 12.1064008,
      "lng": -86.2737555
    },
    {
      "name": "Portón 2",
      "lat": 12.1066339,
      "lng": -86.2721673
    },
    {
      "name": "Pabellón 2 Servicios de Seguridad",
      "lat": 12.106072,
      "lng": -86.2719501
    },
    {
      "name": "Pabellón 4 Dirección y Extensión UNAN",
      "lat": 12.1062425,
      "lng": -86.2719497
    },
    {
      "name": "Secretaría General UNAN",
      "lat": 12.1061989,
      "lng": -86.2716728
    },
    {
      "name": "Pabellón 6 Salón de Rectores",
      "lat": 12.1063641,
      "lng": -86.2719457
    },
    {
      "name": "Edificio de Registro Académico UNAN",
      "lat": 12.1063215,
      "lng": -86.2715779
    },
    {
      "name": "Oficinas de UNEN (RUD)",
      "lat": 12.1063297,
      "lng": -86.2713975
    },
    {
      "name": "Micro-empresa Kiosco 2",
      "lat": 12.1060255,
      "lng": -86.2713982
    },
    {
      "name": "Clínica",
      "lat": 12.1058917,
      "lng": -86.2711944
    },
    {
      "name": "Portón 4",
      "lat": 12.1055174,
      "lng": -86.2722508
    },
    {
      "name": "Estacionamiento Principal Portón 4",
      "lat": 12.105421,
      "lng": -86.2715498
    },
    {
      "name": "Oficina de UNEN Pabellón 14",
      "lat": 12.1060989,
      "lng": -86.2710076
    },
    {
      "name": "Pabellón 16",
      "lat": 12.1062123,
      "lng": -86.2708631
    },
    {
      "name": "Auditorio 12 Fernando Gordillo",
      "lat": 12.1059062,
      "lng": -86.2708457
    },
    {
      "name": "Departamento de Derecho",
      "lat": 12.1053541,
      "lng": -86.2711032
    },
    {
      "name": "Pabellón 28",
      "lat": 12.1052168,
      "lng": -86.2710633
    },
    {
      "name": "Pabellón 26 Departamento de Lenguas Extranjeras",
      "lat": 12.1050656,
      "lng": -86.2710499
    },
    {
      "name": "Auditorio Sergio Herrera",
      "lat": 12.1050312,
      "lng": -86.2708249
    },
    {
      "name": "Pabellón 32",
      "lat": 12.1051466,
      "lng": -86.2703716
    },
    {
      "name": "Pabellón 34 Escuela Preparatoria",
      "lat": 12.105244,
      "lng": -86.2701014
    },
    {
      "name": "Pabellón 36",
      "lat": 12.1052951,
      "lng": -86.2704604
    },
    {
      "name": "Facultad de Humanidades y Ciencias Jurídicas",
      "lat": 12.1058632,
      "lng": -86.2702569
    }
  ]
  )
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
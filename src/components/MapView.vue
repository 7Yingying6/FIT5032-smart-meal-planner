<template>
  <section class="map-section">
    <div class="header mb-3">
      <h2 class="title mb-0">Nearby Supermarkets</h2>
    </div>
    
    <!-- Address Search Box -->
    <div class="search-container mb-3">
      <div class="input-group">
        <span class="input-group-text">
          <Icon icon="mdi:map-marker" />
        </span>
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="Search address to find nearby supermarkets..."
          aria-label="Search address"
          @keyup.enter="handleSearch"
          @input="handleSearch"
          @blur="hideSuggestions"
          :disabled="loading"
        />
        <button 
          class="btn btn-outline-primary" 
          type="button" 
          @click="handleSearch"
          :disabled="loading || !searchQuery.trim()"
          aria-label="Search nearby supermarkets"
        >
          <Icon :icon="loading ? 'mdi:loading' : 'mdi:magnify'" :class="{ 'icon-spin': loading }" />
        </button>
      </div>
      <div v-if="searchSuggestions.length > 0" class="suggestions-dropdown">
        <div 
          v-for="(suggestion, index) in searchSuggestions" 
          :key="index"
          class="suggestion-item"
          @click="selectSuggestion(suggestion)"
        >
          <Icon icon="mdi:map-marker-outline" class="me-2" />
          <div>
            <div class="suggestion-main">{{ suggestion.structured_formatting?.main_text || suggestion.description }}</div>
            <div class="suggestion-secondary">{{ suggestion.structured_formatting?.secondary_text || '' }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div ref="mapEl" class="map" role="region" aria-label="Nearby supermarkets map"></div>
    <p v-if="error" class="text-danger mt-2">{{ error }}</p>
    <div class="footer mt-3 text-end">
      <button class="btn btn-success" @click="refresh" :disabled="loading" aria-label="Refresh map and search results">
        <Icon :icon="loading ? 'mdi:loading' : 'mdi:refresh'" class="me-2" :class="{ 'icon-spin': loading }" />Refresh
      </button>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'

// Default center point (Melbourne CBD)
const DEFAULT_CENTER = Object.freeze({ latitude: -37.8136, longitude: 144.9631 })

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
console.log('Google Maps API Key available:', !!API_KEY)

const mapEl = ref(null)
const searchInput = ref(null)
const map = ref(null)
const markers = ref([])
const infoWindow = ref(null)
const loading = ref(false)        // Only for geolocation/refresh operations; search won't change this to avoid input box being disabled
const error = ref('')
const ready = ref(false)

// Search related
const searchQuery = ref('')
const searchSuggestions = ref([])
const autocompleteService = ref(null) // Keep for address search functionality

let suggestTimer = null  // Input debounce timer

// ---------- Load Google Maps SDK ----------
async function loadGoogleMapsApi() {
  if (window.google && window.google.maps) return

  if (!API_KEY || typeof API_KEY !== 'string' || API_KEY.trim() === '') {
    throw new Error('Missing Google Maps API key. Please set VITE_GOOGLE_MAPS_API_KEY in .env.local')
  }

  const existing = document.querySelector('script[data-google-maps-sdk]')
  if (existing) {
    await new Promise((resolve, reject) => {
      existing.addEventListener('load', resolve, { once: true })
      existing.addEventListener('error', reject, { once: true })
    })
    return
  }

  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`
  script.async = true
  script.defer = true
  script.setAttribute('data-google-maps-sdk', 'true')
  document.head.appendChild(script)

  await new Promise((resolve, reject) => {
    script.addEventListener('load', resolve, { once: true })
    script.addEventListener('error', reject, { once: true })
  })
  console.log('Google Maps SDK loaded successfully')
}

// ---------- Initialize Places services (legacy interface for suggestions and details) ----------
function initPlacesServices() {
  if (!google?.maps) return
  try {
    // Keep AutocompleteService for address search functionality
    autocompleteService.value = new google.maps.places.AutocompleteService()
  } catch (e) {
    console.warn('initPlacesServices failed:', e)
  }
}

function clearMarkers() {
  markers.value.forEach(m => m.setMap?.(null))
  markers.value = []
}

// ---------- Utility functions: coordinates and bounds ----------
function normalizePosition(pos) {
  // Compatible with multiple return types: LatLng instance / {lat,lng} / {latitude,longitude}
  if (!pos) return null
  if (typeof pos.lat === 'function' && typeof pos.lng === 'function') {
    return { lat: pos.lat(), lng: pos.lng() } // google.maps.LatLng
  }
  if ('lat' in pos && 'lng' in pos) return { lat: pos.lat, lng: pos.lng }
  if ('latitude' in pos && 'longitude' in pos) return { lat: pos.latitude, lng: pos.longitude }
  return null
}

function makeBounds(center, radiusMeters) {
  const lat = center.lat
  const lng = center.lng
  const dLat = radiusMeters / 111320 // ~ meters per degree latitude
  const dLng = radiusMeters / (111320 * Math.cos((lat * Math.PI) / 180))
  return {
    north: lat + dLat,
    south: lat - dLat,
    east: lng + dLng,
    west: lng - dLng
  }
}

// ---------- Input search (debounce + auto-select first suggestion on Enter) ----------
async function handleSearch(event) {
  const query = searchQuery.value.trim()
  if (!query || !autocompleteService.value) return

  // Debounce to avoid hitting API on every keystroke
  if (suggestTimer) clearTimeout(suggestTimer)
  suggestTimer = setTimeout(() => {
    try {
      error.value = ''
      const request = {
        input: query,
        // Support cities/regions
        types: ['(regions)'],
        componentRestrictions: { country: 'au' }
      }

      autocompleteService.value.getPlacePredictions(request, (predictions, status) => {
        const ok = status === google.maps.places.PlacesServiceStatus.OK
        const has = ok && Array.isArray(predictions) && predictions.length > 0

        if (has) {
          searchSuggestions.value = predictions.slice(0, 5)
          // Auto-select first suggestion on Enter
          if (event && event.type === 'keyup') {
            selectSuggestion(predictions[0])
          }
        } else {
          searchSuggestions.value = []
          geocodeAndSearch(query) // Fallback to geocoding when no suggestions
        }
      })
    } catch (e) {
      console.error('handleSearch failed:', e)
      error.value = 'Search failed, please try again'
    }
  }, 250)
}

// ---------- Select suggestion and search supermarkets ----------
async function selectSuggestion(suggestion) {
  searchQuery.value = suggestion.description
  searchSuggestions.value = []

  try {
    // Use new Places API for place details
    const { Place } = await google.maps.importLibrary("places");
    
    loading.value = true
    const place = new Place({
      id: suggestion.place_id,
      requestedLanguage: 'en'
    });

    await place.fetchFields({
      fields: ['location', 'displayName', 'formattedAddress']
    });

    if (place.location) {
      const center = { lat: place.location.lat(), lng: place.location.lng() }
      map.value.setCenter(center)
      map.value.setZoom(15)
      clearMarkers()
      addSearchLocationMarker(center, place.displayName || 'Searched Location')
      searchNearby(center)
    } else {
      error.value = 'Unable to find the selected location'
    }
  } catch (err) {
    console.error('Place details fetch failed:', err)
    error.value = 'Unable to find the selected location'
  } finally {
    loading.value = false
  }
}

// ---------- Geocoding fallback ----------
function geocodeAndSearch(address) {
  if (!google?.maps) return
  const geocoder = new google.maps.Geocoder()

  geocoder.geocode({ address: address + ', Australia' }, (results, status) => {
    if (status === 'OK' && results[0]) {
      const location = results[0].geometry.location
      const center = normalizePosition(location)
      if (!center) {
        error.value = 'Geocoder returned invalid location'
        return
      }
      map.value.setCenter(center)
      map.value.setZoom(15)
      clearMarkers()
      addSearchLocationMarker(center, results[0].formatted_address)
      searchNearby(center)
      searchSuggestions.value = []
    } else {
      error.value = 'Address not found, please try again'
    }
  })
}

// ---------- Markers ----------
function addSearchLocationMarker(center, title) {
  if (!map.value) return
  const el = document.createElement('div')
  el.style.cssText = `
    width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-bottom:16px solid #3b82f6;cursor:pointer;
  `
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map: map.value,
    position: center,
    title,
    content: el
  })
  const content = `<div style="font-weight:600;color:#3b82f6;">Searched Location</div><div>${title}</div>`
  marker.addListener('click', () => {
    infoWindow.value?.setContent(content)
    infoWindow.value?.open(map.value, marker)
  })
  markers.value.push(marker)
}

function addPlaceMarker(place) {
  console.log("addPlaceMarker called with place:", place);
  
  const raw = place?.location || place?.geometry?.location
  console.log("Raw location data:", raw);
  
  const pos = normalizePosition(raw)
  console.log("Normalized position:", pos);
  
  if (!pos || !map.value) {
    console.warn("Cannot add marker: invalid position or map not available", { pos, mapAvailable: !!map.value });
    return;
  }

  const el = document.createElement('div')
  el.style.cssText = `
    width:16px;height:16px;border-radius:50%;background:#22c55e;border:2px solid #1ea34c;cursor:pointer;
  `
  
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map: map.value,
    position: pos,
    title: place.displayName || place.name || 'Supermarket',
    content: el
  })
  
  console.log("Marker created successfully:", marker);
  
  const content = `<div style="font-weight:600;">${place.displayName || place.name || 'Supermarket'}</div><div style="color:#6b7280;">${place.formattedAddress || place.vicinity || ''}</div>`
  marker.addListener('click', () => {
    infoWindow.value?.setContent(content)
    infoWindow.value?.open(map.value, marker)
  })
  markers.value.push(marker)
  console.log("Marker added to markers array. Total markers:", markers.value.length);
}

// ---------- Use new Places API to search nearby supermarkets ----------
// ---------- Use new Places API v1 ----------
// ---------- Use new Places API v1 ----------
async function searchNearby(center) {
  console.log("Starting searchNearby with center:", center);
  
  try {
    // Import new Places library
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");
    console.log("Places library imported successfully");

    // New interface request format (must use lat/lng instead of latitude/longitude)
    const request = {
      fields: ["displayName", "formattedAddress", "location"],
      locationRestriction: {
        center: { lat: center.lat, lng: center.lng },
        radius: 3000, // Search radius 3 km
      },
      // Search types can include supermarket, convenience store, grocery store
      includedPrimaryTypes: ["supermarket", "grocery_store", "store"],
      maxResultCount: 20,
      rankPreference: SearchNearbyRankPreference.POPULARITY,
    };
    
    console.log("Search request:", request);

    // Call new search interface
    const { places } = await Place.searchNearby(request);
    console.log("New Places API returned results:", places);
    console.log("Number of places found:", places ? places.length : 0);

    clearMarkers();
    if (places && places.length > 0) {
      console.log("Adding markers for", places.length, "places");
      places.forEach((place, index) => {
        console.log(`Adding marker ${index + 1}:`, place);
        addPlaceMarker(place);
      });
      error.value = "";
    } else {
      console.warn("No places found in search results");
      error.value = "No supermarkets found within 3km radius.";
    }
  } catch (err) {
    console.error("New Places API call failed:", err);
    console.error("Error details:", err.message, err.stack);
    error.value = "Nearby supermarket search failed (API error): " + err.message;
  }
}





// ---------- Initialize map ----------
async function initMap(position) {
  if (!google?.maps) return
  await google.maps.importLibrary('maps')
  await google.maps.importLibrary('marker') // Required for AdvancedMarkerElement

  const { latitude, longitude } = position.coords || {}
  const lat = latitude ?? DEFAULT_CENTER.latitude
  const lng = longitude ?? DEFAULT_CENTER.longitude
  const center = { lat, lng }

  map.value = new google.maps.Map(mapEl.value, {
    center,
    zoom: 14,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapId: 'DEMO_MAP_ID'
  })
  infoWindow.value = new google.maps.InfoWindow()
  initPlacesServices()
  ready.value = true
  searchNearby(center)
}

// ---------- Refresh location (only use loading here - don't lock input box) ----------
function refresh() {
  loading.value = true
  navigator.geolocation.getCurrentPosition(
    pos => { initMap(pos); loading.value = false },
    () => {
      error.value = 'Geolocation failed. Using Melbourne CBD as default.'
      initMap({ coords: DEFAULT_CENTER })
      loading.value = false
    },
    { enableHighAccuracy: true, timeout: 6000 }
  )
}

// ---------- Lifecycle ----------
onMounted(() => {
  loadGoogleMapsApi()
    .then(() => refresh())
    .catch(err => { error.value = err.message })
})
</script>





<style scoped>
.map-section { background: #fff; border-radius: 12px; box-shadow: var(--shadow-lg, 0 10px 30px rgba(0,0,0,0.08)); padding: 1rem; }
.title { font-size: 1.25rem; font-weight: 700; }
.map { width: 100%; height: 420px; min-height: 420px; border-radius: 12px; background: #f5f7fa; }
.btn.btn-success { background: var(--color-green-500, #22c55e); border-color: var(--color-green-500, #22c55e); }
.btn.btn-success:hover { background: var(--color-green-400, #10b981); border-color: var(--color-green-400, #10b981); }
.icon-spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Search container styles */
.search-container {
  position: relative;
}

.input-group {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.input-group-text {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-right: none;
  color: #6c757d;
}

.form-control {
  border: 1px solid #e9ecef;
  border-left: none;
  border-right: none;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
}

.form-control:focus {
  border-color: #3b82f6;
  box-shadow: none;
}

.btn-outline-primary {
  border: 1px solid #e9ecef;
  border-left: none;
  background: #f8f9fa;
  color: #3b82f6;
}

.btn-outline-primary:hover {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.btn-outline-primary:disabled {
  background: #f8f9fa;
  border-color: #e9ecef;
  color: #6c757d;
  opacity: 0.6;
}

/* Suggestions dropdown styles */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f1f3f4;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-main {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.95rem;
}

.suggestion-secondary {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .input-group {
    flex-direction: column;
  }
  
  .input-group-text,
  .form-control,
  .btn-outline-primary {
    border-radius: 0;
    border: 1px solid #e9ecef;
  }
  
  .input-group-text {
    border-bottom: none;
    border-radius: 8px 8px 0 0;
  }
  
  .form-control {
    border-top: none;
    border-bottom: none;
  }
  
  .btn-outline-primary {
    border-top: none;
    border-radius: 0 0 8px 8px;
  }
}
</style>
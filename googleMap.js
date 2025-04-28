"use strict";

// This loads helper components from the Extended Component Library,
// https://github.com/googlemaps/extended-component-library.
import {APILoader} from 'https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.11/index.min.js';

const CONFIGURATION = {
  "ctaTitle": "Continuar",
  "mapOptions": {"center":{"lat":37.4221,"lng":-122.0841},"fullscreenControl":true,"mapTypeControl":false,"streetViewControl":true,"zoom":11,"zoomControl":true,"maxZoom":22,"mapId":""},
  "mapsApiKey": "YOUR_API_KEY_HERE",
  "capabilities": {"addressAutocompleteControl":false,"mapDisplayControl":true,"ctaControl":true}
};

const ADDRESS_COMPONENT_TYPES_IN_FORM = [
  'location',
  'locality',
  'administrative_area_level_1',
  'postal_code',
  'country',
];

const REQUIRED_ADDRESS_COMPONENT_TYPES = [
  'location',
  'locality',
  'administrative_area_level_1',
  'postal_code',
];

function getFormInputElement(componentType) {
  return document.getElementById(`${componentType}-input`);
}

function geocodeAddress(geocoder) {
  const hasRequiredInputValues = REQUIRED_ADDRESS_COMPONENT_TYPES.every(
      (componentType) => getFormInputElement(componentType).value,
  );

  if (hasRequiredInputValues) {
    const address = ADDRESS_COMPONENT_TYPES_IN_FORM
        .map((componentType) => getFormInputElement(componentType).value)
        .join(' ');
    geocoder.geocode({address}, (results, status) => {
      if (status === 'OK') {
        renderAddress(results[0]);
      }
    });
  }
}

function renderAddress(place) {
  const mapEl = document.querySelector('gmp-map');
  const markerEl = document.querySelector('gmp-advanced-marker');

  if (place.geometry && place.geometry.location) {
    mapEl.center = place.geometry.location;
    markerEl.position = place.geometry.location;
  } else {
    markerEl.position = null;
  }
}

async function initMap() {
  const {Geocoder} = await APILoader.importLibrary('geocoding');

  const mapOptions = CONFIGURATION.mapOptions;
  mapOptions.mapId = mapOptions.mapId || 'DEMO_MAP_ID';
  mapOptions.center = mapOptions.center || {lat: 37.4221, lng: -122.0841};

  await customElements.whenDefined('gmp-map');
  document.querySelector('gmp-map').innerMap.setOptions(mapOptions);
  const geocoder = new Geocoder();

  for (const componentType of ADDRESS_COMPONENT_TYPES_IN_FORM) {
    const inputEl = getFormInputElement(componentType);
    inputEl.addEventListener('blur', () => geocodeAddress(geocoder));
    inputEl.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        geocodeAddress(geocoder);
      }
    });
  }
}

initMap();

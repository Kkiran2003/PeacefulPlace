
  const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map',
        style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
        zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
        center: listing.geometry.coordinates // center the map on this longitude and latitude
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
    });

    // Set marker options.
const marker = new mapboxgl.Marker({
    color: "red",
    draggable: true
}).setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
 .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`))
    .addTo(map);

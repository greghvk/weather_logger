var map = L.map('map').setView([50, 0], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map);

async function fn() {
  navigator.geolocation.getCurrentPosition(async position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const resp = await fetch('/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: lat,
        lng: lng,
      })
    });
    const json = await resp.json();
    document.getElementById("loc").innerText = json.loc;
    document.getElementById("temperature").innerText = json.temp;
    document.getElementById("cond").innerText = json.cond;
  });
}

document.getElementById("log_btn").addEventListener('click', async event => {
  await fn();
});

document.getElementById("refresh_btn").addEventListener('click', async event => {
  const resp = await fetch('/data');
  const json = await resp.json();
  json.sort((a, b) => a.ts - b.ts)
  for (let el of json) {
    let root = document.createElement("div");
    root.classList.add("db_el");
    let tmp = document.createElement("p");
    let cond = document.createElement("p");
    let loc = document.createElement("p");
    let date = document.createElement("p");

    var marker = L.marker([el.lat, el.lng]).addTo(map);


    marker.bindPopup(`Location: ${el.loc}<br>
                      Temperature: ${el.temp}°C<br>
                      Condition: ${el.cond}<br>
                      Date: ${new Date(el.ts).toLocaleString()}`)

    // tmp.textContent = `Temperature: ${el.temp}°C`;
    // loc.textContent = `Location: ${el.loc}`;
    // date.textContent = `Date: ${new Date(el.ts).toLocaleString()}`
    // cond.textContent = `Condition: ${el.cond}`

    // root.append(loc);
    // root.append(tmp);
    // root.append(cond);
    // root.append(date);

    // document.getElementById("elements").append(root);
  }
});
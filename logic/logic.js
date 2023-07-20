window.onload = function () {
  document.getElementById("outputTextarea").value = "";
  document.getElementById("servicePoints").value = "";
}

async function getLastLocation() {
  const trackingNumber = document.getElementById('trackingNumber').value;
  const apiKey = document.getElementById('apiKey').value;
  const shipmentObject = await makeApiRequest(trackingNumber, apiKey)
  const latestPosition = getFinalPosition(shipmentObject)

  document.getElementById("outputTextarea").value = latestPosition;

}

async function makeApiRequest(trackingNumber, apiKey) {
  const endPoint = "https://api-eu.dhl.com/track/shipments"
  const params = `?trackingNumber=${trackingNumber}`;
  const finalURL = endPoint + params

  var requestOptions = {
    method: 'GET',
    headers: {
      'DHL-API-Key': apiKey,
    },
  };

  const responseJSON = await fetch(finalURL, requestOptions)
    .then(response => { return response.json(); })

  return responseJSON.shipments[0];
}

function getFinalPosition(shipmentObject) {
  // Get the latest event (first element in the array)
  const latestEvent = shipmentObject.events[0];

  // Convert the timestamp to a human-readable format
  const timestamp = new Date(latestEvent.timestamp).toLocaleString();

  const description = latestEvent.description;
  const humanReadableTimestamp = timestamp;

  const latestLocality = latestEvent.location.address.addressLocality
  setCityForServicePoint(latestLocality);

  const latestPosition = "Latest event description:\n" + description + " Updated on:\n" + humanReadableTimestamp;
  return latestPosition;
}

function setCityForServicePoint(latestLocality) {
  // Split the string based on the "-" character
  const parts = latestLocality.split('-');
  // Extract the first part and remove leading/trailing spaces
  const city = parts[0].trim();
  document.getElementById("city").value = city;
}

async function getServicePoint() {
  const countryCode = document.getElementById('countryCode').value;
  const apiKey = 'WXImDEH6vJJAnvyRIh4Y80TfPG6aQwFl';
  const city = document.getElementById('city').value;
  await makeSecondApiRequest(countryCode, apiKey, city)

  document.getElementById("servicePoints").value = "Service Points available, however they are too many to print. You can find them in the Object returned in the Console. Sorry for the inconvenience!";
}

async function makeSecondApiRequest(countryCode, apiKey, city) {
  const endPoint = "https://api.dhl.com/location-finder/v1/find-by-address"
  const radius = document.getElementById('radius').value
  let params;
  if (radius) {
    params = `?countryCode=${countryCode}&addressLocality=${city}&radius=${radius}`;
  } else {
    params = `?countryCode=${countryCode}&addressLocality=${city}`;
  }
  const finalURL = endPoint + params

  var requestOptions = {
    method: 'GET',
    headers: {
      'DHL-API-Key': apiKey,
    },
  };

  const responseJSON = await fetch(finalURL, requestOptions)
    .then(response => { return response.json(); })

  console.log(responseJSON)
  return responseJSON;
}
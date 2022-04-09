let url = "http://localhost:3000/locations";
function getbestLoc_boxes() {
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response.status);
      }
    })
    .then(bestLoc_boxes => {
      let content = "";

      for (let bestLoc_box of bestLoc_boxes) {
        const travelDateStart = getDate(bestLoc_box.traveldateStart);
        const travelDateEnd = getDate(bestLoc_box.traveldateEnd);
        content += `<div class="little_box"><div>
            <img class="picture_city" src="${bestLoc_box.image}">
            <h2 class="cityName">${bestLoc_box.city}</h2>
            <h2 class="countryName">${bestLoc_box.country}</h2></div><div>
            <p class="traveldate">from ${travelDateStart} to ${travelDateEnd}</p>
        <p>${bestLoc_box.description}</p></div>`;
        content += '</div>';
      }
      document.querySelector(".all_boxes").innerHTML = content;
      addWeatherToEachCity();
    })
    .catch(error => {
      console.log("An error occurred: " + error);
    });
}
function addWeatherToEachCity() {
  document.querySelectorAll(".little_box").forEach(littleBox => {
    weatherInfo(littleBox);
  });
}

function weatherInfo(littleBox) {
  const cityName = littleBox.querySelector(".cityName").innerHTML;
  fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=2d53466c08ef2249534571618fbcc959&units=metric')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response.status);
        return Promise.reject(response.status);
      }
    })
    .then(json => {
      console.log(json);
      littleBox.innerHTML += `<p>${json.weather[0].description}<br>${json.main.temp} °Celsius</p>`;


    })
    .catch(error => {
      console.log("An error occurred: " + error);
    })
}

function getDate(valueTravel) {
  let dateTravel = new Date(valueTravel);
  return dateTravel.toDateString();
}





function insertNewLocation(valuePicture, valueCity, valueCountry, valueTravelStart, valueTravelEnd, valueDescription) {
  let newLocation = {
    image: valuePicture,
    city: valueCity,
    country: valueCountry,
    traveldateStart: valueTravelStart,
    traveldateEnd: valueTravelEnd,
    description: valueDescription
  }
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(newLocation)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response.status);
      }
    })
    .then(answer => {
      console.log(answer);
      // { name: 'Angelica', city: 'Berlin', country: 'Germany', id: 5}^
      getbestLoc_boxes();
      alert("Location number " + answer.id + " inserted");
    })
    .catch(error => {
      console.log("An error occurred: " + error);
    });
}
document.querySelector(".addLocation").addEventListener("submit", function (event) { // e, evt, event
  // stop the submission of the form
  event.preventDefault();
  let valuePicture = document.querySelector("#newPic").value;
  let valueCity = document.querySelector("#city").value;
  let valueCountry = document.querySelector("#country").value;
  let valueTravelStart = document.querySelector("#travelStart").value;
  let valueTravelEnd = document.querySelector("#travelEnd").value;
  let valueDescription = document.querySelector("#description").value;
  console.log(valueDescription);
  insertNewLocation(valuePicture, valueCity, valueCountry, valueTravelStart, valueTravelEnd, valueDescription);
  weatherInfo(valueCity);

});


getbestLoc_boxes();







//förenkla: lägg in callback i getData
//lägg ihop get tab data och get planet
//var ska jag ha catch?

//Hämtar från API
let next;
let previous;

async function getData(url, callback, callback2) {

  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.status)
  } else {
    let starWarsData = await response.json()
    next = starWarsData.next;
    previous = starWarsData.previous;
    callback(starWarsData);
    if (callback2) {
      callback2(starWarsData)
    };
    //gör så att det är ok att bara skicka in en callback
    loading.classList.add("hidden");
    return starWarsData
  }
}



// async function getData(url) {

//   let response = await fetch(url);
//   if (!response.ok) {
//     throw new Error(response.status)
//   } else {
//     let starWarsData = await response.json()
//     next = starWarsData.next;
//     previous = starWarsData.previous;
//     console.log(next)
//     loading.classList.add("hidden")

//     return starWarsData
//   }
// }

//Kör funktionen som hämtar och skriver ut data

let pageNumber = 1;
const firstPage = 'http://swapi.dev/api/people/?page=1'
const footer = document.querySelector(".page");
let numberofPages;


getData(firstPage, printNames, printPageNumber)


function printPageNumber(data) {
  numberofPages = Math.ceil(data.count / data.results.length); //räknar hur många sidor och rundar uppåt
  footer.append(`${pageNumber} / ${numberofPages}`); //skriver ut sidnummer}
}


//Skriver ut namnen på karaktärer och lägger till eventListeners
function printNames(data) {

  const nameList = document.querySelector(".characters");
  erase(nameList);

  for (i = 0; i < data.results.length; i++) {
    let person = data.results[i]
    let personalProperties = ["Name", "Height", "Mass", "Hair color", "Skin color", "Eye color", "Birth year", "Gender"]
    let personalData = [person.name, person.height, person.mass, person.hair_color, person.skin_color, person.eye_color, person.birth_year, person.gender]

    const newA = document.createElement("a");
    newA.setAttribute("href", "#");
    newA.append(person.name);

    newA.addEventListener("click", function () {
      printPersonalData(personalProperties, personalData)
    })
    newA.addEventListener("click", function () {
      // getPlanet(person.homeworld)
      getData(person.homeworld, printPlanet)
    })

    newA.addEventListener("click", function () {
      createTabs(person.homeworld, person.species, person.vehicles, person.starships)
    })
    nameList.appendChild(newA);

  }
}


//Gå bakåt och framåt
const backLink = document.querySelector(".back");
backLink.addEventListener("click", goBack);

const forwardLink = document.querySelector(".forward");
forwardLink.addEventListener("click", goForward);
const nameList = document.querySelector(".characters");



function goBack() {

  if (pageNumber > 1) {
    erase(nameList)

    let loading = document.querySelector(".loading");
    loading.classList.remove('hidden');

    pageNumber--;

    let url = `http://swapi.dev/api/people/?page=${pageNumber}`;

    getData(url, printNames)
    // .then(function (response) {

    erase(footer);
    footer.append(`${pageNumber} / ${numberofPages}`)

    //   printNames(response);
    //   loading.classList.add('hidden');
    // })
    // .catch(function (error) {
    //   alert("det gick inte att ladda sidan, " + error)
    // })

  }
}





function goForward() {

  if (pageNumber < numberofPages) {
    erase(nameList);

    let loading = document.querySelector(".loading");
    loading.classList.remove('hidden');

    pageNumber++;

    let url = `http://swapi.dev/api/people/?page=${pageNumber}`;

    getData(url, printNext)
    // .then(function (response) {

    //   if (response.next != "null") {

    //     erase(footer);
    //     footer.append(`${pageNumber} / ${numberofPages}`)

    //     printNames(response);
    //     loading.classList.add('hidden');
    //   }
    // })
    // .catch(function (error) {
    //   alert("det gick inte att ladda sidan, " + error)
    // })
  }
}

function printNext(response) {

  if (response.next != "null") {

    erase(footer);
    footer.append(`${pageNumber} / ${numberofPages}`)

    printNames(response);
    loading.classList.add('hidden');
  }
}

//sudda
function erase(element) {
  if (element.hasChildNodes) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

//Skriver ut listorna till höger
function printDetails(properties, values, list) {


  for (i = 0; i < properties.length; i++) {

    if (i == 0) {
      let newH3 = document.createElement("h3");
      newH3.append(values[i]);
      list.appendChild(newH3);
    } else {
      newLi = document.createElement("li");
      newLi.append(`${properties[i]} : ${values[i]}`)
      list.appendChild(newLi);
    }
  }
  let br = document.createElement("br");
  list.appendChild(br);
}

//Skriver ut info om karaktärerna när man klickar på dem
function printPersonalData(properties, values) {

  let detailsList = document.querySelector(".details");
  erase(detailsList)

  let loading = document.querySelector(".loadingTopRight");
  loading.classList.remove('hidden');

  printDetails(properties, values, detailsList);

  loading.classList.add('hidden');
}


//Skriver ut info om hemplanet när man klickar på karaktärerna
//ska göras om så den kan skickas in som callback

function printPlanet(response) {
  const planetList = document.querySelector(".planet");
  erase(planetList);
  let loading = document.querySelector(".loadingBottomRight");
  loading.classList.remove('hidden');
  let planetProperties = ["Name", "Rotation Period", "Orbital Period", "Diameter", "Climate", "Gravity", "Terrain"];
  let planetValues = [response.name, response.rotation_period, response.orbital_period, response.diameter, response.climate, response.gravity, response.terrain];
  printDetails(planetProperties, planetValues, planetList)
  loading.classList.add('hidden');
}

// function getPlanet(planet) {

//   const planetList = document.querySelector(".planet");
//   erase(planetList);

//   let loading = document.querySelector(".loadingBottomRight");
//   loading.classList.remove('hidden');

//   getData(planet)

//     .then(function (response) {
//       let planetProperties = ["Name", "Rotation Period", "Orbital Period", "Diameter", "Climate", "Gravity", "Terrain"];
//       let planetValues = [response.name, response.rotation_period, response.orbital_period, response.diameter, response.climate, response.gravity, response.terrain]

//       printDetails(planetProperties, planetValues, planetList)
//       loading.classList.add('hidden');
//     })
// }



//skriver ut infon för flikarna
//ska göras om så den kan skickas in som callback
function getTabData(tabData) {

  const planetList = document.querySelector(".planet");
  erase(planetList);

  let loading = document.querySelector(".loadingBottomRight");
  loading.classList.remove('hidden');

  if (tabData.length == 0) {
    const newH3 = document.createElement("h3");
    loading.classList.add('hidden');
    newH3.append("No data available");
    planetList.appendChild(newH3);
  } else {

    tabData.forEach(function (item, index) {
      getData(tabData[index], konstig);

      // .then(function (response) {

      //   let speciesProperties = Object.keys(response);
      //   let speciesValues = Object.values(response);

      //   printDetails(speciesProperties, speciesValues, planetList);

      //   loading.classList.add('hidden');
      // })
      // .catch(function (error) {
      //   alert(error)
      // })

    })
  }
}

function konstig(response) { //Här sket det sig vet ej varför

  let speciesProperties = Object.keys(response);
  let speciesValues = Object.values(response);

  printDetails(speciesProperties, speciesValues, planetList);

  loading.classList.add('hidden');
}



//gör att aktiv flik har annan färg
function activateTab(tab) {
  var allTabs = document.querySelectorAll(".tabs>a");

  for (var i = 0; i < allTabs.length; i++) {
    allTabs[i].className = "inactive";
  }
  tab.className = "active";

}

function createTabs(planet, species, vehicles, starships) {
  const tabs = document.querySelector(".tabs")
  erase(tabs);

  let newA0 = document.createElement("a");
  newA0.setAttribute("href", "#");
  newA0.className = "active";
  newA0.append("Planet");
  newA0.addEventListener("click", function () {
    getPlanet(planet)
  })
  newA0.addEventListener("click", function () {
    activateTab(newA0)
  })
  tabs.appendChild(newA0);

  let newA = document.createElement("a");
  newA.setAttribute("href", "#");
  newA.append("Species");
  newA.addEventListener("click", function () {
    getTabData(species)
  })
  newA.addEventListener("click", function () {
    activateTab(newA)
  })

  tabs.appendChild(newA);

  let newA2 = document.createElement("a");
  newA2.setAttribute("href", "#");
  newA2.append("Vehicles");
  newA2.addEventListener("click", function () {
    getTabData(vehicles)
  })
  newA2.addEventListener("click", function () {
    activateTab(newA2)
  })
  tabs.appendChild(newA2);

  let newA3 = document.createElement("a");
  newA3.setAttribute("href", "#");
  newA3.append("Starships");
  newA3.addEventListener("click", function () {
    getTabData(starships)
  })
  newA3.addEventListener("click", function () {
    activateTab(newA3)
  })
  tabs.appendChild(newA3);
}


//visar loading första gången sidan hämtas
let loading = document.querySelector(".loading");
loading.classList.remove("hidden")
//Hämtar från API


async function getData(url) {


  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.status)
  } else {
    let starWarsData = await response.json()

    loading.classList.add("hidden")

    return starWarsData
  }
}

//Kör funktionen som hämtar och skriver ut data

let pageNumber = 1;
const footer = document.querySelector(".page");


let firstPage = getData('http://swapi.dev/api/people/?page=1')
  .then(function (response) {
    printNames(response); //skriver ut namn på 10 karaktärer
    let numberofPages = Math.ceil(response.count / 10); //räknar hur många sidor och rundar uppåt
    footer.append(`${pageNumber} / ${numberofPages}`); //skriver ut sidnummer
  })
  .catch(function (error) {
    alert("det gick inte att ladda sidan, felkod" + error)
  })


//sudda
function erase(element) {
  if (element.hasChildNodes) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

//Skriver ut listorna till höger
function printDetails(properties, values, list){


  for (i = 0; i < properties.length; i++) {

    if (i == 0) {
      newH3 = document.createElement("h3");
      newH3.append(values[i]);
      list.appendChild(newH3);
    } else {
      newLi = document.createElement("li");
      newLi.append(`${properties[i]} : ${values[i]}`)
      list.appendChild(newLi);
    }
  }
}

//Skriver ut info om karaktärerna när man klickar på dem
function printPersonalData(properties, values) {

  let detailsList = document.querySelector(".details");
  erase(detailsList)
  
  let loading = document.querySelector(".loadingTopRight");
  loading.classList.remove('hidden');

  printDetails(properties, values, detailsList)

  loading.classList.add('hidden');
}


//Skriver ut info om hemplanet när man klickar på figurerna
function getPlanet(planet) {

  const planetList = document.querySelector(".planet");
  erase(planetList)
  
  let loading = document.querySelector(".loadingBottomRight");
  loading.classList.remove('hidden');

  getData(planet)

    .then(function (response) {
      let planetProperties = ["Name", "Rotation Period", "Orbital Period", "Diameter", "Climate", "Gravity", "Terrain"];
      let planetValues = [response.name, response.rotation_period, response.orbital_period, response.diameter, response.climate, response.gravity, response.terrain]

      printDetails(planetProperties, planetValues, planetList)
      loading.classList.add('hidden');
    })
}


//Skriver ut namnen på karaktärer och lägger till eventListeners
function printNames(data) {

  const nameList = document.querySelector(".characters");
  erase(nameList)

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
      getPlanet(person.homeworld)
    })

    nameList.appendChild(newA);

  }

}



//Gå bakåt och framåt


let backLink = document.querySelector(".back");
backLink.addEventListener("click", goBack);

let forwardLink = document.querySelector(".forward");
forwardLink.addEventListener("click", goForward);


function goBack() {

  let nameList = document.querySelector(".characters");


  if (pageNumber > 1) {
    erase(nameList)


    let loading = document.querySelector(".loading");
    loading.classList.remove('hidden');
    pageNumber--;
    let url = `http://swapi.dev/api/people/?page=${pageNumber}`;

    getData(url)
      .then(function (response) {

        let numberofPages = Math.ceil(response.count / 10); //räknar hur många sidor och rundar uppåt

        erase(footer);
        footer.append(`${pageNumber} / ${numberofPages}`)

        printNames(response);
        loading.classList.add('hidden');
      })
  }
}



function goForward() {
  let nameList = document.querySelector(".characters");
  erase(nameList);

  let loading = document.querySelector(".loading");
  loading.classList.remove('hidden');

  let url = `http://swapi.dev/api/people/?page=${pageNumber}`;
  getData(url)
    .then(function (response) {

      let numberofPages = Math.ceil(response.count / 10); //räknar hur många sidor och rundar uppåt

      if (response.next != "null") {
        pageNumber++;

        erase(footer);
        footer.append(`${pageNumber} / ${numberofPages}`)

        printNames(response);
        loading.classList.add('hidden');
      }
    })
}



//visar loading första gången sidan hämtas
let loading = document.querySelector(".loading");
loading.classList.remove("hidden")
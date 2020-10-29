//Hämtar från API

async function getData(url) {
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.status)
  } else {
    let peopleData = await response.json()
    let loading = document.querySelector(".loading");
    loading.classList.add("hidden")

    return peopleData
  }
}

//Skriver ut egenskaper när man klickar på figurerna
function printPersonalData(properties, data) {

  let details = document.querySelector(".details");
  if (details.hasChildNodes) {
    while (details.firstChild) {
      details.removeChild(details.firstChild);
    }
  }
  for (i = 0; i < 8; i++) {

    newLi = document.createElement("li");
    newLi.append(`${properties[i]} : ${data[i]}`)
    details.appendChild(newLi);
  }
}

//Hämtar hemplanet

function getPlanet(person) {
  getData(person.homeworld)
    .then(function (response) {

      let planetList = document.querySelector(".planet");
      if (planetList.hasChildNodes) {
        while (planetList.firstChild) {
          planetList.removeChild(planetList.firstChild);
        }
      }

      let planetData = Object.values(response);
      let planetProperties = Object.keys(response);

      for (i = 0; i < 6; i++) {



        newLi = document.createElement("li");
        newLi.append(`${planetProperties[i]} : ${planetData[i]}`)
        planetList.appendChild(newLi);
      }
    })
}

//Skriver ut namnen på figurerna

function printNames(data) {


  let nameList = document.querySelector(".characters");
  
  
  if (nameList.hasChildNodes) {
    while (nameList.firstChild) {
      nameList.removeChild(nameList.firstChild);
    }
  }

  for (i = 0; i < data.results.length; i++) {
    let person = data.results[i]

    let personalData = Object.values(person);
    let personalProperties = Object.keys(person);

    let newLi = document.createElement("li");
    newLi.append(person.name);

    newLi.addEventListener("click", function () {
      printPersonalData(personalProperties, personalData)
    })
    newLi.addEventListener("click", function () {
      getPlanet(person)
    })

    nameList.appendChild(newLi);
    console.log(personalData)
  }

}









//Gå bakåt och framåt

let pageNumber = 1;

let backLink = document.querySelector(".back");
backLink.addEventListener("click", goBack);

let forwardLink = document.querySelector(".forward");
forwardLink.addEventListener("click", goForward);

function goBack() {
  if (pageNumber > 1) {
    pageNumber--;
    let url = `http://swapi.dev/api/people/?page=${pageNumber}`;
    getData(url)
      .then(function (response) {
        printNames(response)
      })
  }
}

const firstNameList = getData('http://swapi.dev/api/people/?page=1')
  .then(function (response) {
    printNames(response)
  })
  .catch(function (error) {
    console.log(error + "det blev fel")
  })

function goForward() {
  // if (pageNumber < 9)
  if (pageNumber < firstNameList.count/10)
  {
    pageNumber++;
    let url = `http://swapi.dev/api/people/?page=${pageNumber}`;
    getData(url)
      .then(function (response) {
        printNames(response)
      })
  }
}



// om jag lägger kod här körs den innan sidan laddas



// Christoffer Korell
// const firstNameList = getData('http://swapi.dev/api/people/?page=1')
// .then((result)=>{console.log(result)})
// .catch((error)=>{alert(error)})
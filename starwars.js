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

  let loading = document.querySelector(".loadingTopRight");
  loading.classList.remove('hidden');

  for (i = 0; i < 8; i++) {

    newLi = document.createElement("li");
    newLi.append(`${properties[i]} : ${data[i]}`)
    details.appendChild(newLi);
  }
  loading.classList.add('hidden');
}

//Hämtar och skriver ut hemplanet

function getPlanet(person) {
  //bryt ut
  let planetList = document.querySelector(".planet");
  if (planetList.hasChildNodes) {
    while (planetList.firstChild) {
      planetList.removeChild(planetList.firstChild);
    }
  }

  let loading = document.querySelector(".loadingBottomRight");
  loading.classList.remove('hidden');


  getData(person.homeworld)

    .then(function (response) {



      let planetData = Object.values(response);
      let planetProperties = Object.keys(response);



      for (i = 0; i < 6; i++) {

        if (i == 0) {
          newH3 = document.createElement("h3");
          newH3.append(planetData[i]);
          planetList.appendChild(newH3);
        } else {

          newLi = document.createElement("li");
          newLi.append(`${planetProperties[i]} : ${planetData[i]}`)
          planetList.appendChild(newLi);
        }
      }
      loading.classList.add('hidden');
    })
}

//Skriver ut namnen på figurerna och lägger till eventListeners

function printNames(data) {


  let nameList = document.querySelector(".characters");

  //sudda
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
    newA = document.createElement("a");
    newA.setAttribute("href", "#");
    newA.append(person.name);
    newLi.appendChild(newA);

    newA.addEventListener("click", function () {
      printPersonalData(personalProperties, personalData)
    })
    newA.addEventListener("click", function () {
      getPlanet(person)
    })

    nameList.appendChild(newLi);

  }

}









//Gå bakåt och framåt
let vafan = getData("http://swapi.dev/api/people/?page=1")
  .then(function (resultat) {
    starwarsgubbar = resultat
    alert(starwarsgubbar.next)
  });

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

getData('http://swapi.dev/api/people/?page=1')
  .then(function (response) {
    printNames(response)
  })
  .catch(function (error) {
    console.log(error + "det blev fel")
  })

function goForward() {

  nextPage = getData(`http://swapi.dev/api/people/?page=${pageNumber}`).then(function (resultat) {
    return (resultat.next)
  });
  //det här verkar onödigt långsamt men jag fattar inte hur jag får ut infon utan att hämta datan igen


  if (nextPage != "null") {
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
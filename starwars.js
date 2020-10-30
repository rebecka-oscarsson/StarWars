//Hämtar från API


async function getData(url) {


  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.status)
  } else {
    let peopleData = await response.json()

    loading.classList.add("hidden")

    return peopleData
  }
}

//Kör funktionen som hämtar och skriver ut data

let firstPage = getData('http://swapi.dev/api/people/?page=1')
  .then(function (response) {
    printNames(response)
  })
  .catch(function (error) {
    console.log(error + "det blev fel")
  })


//sudda
function erase(element) {
  if (element.hasChildNodes) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}




//Skriver ut egenskaper när man klickar på figurerna
function printPersonalData(properties, data) {

  let details = document.querySelector(".details");
  erase(details)


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

  let planetList = document.querySelector(".planet");
  erase(planetList)


  let loading = document.querySelector(".loadingBottomRight");
  loading.classList.remove('hidden');


  getData(person.homeworld)

    .then(function (response) {

      let planetData = Object.values(response);
      let planetProperties = Object.keys(response);


      for (i = 0; i < 6; i++) {//statisk lösning gör om

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

  erase(nameList)


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

let pageNumber = 1;
let footer = document.querySelector(".page");

getData('http://swapi.dev/api/people/?page=1')
.then(function (resultat) {
  numberofPages = Math.ceil(resultat.count / 10);
  footer.append(`${pageNumber} / ${numberofPages}`)//det här borde jag nog göra längst upp när sidan laddas
});


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

        erase(footer);
        let numberofPages = Math.ceil(response.count / 10);
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
        if (response.next != "null") {
          pageNumber++;
          erase(footer);
          Math.ceil(response.count / 10);
          footer.append(`${pageNumber} / ${numberofPages}`)

          printNames(response);
          loading.classList.add('hidden');
        }


      })

    }

      //visar loading första gången sidan hämtas


      let loading = document.querySelector(".loading"); loading.classList.remove("hidden")
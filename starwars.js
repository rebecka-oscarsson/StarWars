//******************************
//        VARIABLER 
//******************************

let next;
let previous;
const planetList = document.querySelector(".detailsListBottom");
let pageNumber = 1;
const firstPage = 'https://swapi.dev/api/people/?page=1'
const footer = document.querySelector(".page");
let numberofPages;
const loadingLeft = document.querySelector(".loadingLeft");
const loadingTopRight = document.querySelector(".loadingTopRight");
const loadingBottomRight = document.querySelector(".loadingBottomRight");

//Gå bakåt och framåt
const backLink = document.querySelector(".back");
backLink.addEventListener("click", goBack);

const forwardLink = document.querySelector(".forward");
forwardLink.addEventListener("click", goForward);

const nameList = document.querySelector(".characters");

//******************************
//        FUNKTIONER 
//******************************

//Hämtar data från API, kör två funktioner med hämtad data som parametrar
async function getData(url, spinnerIcon, callback, callback2) {
  if(url.startsWith("http:")) {url.replace("http:", "https:")};
  spinnerIcon.classList.remove("hidden");
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      let starWarsData = await response.json()
      next = starWarsData.next;
      previous = starWarsData.previous;
      callback(starWarsData);
      if (callback2) {
        callback2(starWarsData)
      };
      //gör så att callback2 är optional
      spinnerIcon.classList.add("hidden");
      return starWarsData
    }
  } catch (e) {
    console.log(e);//ändra så att det skrivs i lämplig ruta
  }
  spinnerIcon.classList.add("hidden")
}

//kör funktion första gången sidan laddas
getData(firstPage, loadingLeft, printNames, printPageNumber)

function printPageNumber(data) {
  numberofPages = Math.ceil(data.count / data.results.length); //räknar hur många sidor och rundar uppåt
  footer.append(`${pageNumber} / ${numberofPages}`); //skriver ut sidnummer
}

//Skriver ut namnen på karaktärer i länkar och lägger till eventListeners
//det borde gått att anvnda printList och sedan göra en till funktion som gör ev list
function printNames(data) {

  const nameList = document.querySelector(".characters");
  erase(nameList);

  for (i = 0; i < data.results.length; i++) {
    let person = data.results[i]
    let personalProperties = ["Name", "Height", "Mass", "Hair color", "Skin color", "Eye color", "Birth year", "Gender"]
    let personalData = [person.name, person.height, person.mass, person.hair_color, person.skin_color, person.eye_color, person.birth_year, person.gender]

    const newA = document.createElement("a");
    newA.setAttribute("href", "javascript:void(0)");
    newA.append(person.name);
    newA.addEventListener("click", function () {
      erase(document.querySelector(".detailsListTop"))
    })
    newA.addEventListener("click", function () {
      erase(document.querySelector(".detailsListBottom"))
    })
    newA.addEventListener("click", function () {
      printList(personalProperties, personalData, document.querySelector(".detailsListTop"))
    })
    newA.addEventListener("click", function () {
      getData(person.homeworld, loadingTopRight, printTabData)
    })
    newA.addEventListener("click", function () {
      createTabs(person.homeworld, person.species, person.vehicles, person.starships)
    })
    nameList.appendChild(newA);

  }
}

//går ett steg tillbaka. 
function goBack() {
  if (pageNumber > 1) {
    erase(nameList);
    pageNumber--;
    let url = `https://swapi.dev/api/people/?page=${pageNumber}`;
    getData(url, loadingLeft, printNames)
    erase(footer);
    footer.append(`${pageNumber} / ${numberofPages}`)
  }
}

//hämtar nästa sida och anropar printNext. Borde fixa så att hämtade sidor sparas i localStorage
function goForward() {
  if (pageNumber < numberofPages) {
    erase(nameList);
    pageNumber++;
    let url = `https://swapi.dev/api/people/?page=${pageNumber}`;
    getData(url, loadingLeft, printNext)
  }
}

//skriver ut nästa sida
function printNext(response) {
  if (response.next != "null") {
    erase(footer);
    footer.append(`${pageNumber} / ${numberofPages}`)
    printNames(response);
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

//Skriver ut listorna till höger.
function printList(properties, values, list) {
  for (i in values) {
    if (i == 0) {
      let newH3 = document.createElement("h3");
      newH3.append(values[i]);
      list.appendChild(newH3);
    } else if (values[i] != null && !Array.isArray(values[i]) && !values[i].includes("http"))
    {
      let newLi = document.createElement("li");
      newLi.append(`${properties[i]} : ${values[i]}`)
      list.appendChild(newLi);
    }
  }
  let br = document.createElement("br");
  list.appendChild(br);
}

//hämtar och skriver ut infon för flikarna
function renderTabData(tabData) {

  const planetList = document.querySelector(".detailsListBottom");
  erase(planetList);

  if (tabData.length == 0) {
    const newH3 = document.createElement("h3");
    newH3.append("No data available");
    planetList.appendChild(newH3);
  }  
    else if (Array.isArray(tabData))
    {for (dataset in tabData) {
      getData(tabData[dataset], loadingBottomRight, printTabData)
    }}
    else {getData(tabData, loadingBottomRight, printTabData)}
}

//skriver ut listorna för flikarna.
function printTabData(response) {
  printList(Object.keys(response), Object.values(response), planetList)
}

//gör att aktiv flik har annan färg
function activateTab(tab) {
  var allTabs = document.querySelectorAll(".tabs>a");
  for (var i = 0; i < allTabs.length; i++) {
    allTabs[i].className = "inactive";
  }
  tab.className = "active";
}

//skapar flikar och lägger på eventlisteners
function createTabs(planet, species, vehicles, starships) {
  const tabs = document.querySelector(".tabs")
  erase(tabs);

  const dataSets = [planet, species, vehicles, starships]
  const tabNames = ["planet", "species", "vehicles", "starships"];

  tabNames.forEach((item, index) => {
    let newA = document.createElement("a");
    newA.setAttribute("href", "#");
    newA.append(item);
    newA.addEventListener("click", function () {
      renderTabData(dataSets[index])
    })
    newA.addEventListener("click", function () {
      activateTab(newA)
    })
    tabs.appendChild(newA);
    if (index == 0) {
      newA.className = "active"
    };
  })
}
//******************************
//        VARIABLER 
//******************************

let next;
let previous;
const planetList = document.querySelector(".detailsListBottom");
let pageNumber = 1;
const firstPage = 'http://swapi.dev/api/people/?page=1'
const footer = document.querySelector(".page");
let numberofPages;
const loadingLeft = document.querySelector(".loadingLeft");
const loadingTopRight = document.querySelector(".loadingTopRight");
const loadingBottomRight = document.querySelector(".loadingBottomRight");

//******************************
//        FUNKTIONER 
//******************************

//Hämtar data från API, kör två funktioner med hämtad data som parametrar
async function getData(url, spinnerIcon, callback, callback2) {
  spinnerIcon.classList.remove("hidden");
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
    //gör så att callback2 är optional
    spinnerIcon.classList.add("hidden");
    return starWarsData
  }
}
//var ska jag ha catch? Hittar inte syntax
//varför blir det 404 om jag ska hämta mer än ett dataset? (flera fordon etc)

test = getData(firstPage, loadingLeft, printNames, printPageNumber)
//här borde det räcka att jag sparar ner data i variabler till flikarna till höger - jag borde inte behöva hämta den igen
console.log(test);

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


//Gå bakåt och framåt
const backLink = document.querySelector(".back");
backLink.addEventListener("click", goBack);

const forwardLink = document.querySelector(".forward");
forwardLink.addEventListener("click", goForward);

const nameList = document.querySelector(".characters");



function goBack() {
  if (pageNumber > 1) {
    erase(nameList);
    pageNumber--;
    let url = `http://swapi.dev/api/people/?page=${pageNumber}`;
    getData(url, loadingLeft, printNames)
    erase(footer);
    footer.append(`${pageNumber} / ${numberofPages}`)
  }
}

function goForward() {
  if (pageNumber < numberofPages) {
    erase(nameList);
    pageNumber++;
    let url = `http://swapi.dev/api/people/?page=${pageNumber}`;
    getData(url, loadingLeft, printNext)
  }
}

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

//Skriver ut listorna till höger. varför bara den första om fler? ex starships på obi wan
function printList(properties, values, list) {
  erase(list);
  for (i = 0; i < properties.length; i++) {
    console.log("värde: ",i, values[i])
    if (i == 0) {
      let newH3 = document.createElement("h3");
      newH3.append(values[i]);
      list.appendChild(newH3);
    } else 
    // if (values[i].length>3 && !values[i].startsWith("http")
    // && !values[i].isArray) 
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
  } else {
    // tabData.forEach((item, index) => 
    getData(tabData, loadingBottomRight, printTabData)
    // );
    //här måste jag hämta en gång till eftersom datan ligger på en adress en nivå under den första datan
  }
}


//skriver ut listorna för flikarna. funkar ej om flera objekt! gör om
function printTabData(response) {
  console.log("tabdata", response, "length", response.length)
  
      //jag kan returnera de här i getDatafunktionen och använda direkt? blir nog ej kortare
      //nu behöver jag loopa objektetn
      
       
      printList(Object.keys(response), Object.values(response), planetList)
       
      // for (object in response){printList(Object.keys(response[object]), Object.values(response[object]), planetList)}
  
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
async function getPeople() {
  //här stoppar jag in snurren

  let response = await fetch('https://swapi.dev/api/people/');
  if (!response.ok) {
    throw new Error(response.status)
  } else {
    let peopleData = await response.json()
    //här tar jag bort snurren
    printNames(peopleData);
    console.log(peopleData)
    // alert(peopleData.results[2].name)
    // return peopleData

  }
}

function printNames(data) {
  let name;

  let nameList = document.querySelector(".characters");



  for (i = 0; i < data.results.length; i++) {
    name = data.results[i].name;
    newLi = document.createElement("li");
    newLi.append(name)
    nameList.appendChild(newLi);

  }
}

let backLink = document.querySelector(".back");
backLink.addEventListener("click", goBack);

function goBack() {
  alert("test")
}


// function getPeople(){
//   return fetch('https://swapi.dev/api/people/')
//   .then(response=>{
//     if(!response.ok){}
//   })
// }

// getPeople().catch(e=>)


const p = getPeople().catch(console)
//här kör jag en funktion på det promise som returnerats av föregående asyncfunktion
// om jag lägger kod här körs den innan sidan laddas
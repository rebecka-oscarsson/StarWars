async function getPeople() {
//här stoppar jag in snurren
  let response = await fetch('https://swapi.dev/api/people/');
  if (!response.ok) {
    throw new Error(response.status)
  } else {
    let peopleData = await response.json()
    //här tar jag bort snurren
    console.log(peopleData) 
    alert (peopleData.results[2].name)
    return peopleData;
   
  }
}

function printNames(peopleData) {
  for (i = 0; i < peopleData.length; i++) {

  }}


// function getPeople(){
//   return fetch('https://swapi.dev/api/people/')
//   .then(response=>{
//     if(!response.ok){}
//   })
// }

// getPeople().catch(e=>)


const p=getPeople().catch(console)
//här kör jag en funktion på det promise som returnerats av föregående asyncfunktion
// console.log("det här ska stå när sidan laddar");
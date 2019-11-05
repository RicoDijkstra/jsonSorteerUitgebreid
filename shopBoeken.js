
// JSON importeren
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function(){
  if(this.readyState==4 && this.status == 200){
    sorteerBoekObj.data = JSON.parse(this.responseText);
    // sorteerBoekObj.voegJSdatumIn();
    sorteerBoekObj.sorteren();
  }
}
xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();

// een tabelkop in markup uitvoeren uit een array
const maakTabelKop = (arr) => {
  let kop = "<table class='bookSelectie'><tr>";
  arr.forEach((item) => {
    kop += "<th>" + item + "</th>";
  });
  kop += "</tr>";
  return kop;
}

//fucntie die van een maand-string een nummer maakt
// waarbij januari een 0 geeft
// en december een 11
const geefMaandNummer = (maand) => {
  let nummer;
  switch (maandJaar) {
    case "januari":   nummer = 0; break;
    case "februari":  nummer = 1; break;
    case "maart":     nummer = 2; break;
    case "april":     nummer = 3; break;
    case "mei":       nummer = 4; break;
    case "juni":      nummer = 5; break;
    case "juli":      nummer = 6; break;
    case "augustus":  nummer = 7; break;
    case "september": nummer = 8; break;
    case "oktober":   nummer = 9; break;
    case "november":  nummer = 10; break;
    case "december":  nummer = 11; break;
    default:          nummer = 0

  }
  return nummer;
}

//fucntie die een strnig van maand jaar omzet in een date-object
const maakJSdatum = (maandJaar) => {
  let mjArray = maandJaar.split(" ");
  let datum = new Date(mjArray[1], geefMaandNummer(mjArray[0]));
  return datum;
}

// functie maakt van eeen array een opsmming met , en ''
const maakOpsomming = (array) => {
  let string = "";
  for(let i=0; i<array.length; i++){
    switch (i) {
      case array.length-1 : string += array[i]; break;
      case array.length-1 : string += array[i] + " en "; break;
      default: string += array[i] + " , ";

    }
  }
  return string;
}

// object dat de boeken uitvoert en sorteert
// eigenschappen : data sorteerkenmerk
// methods: sorteren() en uitvoeren( )

let sorteerBoekObj = {
  data: "",   // komt van de xmlhttp.onreadystatechange

  kenmerk: "titel",

  //sorteer volgorde ne factor
  oplopend: 1,

  //een datumObject toevoegen aan this.data uit de string uitgave
  voegJSdatumIn: function(){


  this.data.forEach((item) =>{
    item.jsDatum = maakJSdatum(item.uitgave);
  });
},
  // data sorteren
  sorteren: function(){
      this.data.sort( (a,b) => a[this.kenmerk] > b[this.kenmerk] ? 1*this.oplopend : -1*this.oplopend );
      this.uitvoeren(this.data);
  },

  //de data in een tabel uitvoeren
  uitvoeren: function(data){
    data.forEach( boek => {
      let sectie = document.createElement('section');
      sectie.className = 'boek';

      // cover maken(afbeelding)
      let afbeelding = document.createElement('img');
      afbeelding.className = 'boekSelectie__cover';
      afbeelding.setAttribute('src', boek.cover);
      afbeelding.setAttribute('alt', boek.title);

      // titel maken
      let titel = document.createElement('h3');
      titel.className = 'boek__titel';
      titel.textContent = boek.titel;

      //de element toevoegen
      sectie.appendChild(afbeelding);
      sectie.appendChilt(titel);
      document.getElementById('uitvoer').appendChild(sectie);
    });
  }
}
// keuze voor sorteer opties
document.getElementById('kenmerk').addEventListener('change', (e) => {
  sorteerBoekObj.kenmerk = e.target.value;
  sorteerBoekObj.sorteren();
});

document.getElementsByName('oplopend').forEach((item) =>{
    item.addEventListener('click', (e)=>{
      sorteerBoekObj.oplopend = parseInt(e.target.value);
      sorteerBoekObj.sorteren();
    })
})

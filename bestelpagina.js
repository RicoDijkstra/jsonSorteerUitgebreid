// JSON importeren
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    sorteerBoekObj.data = JSON.parse(this.responseText);
    // sorteerBoekObj.voegJSdatumIn();

    sorteerBoekObj.data.forEach(boek => {
      boek.titelUpper = boek.titel.toUpperCase();
    });

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
    case "januari":
      nummer = 0;
      break;
    case "februari":
      nummer = 1;
      break;
    case "maart":
      nummer = 2;
      break;
    case "april":
      nummer = 3;
      break;
    case "mei":
      nummer = 4;
      break;
    case "juni":
      nummer = 5;
      break;
    case "juli":
      nummer = 6;
      break;
    case "augustus":
      nummer = 7;
      break;
    case "september":
      nummer = 8;
      break;
    case "oktober":
      nummer = 9;
      break;
    case "november":
      nummer = 10;
      break;
    case "december":
      nummer = 11;
      break;
    default:
      nummer = 0

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
  for (let i = 0; i < array.length; i++) {
    switch (i) {
      case array.length - 1:
        string += array[i];
        break;
      case array.length - 1:
        string += array[i] + " en ";
        break;
      default:
        string += array[i] + " , ";

    }
  }
  return string;
}

// maak een functie die de tekst achter de komma vooraan plaatst
const keerTekstOm = (string) => {
  if (string.indexOf(',') != -1) {
    let array = string.split(',');
    string = array[1] + ' ' + array[0];
  }
  return string;
}
// object dat de boeken uitvoert en sorteert
// eigenschappen : data sorteerkenmerk
// methods: sorteren() en uitvoeren( )

// een winkelwagenobject

let winkelwagen = {
  items: [],

  haalItemsOp: function() {
    let bestelling;
    if (localStorage.getItem('besteldeBoeken') == null) {
      bestelling = [];
    } else {
      bestelling = JSON.parse(localStorage.getItem('besteldeBoeken'));
      this.uitvoeren;
    }
    return bestelling;
  },
  toevoegen: function(el) {
    this.items = this.haalItemsOp();
    this.items.push(el);
    localStorage.setItem('besteldeBoeken', JSON.stringify(this.items));
    this.uitvoeren();

  },
  uitvoeren: function(){
    if (this.items.length > 0) {
      document.querySelector('.winkelwagen_aantal').innerHTML = this.items.length;
    }else{
      document.querySelector('.winkelwagen_aantal').innerHTML = '';
    }
  },
  totaalPrijsBerekenen: function(){
    let totaal = 0;
    this.items.forEach( boek=>{
      totaal += boek.prijs;
    });
    return totaal;
  }







}
winkelwagen.haalItemsOp();

let sorteerBoekObj = {
  data: "", // komt van de xmlhttp.onreadystatechange

  kenmerk: "titelUpper",

  //sorteer volgorde ne factor
  oplopend: 1,

  //een datumObject toevoegen aan this.data uit de string uitgave
  voegJSdatumIn: function() {


    this.data.forEach((item) => {
      item.jsDatum = maakJSdatum(item.uitgave);
    });
  },
  // data sorteren
  sorteren: function() {
    this.data.sort((a, b) => a[this.kenmerk] > b[this.kenmerk] ? 1 * this.oplopend : -1 * this.oplopend);
    this.uitvoeren(this.data);
  },

    totaalPrijsBerekenen: function(){
      let totaal = 0;
      this.items.forEach( boek => {
        totaal += boek.prijs;
      });
      return totaal;
    },

  //de data in een tabel uitvoeren
  uitvoeren: function(data) {
    // eerst de uitvoer leegmaken
    document.getElementById('uitvoer').innerHTML = "";
    data.forEach(boek => {
      let sectie = document.createElement('section');
      sectie.className = 'boekSelectie';
      // main element met alle info behalve de prijs en afbeelding
      let main = document.createElement('main');
      main.className = 'boekSelectie__main';

      // cover maken(afbeelding)
      let afbeelding = document.createElement('img');
      afbeelding.className = 'boekSelectie__cover';
      afbeelding.setAttribute('src', boek.cover);
      afbeelding.setAttribute('alt', keerTekstOm(boek.titel));

      // titel maken
      let titel = document.createElement('h3');
      titel.className = 'boekSelectie__titel';
      titel.textContent = keerTekstOm(boek.titel);

      // prijs toevoegen
      let prijs = document.createElement('div');
      prijs.className = 'boekSelectie__prijs';
      prijs.textContent = '€ ' + boek.prijs;
      // knop toevoegen bij de boekSelectie__prijs
      let knop = document.createElement('button');
      knop.className = 'boekSelectie__knop';
      knop.innerHTML = 'voeg toe aan<br>winkelwagen';
      knop.addEventListener('click', () => {
        winkelwagen.toevoegen(boek);
      });


      //de element toevoegen
      sectie.appendChild(afbeelding);
      main.appendChild(titel);
      sectie.appendChild(main);
      sectie.appendChild(prijs);
      prijs.appendChild(knop);
      document.getElementById('uitvoer').appendChild(sectie);
    });
    let totaalTekst = document.createElement('div');
    totaalTekst.className = 'besteldeBoeken__totaal-prijs';
    totaalTekst.innerHTML = 'Totaal: ';

    let totaalPrijs = document.createElement('div');
    totaalPrijs.textContent = this.totaalPrijsBerekenen().toLocalString('nl-NL', {currency: 'EUR', style: 'currency'});

    sectie.appendChild(totaalTekst);
    sectie.appendChild(totaalPrijs);
    document.getElementById('bestelling').appendChild(sectie);

    let sectie = document.createElement('section');
    sectie.className = 'boekSelectie';

  }
}

// winkelwagen.haalItemsOp();
// winkelwagen.utvoeren();

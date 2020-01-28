


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
      document.querySelector('.winkelwagen_aantal').innerHTML = bestelling.length;
    }
    bestelling.forEach( item =>{
      this.items.push(item);
    })
    return bestelling;
  },
// doorloop alle items en als de ean van het item overeenstemt, dit uit de items verwijderen
  verwijderItem: function(ean){
    console.log(ean);
    this.items.forEach((item,index) =>{
      if ( item.ean == ean ) {
        console.log('het boek inde ww '+index)
        this.items.splice(index,1);
        ean = 1;
      }
    });
    // local storage bijwerken
    localStorage.setItem('besteldeBoeken', JSON.stringify(this.items));

    // this.haalItemsOp();
    this.uitvoeren();
  },

  uitvoeren: function() {
      // eerst de uitvoer leegmaken
      document.getElementById('uitvoer').innerHTML = "";

      this.items.forEach(boek => {
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

        let verwijder = document.createElement('div');
        verwijder.className = 'besteldBoek__verwijder';
        verwijder.addEventListener('click', () => {
          this.verwijderItem(boek.ean);
        });

        //de element toevoegen
        sectie.appendChild(afbeelding);
        main.appendChild(titel);
        sectie.appendChild(main);
        sectie.appendChild(prijs);
        sectie.appendChild(verwijder);
        document.getElementById('uitvoer').appendChild(sectie);
      });
      if(this.items.length>0){
          document.querySelector('.winkelwagen_aantal').innerHTML = this.items.length;
      }else{
          document.querySelector('.winkelwagen_aantal').innerHTML = "";
      }
      console.log(this.items);

  }
}


 winkelwagen.haalItemsOp();
 winkelwagen.uitvoeren();

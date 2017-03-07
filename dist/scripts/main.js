var ctx = document.getElementById("topicChart");

var rawData = [];

/*
 * Load JSON by using an AJAX call
 *
 */
function loadData() {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
      if (xmlhttp.status == 200) {
        // console.log(xmlhttp.responseText);
        rawData = JSON.parse(xmlhttp.responseText);
        // console.log(rawData);
        grabAllPublishers();
        grabAllAuthors();
        redrawGraph();
      }
      else {
          console.log('Andere error dan 200. Geen file gevonden?');
      	}
      }
    };

  xmlhttp.open("GET", "data/corpusmeta.json", true);
  xmlhttp.send();
}

loadData();

/* 
 * Grab all unique publishers
 */

var allPublishers = [];
var activePublishers = [''];

function uniq(a) {
  var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

  return a.filter(function(item) {
    var type = typeof item;
    if(type in prims) {
      return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
    }
    else {
      return objs.indexOf(item) >= 0 ? false : objs.push(item);
    }
  });
}

function grabAllPublishers() {
	for ( i=0; i<rawData.length; i++ ) {
		allPublishers.push(rawData[i].printer);
	}	

	var publisherContainer = document.getElementsByClassName('publisher-container')[0];

  allPublishersUniq = uniq(allPublishers);
  allPublishersUniq.sort().reverse();

	for ( i=0; i<allPublishersUniq.length; i++) {
		publisherContainer.insertAdjacentHTML('afterbegin', '<input class="inputboxes" type="checkbox" onchange="toggleCheckbox(this)" name="inputpublisher" value="' + allPublishersUniq[i] + '" checked><span class="inputbox-text">' + allPublishersUniq[i] + '</span></input><br/>');
	}
	activePublishers = allPublishersUniq;
}

function toggleCheckbox(element) {
 	if (element.checked === false) {
 		for (var i = 0; i < activePublishers.length; i++) {
 			if (element.value == activePublishers[i]) {
 				activePublishers.splice(i, 1);
 			}
 		}
 	} else if (element.checked === true ) {
 		activePublishers.push(element.value);
 }
 redrawGraph();
}

function deselectAllCheckboxes(){
	checkboxes = document.getElementsByClassName('inputboxes');

	for (var i=0; i<checkboxes.length; i++)  {
	  checkboxes[i].checked = false;
	}
	activePublishers = [];
	redrawGraph();
}

document.getElementsByClassName("deselect-button")[0].addEventListener("click", deselectAllCheckboxes);


var allAuthors = [];
var activeAuthors = [''];

function grabAllAuthors() {
	for ( i=0; i<rawData.length; i++ ) {
		allAuthors.push(rawData[i].author);
	}	
	var authorContainer = document.getElementsByClassName('author-container')[0];

  allAuthorsUniq = uniq(allAuthors);
  allAuthorsUniq.sort().reverse();

	for ( i=0; i<allAuthorsUniq.length; i++) {
		authorContainer.insertAdjacentHTML('afterbegin', '<input class="inputboxes-authors" type="checkbox" onchange="toggleCheckboxAuthors(this)" name="inputpublisher" value="' + allAuthorsUniq[i] + '" checked><span class="inputbox-text">' + allAuthorsUniq[i] + '</span></input><br/>');
	}
	activeAuthors = allAuthorsUniq;
}

function toggleCheckboxAuthors(element) {
 if (element.checked === false) {
 	for (var i = 0; i < activeAuthors.length; i++) {
 		if (element.value == activeAuthors[i]) {
 			activeAuthors.splice(i, 1);
 		}
 	}
 } else if (element.checked === true ) {
 	activeAuthors.push(element.value);
 }
 redrawGraph();
 }

function deselectAuthorCheckboxes(){
	checkboxes = document.getElementsByClassName('inputboxes-authors');

	for (var i=0; i<checkboxes.length; i++)  {
	  checkboxes[i].checked = false;
	}
	activeAuthors = [];
	redrawGraph();
}

document.getElementsByClassName("deselect-author-button")[0].addEventListener("click", deselectAuthorCheckboxes);


/* Concepten */
var thisConcept = 'default';

function conceptChanger() {
	var element = document.getElementById("concept-picker");
	var currentConcept = element.options[element.selectedIndex].value;

	thisConcept = currentConcept;
	redrawGraph();
}

/* Hertekening van de grafiek */
function redrawGraph() {
	var firstYear = document.getElementById("firstyear");
	var secondYear = document.getElementById("secondyear");

	recalculateData(firstYear.value, secondYear.value);
}

/* Hertelling van de grafiek op basis van de interval tussen twee jaartallen */
function recalculateData(firstyear, secondyear) {
	rawestData.length = 0;
	for ( i=0; i<rawData.length; i++ ) {

		if(rawData[i].year > firstyear && rawData[i].year < secondyear) {
			var dataObj = {};
			var increase = 14;

			if (thisConcept == 'default') {
				dataObj.x = rawData[i].def_sim;
				dataObj.y = rawData[i].def_freq;
				dataObj.r = (rawData[i].def_overlap*increase);
			} else if (thisConcept == 'natuur') {
				dataObj.y = rawData[i].freq_array[0];
				dataObj.x = rawData[i].sim_array[0];
				dataObj.r = (rawData[i].overlap_array[0]*increase);
			} else if (thisConcept == 'god') {
				dataObj.y = rawData[i].freq_array[1];
				dataObj.x = rawData[i].sim_array[1];
				dataObj.r = (rawData[i].overlap_array[1]*increase);
			} else if (thisConcept == 'oorzaak') {
				dataObj.y = rawData[i].freq_array[2];
				dataObj.x = rawData[i].sim_array[2];
				dataObj.r = (rawData[i].overlap_array[2]*increase);
			} else if (thisConcept == 'wet') {
				dataObj.y = rawData[i].freq_array[3];
				dataObj.x = rawData[i].sim_array[3];
				dataObj.r = (rawData[i].overlap_array[3]*increase);
			} else if (thisConcept == 'kennis') {
				dataObj.y = rawData[i].freq_array[4];
				dataObj.x = rawData[i].sim_array[4];
				dataObj.r = (rawData[i].overlap_array[4]*increase);
			} else if (thisConcept == 'verstand') {
				dataObj.y = rawData[i].freq_array[5];
				dataObj.x = rawData[i].sim_array[5];
				dataObj.r = (rawData[i].overlap_array[5]*increase);
			} else if (thisConcept == 'reden') {
				dataObj.y = rawData[i].freq_array[6];
				dataObj.x = rawData[i].sim_array[6];
				dataObj.r = (rawData[i].overlap_array[6]*increase);
			} else if (thisConcept == 'macht') {
				dataObj.x = rawData[i].freq_array[7];
				dataObj.y = rawData[i].sim_array[7];
				dataObj.r = (rawData[i].overlap_array[7]*increase);
			} else if (thisConcept == 'recht') {
				dataObj.x = rawData[i].freq_array[8];
				dataObj.y = rawData[i].sim_array[8];
				dataObj.r = (rawData[i].overlap_array[8]*increase);
			} else if (thisConcept == 'wil') {
				dataObj.y = rawData[i].freq_array[9];
				dataObj.x = rawData[i].sim_array[9];
				dataObj.r = (rawData[i].overlap_array[9]*increase);
			} else if (thisConcept == 'schrift') {
				dataObj.y = rawData[i].freq_array[10];
				dataObj.x = rawData[i].sim_array[10];
				dataObj.r = (rawData[i].overlap_array[10]*increase);
			} else if (thisConcept == 'ziel') {
				dataObj.y = rawData[i].freq_array[11];
				dataObj.x = rawData[i].sim_array[11];
				dataObj.r = (rawData[i].overlap_array[11]*increase);
			} else if (thisConcept == 'lichaam') {
				dataObj.y = rawData[i].freq_array[12];
				dataObj.x = rawData[i].sim_array[12];
				dataObj.r = (rawData[i].overlap_array[12]*increase);
			} else if (thisConcept == 'mozes') {
				dataObj.y = rawData[i].freq_array[13];
				dataObj.x = rawData[i].sim_array[13];
				dataObj.r = (rawData[i].overlap_array[13]*increase);
			}

        dataObj.title = rawData[i].title;
        dataObj.year = rawData[i].year;
        dataObj.metaX = rawData[i].ppn;
        dataObj.category = rawData[i].corpus;

   		for (var n = 0; n < activePublishers.length; n++) {
   			if (rawData[i].printer === activePublishers[n]) {
   				for (var l = 0; l < activeAuthors.length; l++) {
   					if (rawData[i].author === activeAuthors[l]) {
   					rawestData.push(dataObj);
   					}
   				}
   			}
			}
	}
	// seperateData();
	spinozaChart.update();
}
}

var rawestData = [
  {
    x: 64,
    y: 51,
    r: 8,
    metaX: ''
  }
];

/* seperates the two datasets */
// var sepData2 = [];
// var sepData3 = [];

// function seperateData(){
// 	for (var n = 0; n < rawestData.length; n++){
// 		if (rawestData[n].category === 2){
// 			sepData2.push(rawestData[n])
// 		} else if (rawestData[n].category === 3) {
// 			sepData3.push(rawestData[n])
// 		}

// 	}

// 	spinozaChart.update();

// }

// var allBgColors = [];

var data = {
  datasets: [
    {
      label: 'Corpus 2',
      data: rawestData,
      backgroundColor: "rgba(189,156,105,0.7)",
      // backgroundColor: allBgColors,
      hoverBackgroundColor: "#d9ba8b",
    }]
};

var spinozaChart = new Chart(ctx,{
    type: 'bubble',
		data: data,
    options: {
    onClick: function(evt){
    	pointClickHandler(evt)
    },
 		tooltips: {
		  enabled: true,
		  mode: 'single',
		  callbacks: {
		    label: function(tooltipItems, data) { 
		      return data.datasets[0].data[tooltipItems.index].title.substring(0,30) + "... (" + data.datasets[0].data[tooltipItems.index].year + ")";
		      }
		    }
			},
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
            }
          }]
        }
	    }
});

recalculateData(1600, 1700);

document.getElementsByClassName('filter-metadata-close')[0].addEventListener("click", displayNone);

function displayNone(){
	var modalWindow = document.getElementsByClassName('filter-metadata')[0];
	modalWindow.style.display = 'none';
}

function pointClickHandler(evt){
	var activePoints = spinozaChart.getElementAtEvent(evt);
	var currentPPN = rawestData[activePoints[0]._index].metaX;
// comment
	console.log(currentPPN);

  /* Zet CSS property van het modal window naar block */
	var modalWindow = document.getElementsByClassName('filter-metadata')[0];
	modalWindow.style.display = 'block';

	for ( i=0; i<rawData.length; i++ ) {
		if(currentPPN == rawData[i].ppn) {
			var metadataObj = {};
			metadataObj.auteur = rawData[i].author;
			metadataObj.titel = rawData[i].title;
			metadataObj.jaar = rawData[i].year;
			// metadataObj.drukker = rawData[i].printer;
			// metadataObj.plaats = rawData[i].place;
			metadataObj.url = rawData[i].stcn;
			metadataObj.contextwoorden = rawData[i].context_natuur;


			document.getElementsByClassName('fml-author')[0].innerHTML = metadataObj.auteur;
			document.getElementsByClassName('fml-title')[0].innerHTML = metadataObj.titel + " <a class=\'fml-url\' target=\'_blank\' href=\'" + rawData[i].stcn + "\'>(stcn)</a>";
			document.getElementsByClassName('fml-jaar')[0].innerHTML = metadataObj.jaar;
			document.getElementsByClassName('fml-drukker')[0].innerHTML = rawData[i].printer;
			document.getElementsByClassName('fml-plaats')[0].innerHTML = rawData[i].place;


			if (thisConcept == 'default') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].def_sim;
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].def_freq;
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].def_overlap);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = '-';
			} else if (thisConcept == 'natuur') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[0];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[0];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[0]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_natuur;
			} else if (thisConcept == 'god') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[1];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[1];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[1]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_god;
			} else if (thisConcept == 'oorzaak') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[2];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[2];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[2]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_oorzaak;
			} else if (thisConcept == 'wet') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[3];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[3];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[3]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_wet;
			} else if (thisConcept == 'kennis') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[4];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[4];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[4]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_kennis;
			} else if (thisConcept == 'verstand') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[5];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[5];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[5]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_verstand;
			} else if (thisConcept == 'reden') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[6];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[6];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[6]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_reden;
			} else if (thisConcept == 'macht') {
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].freq_array[7];
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].sim_array[7];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[7]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_macht;
			} else if (thisConcept == 'recht') {
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].freq_array[8];
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].sim_array[8];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[8]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_recht;
			} else if (thisConcept == 'wil') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[9];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[9];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[9]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_wil;
			} else if (thisConcept == 'schrift') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[10];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[10];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[10]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_schrift;
			} else if (thisConcept == 'ziel') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[11];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[11];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[11]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_ziel;
			} else if (thisConcept == 'lichaam') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[12];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[12];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[12]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_lichaam;
			} else if (thisConcept == 'mozes') {
				document.getElementsByClassName('fml-frequentie')[0].innerHTML = rawData[i].freq_array[13];
				document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = rawData[i].sim_array[13];
				document.getElementsByClassName('fml-overlap')[0].innerHTML = (rawData[i].overlap_array[13]);
				document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = rawData[i].context_mozes;
			}




		}
	}
}

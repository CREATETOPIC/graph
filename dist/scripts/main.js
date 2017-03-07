var ctx = document.getElementById("topicChart");

var rawData = [];

function loadData() {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
      if (xmlhttp.status == 200) {
        // console.log(xmlhttp.responseText);
        rawData = JSON.parse(xmlhttp.responseText);
        // console.log(rawData);
        grabAllPublishers();
        redrawGraph();
      }
        else {
          alert('something else other than 200 was returned');
        }
      }
    };

  xmlhttp.open("GET", "data/corpusmeta.json", true);
  xmlhttp.send();
}

loadData();

var allPublishers = [];
var activePublishers = ['bla'];

function uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

function grabAllPublishers() {
	for ( i=0; i<rawData.length; i++ ) {
		allPublishers.push(rawData[i].printer);
	}	
	var publisherContainer = document.getElementsByClassName('publisher-container')[0];

  allPublishersUniq = uniq(allPublishers);
  console.log(allPublishersUniq.length);
	for ( i=0; i<allPublishersUniq.length; i++) {
		publisherContainer.insertAdjacentHTML('afterbegin', '<input class="inputboxes" type="checkbox" onchange="toggleCheckbox(this)" name="inputpublisher" value="' + allPublishersUniq[i] + '" checked><span class="inputbox-text">' + allPublishersUniq[i] + '</span></input><br/>');

	}
	activePublishers = allPublishersUniq;
}

var filterOn = false;
function toggleCheckbox(element) {
   // element.checked = !element.checked;
   console.log(element.value);
   console.log(element.checked);
   if (element.checked === false) {
   	for (var i = 0; i < activePublishers.length; i++) {
   		if (element.value == activePublishers[i]) {
   			console.log('bingo');
   			activePublishers.splice(i, 1);
   		}
   	}
   } else if (element.checked === true ) {
   	activePublishers.push(element.value);
   }
   // console.log(activePublishers);
   filterOn = true;
   redrawGraph();
 }

function deselectAllCheckboxes(){
	checkboxes = document.getElementsByClassName('inputboxes');

	for (var i=0; i<checkboxes.length; i++)  {
	  checkboxes[i].checked = false;
	  // console.log(checkboxes[i].checked);
	}
	   // console.log(checkboxes);

}

deselectAllCheckboxes();


var thisConcept = 'default';

function conceptChanger() {
	var element = document.getElementById("concept-picker");
	var currentConcept = element.options[element.selectedIndex].value;
	thisConcept = currentConcept;
	// console.log(currentConcept);
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
			var increase = 12;

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
			// dataObj.author = rawData[i].author;
			// dataObj.publisher = rawData[i].printer;

   		for (var n = 0; n < activePublishers.length; n++) {
   			if (rawData[i].drukker === activePublishers[n]) {
   				rawestData.push(dataObj);
   			}
			}
	}
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

var data = {
  datasets: [
    {
      label: '',
      data: rawestData,
      backgroundColor: "rgba(189,156,105,0.7)",
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
			metadataObj.drukker = rawData[i].printer;
			metadataObj.plaats = rawData[i].place;
			metadataObj.url = rawData[i].stcn;
			metadataObj.contextwoorden = rawData[i].context_natuur;
			metadataObj.frequentie_1 = rawData[i].def_freq;
			metadataObj.overeenkomst_1 = rawData[i].def_sim;
			metadataObj.overlap_1 = rawData[i].def_overlap;

			document.getElementsByClassName('fml-author')[0].innerHTML = metadataObj.auteur;
			document.getElementsByClassName('fml-title')[0].innerHTML = metadataObj.titel + " <a class=\'fml-url\' target=\'_blank\' href=\'" + metadataObj.url + "\'>(stcn)</a>";
			document.getElementsByClassName('fml-jaar')[0].innerHTML = metadataObj.jaar;
			document.getElementsByClassName('fml-drukker')[0].innerHTML = metadataObj.drukker;
			document.getElementsByClassName('fml-plaats')[0].innerHTML = metadataObj.plaats;
			document.getElementsByClassName('fml-contextwoorden')[0].innerHTML = metadataObj.contextwoorden;

			document.getElementsByClassName('fml-frequentie')[0].innerHTML = metadataObj.frequentie_1;
			document.getElementsByClassName('fml-overeenkomst')[0].innerHTML = metadataObj.overeenkomst_1;
			document.getElementsByClassName('fml-overlap')[0].innerHTML = metadataObj.overlap_1;

		}
	}
    }

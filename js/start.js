const gallery = document.getElementById('gallery');
const modal = document.getElementsByClassName("modal-container")[0];
const modalCloseBtn = document.getElementById("modal-close-btn");
modal.style.display = "none";
const prev = document.getElementById("modal-prev");
const next = document.getElementById("modal-next");
const submit = document.getElementById("search-submit")

let card;
let allPersonel;

let userNumber;

// MODULAR APPROACH
function fetchData(url) {

    fetch(url)
        .then(response => response.json())
        .then(data => {
        	allPersonel = data.results;
        	organiseData(data.results)
        })
        .then(setUpEventListener)
        .catch(error => {
            console.log("There was a problem: " + Error(error))
            loadError(error);
        })
}

const numberOfUsers = 12
fetchData(`https://randomuser.me/api/?results=${numberOfUsers}`);


// GET DATA FROM API AND PRESENT TO HTML
function organiseData(data = allPersonel) {
    let html = "";
    for (let i = 0; i < data.length; i++) {
        html += `<div class="card" value="${i}">
                    <div class="card-img-container">
                        <img class="card-img" src="${data[i].picture.large}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${data[i].name.first} ${data[i].name.last}</h3>
                        <p class="card-text">${data[i].email}</p>
                        <p class="card-text cap">${data[i].location.city}, ${data[i].location.state}</p>
                    </div>
                </div>`
    }
    gallery.innerHTML = html;
}

// SHOW ERROR IN FECTH
function loadError(error) {
    gallery.innerHTML = `<h2>There was an errror loading personel.<br>${error}</h2>`;
}


// GALLERY EVENT LISTENER
function setUpEventListener() {
	card = document.getElementsByClassName("card");
    for (let i = 0; i < card.length; i++) {
        card[i].addEventListener("click", (e) => {
        	const parent = e.target.closest(".card")
            makeModal( parent.getAttribute('value') );

        })
    }
}


// FIND PERSON AND MAKE MODAL
function makeModal(n) {
        userNumber = n;
		modal.style.display = "block";
		const person = allPersonel[n];
		const modalAll = document.querySelector('.modal-info-container');
		// GET DOB
		const year = person.dob.date.substring(0,2);
		const month = person.dob.date.substring(5,7);
		const day = person.dob.date.substring(8,10);

        let phone = person.cell.replace(/[-&\/\\#,+()$~%.'":*?<>{}]/g, '');
        phone = phone.replace(/\s/g, '');
        let filteredPhone = [ "(", phone.slice(0, 3), ") ", phone.slice(3, 6), "-", phone.slice(6, phone.length) ].join("");

        /* NOTE ON PHONE NUMBER: I changed the format of the phone number to be:
        (xxx) xxx-xx...xxx
        Due to the fact that all numbers are of varying lengths I had to go with 
        this approach.
        */
        
        modalAll.innerHTML = `<img class="modal-img" src="${person.picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                        <p class="modal-text">${person.email}</p>
                        <p class="modal-text cap">${person.location.city}</p>
                        <hr>
                        <p class="modal-text">${filteredPhone}</p>
                        <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.state} ${person.location.postcode}</p>
                        <p class="modal-text">Birthday: ${month}/${day}/${year}</p>`;
}


// CLOSE MODAL 
modalCloseBtn.addEventListener("click", ()=> {
		modal.style.display = "none";
})


// TOGGLE NEXT AND PREV
prev.addEventListener("click", ()=> {
	// Loops around
	if (userNumber == 0) {
		userNumber = card.length-1;
	}else {
		userNumber = parseInt(userNumber) - 1;
	}
	makeModal(userNumber);

});

next.addEventListener("click", ()=> {
	// Loops around
	if (userNumber == card.length-1) {
		userNumber = 0;
	}else {
		userNumber = parseInt(userNumber) + 1;
	}
	makeModal(userNumber);
})


// SEARCH 
submit.addEventListener("click", (e) => {
	e.preventDefault();
	const input = document.getElementById("search-input").value;
	const filtered = allPersonel.filter( item => item.name.first.toLowerCase() == input.toLowerCase());
	if (input === "") {
		organiseData()
	}else {
		organiseData(filtered)
	}
	

})





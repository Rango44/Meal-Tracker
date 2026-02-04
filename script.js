loadMeals(); // load from local storage
 let mealKey = null;

function save() {

}

function load() {

    }

function togglePages(page, btn) {
    const pages = document.querySelectorAll('.pageview'); //selects all elements with class 'pageview'
    pages.forEach(page => page.style.display = 'none'); // hides all pages
    document.getElementById(page).style.display = 'block'; // shows the selected page

    const navBtns = document.querySelectorAll('.nav-btn'); //selects all elements with class 'nav-btn'
    
    if (btn !== undefined) { // if one of the nav bar buttons are pressed
        navBtns.forEach(btn => btn.classList.remove('active')); // removes 'active' class from all nav buttons
        document.getElementById(btn).classList.add('active'); // adds 'active' class to selected nav button
    }
    

    if (page === 'calendarPage') {
        initCal();
    }

    if (page === 'homePage') {
        
    }

    if (page === 'mealsPage') {
        loadMeals(); // load meals, ensures the information is always updated when viewing
    }

    if (page !== 'createmealPage') {
        form.reset(); // reset form values after leaving the form 
    }

    if (page === 'viewallmealsPage') {
        
    }
}

function initCal(){
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'dayGridWeek' ,
          height: 500,
          aspectRatio: 1,
          headerToolbar: {
               left: 'title',
               right: 'dayGridWeek,dayGridMonth',
          },

          footerToolbar: {
               right: 'prev,next'
          }


        });
        calendar.render();
      };

      

const form = document.querySelector('form'); //selects the form
    form.addEventListener('submit', (e) => { //runs when form is submitted
        e.preventDefault(); //stop screen from refreshing

        const mealData = new FormData(form);
        const mealItem = Object.fromEntries(mealData);

        if (mealItem.category === 'n/a') {
            window.alert("Please select a category");
            return;
        }

        const json = JSON.stringify(mealItem);

        if (mealKey !== null) { // if we're editing an item
            localStorage.setItem(mealKey, json); // replaces the json for existing item 
            document.getElementById('submit').value = 'Confirm'; // changes button text after we're done editing
            mealKey = null; // resets mealKey
            togglePages('mealsPage')

        }
        else {
            localStorage.setItem('mealItem_' + Date.now(), json); // sets title of json data to 'mealItem_' + date. contains form data
        }
        console.log(mealItem);
        displayMeal();
        form.reset();
        

        });

function displayMeal() {
    let category = document.getElementById('category').value;

    let container = document.getElementById(category);
    let container2 = document.getElementById('recentlymademeals');
    
     container.innerHTML = ''; //clears the container ready for new data when loop runs multiple times
     container2.innerHTML = ''; //clears the container ready for new data when loop runs multiple times
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); //title of the item containing the data
        if (key.startsWith('mealItem_')) {
            const json = localStorage.getItem(key);
            const mealItem = JSON.parse(json);

            container2.innerHTML += createCard(mealItem, key);

            if (mealItem.category === category) {
            container.innerHTML += createCard(mealItem, key);
            
            
            }
        }
    }
}

function loadMeals() {
let container = document.getElementById('breakfast');
let container2 = document.getElementById('lunch');
let container3 = document.getElementById('dinner');
let container4 = document.getElementById('baking/dessert');
let container5 = document.getElementById('recentlymademeals');

container .innerHTML='';
container2.innerHTML='';
container3.innerHTML='';
container4.innerHTML='';
container5.innerHTML='';


        for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); //title of the item containing the data

        if (key.startsWith('mealItem_')) { // only pick up data that starts with 'mealItem_'
            const json = localStorage.getItem(key);
            const mealItem = JSON.parse(json);

            let container2 = document.getElementById('recentlymademeals');

            if (mealItem.category === 'breakfast') {
                const container=document.getElementById('breakfast');
                container.innerHTML += createCard(mealItem, key);
                container2.innerHTML += createCard(mealItem, key);
            }

            else if (mealItem.category === 'lunch') {
                const container=document.getElementById('lunch');
                container.innerHTML += createCard(mealItem, key);
                container2.innerHTML += createCard(mealItem, key);
            }

            else if (mealItem.category === 'dinner') {
                const container=document.getElementById('dinner');
                container.innerHTML += createCard(mealItem, key);
                container2.innerHTML += createCard(mealItem, key);
            }

            else if (mealItem.category === 'baking/dessert') {
                const container=document.getElementById('baking/dessert');
                container.innerHTML += createCard(mealItem, key);
                container2.innerHTML += createCard(mealItem, key);
            }
        }
    }
}

function createCard(mealItem, key) {
    return `
            <div class="card" style="width: 18rem;" id="${key}">
            <div class="card-body">
            <h5 class="card-title">${mealItem.mealname}</h5>
            <p class="card-text">
            ${mealItem.calories} <br>
            ${mealItem.cost}
            </p>
            <input type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mealModal" value = View onclick="mealModal('${key}')"></input> <!-- send the name/unique key of the meal item selected to the modal fucntion -->
            
            </div>
            </div>
            <br>
        `

}

function mealModal(key) {
    const json = localStorage.getItem(key); // 
    const mealItem = JSON.parse(json);

    let title = document.getElementById('modalTitle');
    let container = document.getElementById('modalBody');
    let footer = document.getElementById('modal-footer');

    title.innerHTML = `${mealItem.mealname}`

    container.innerHTML = `
            <div class="container-fluid">
            <div class="row">
            <div class="col">
            <p>${mealItem.calories}</p>
            <p>${mealItem.cost}</p>
            <p>${mealItem.instructions}</p>
            <p>${mealItem.category}</p>
            <p>${mealItem.URL}</p>
            ${mealItem.mealImage} <img src="${mealItem.mealimage}">
            </div>
            </div>
            </div>
    `

    footer.innerHTML = `
        <button type="button" class="btn btn-secondary" onclick="editItem('${key}')">Edit</button>
        <button type="button" class="btn btn-danger" onclick="deleteItem('${key}')">Delete</button>
    `

}


function deleteItem(key) {

    let modal = document.getElementById('mealModal');
    let modalInstance = bootstrap.Modal.getInstance(modal); // get the open modal 

    let text = "Are you sure you want to delete this item?"
    if (confirm(text) == true) {
    localStorage.removeItem(key);
    loadMeals();

    modalInstance.hide() // closes modal

    } else {
        return;
    }
    
}

function editItem(key) {


    mealKey = key

    const json = localStorage.getItem(key);
    const mealItem = JSON.parse(json);
    let modal = document.getElementById('mealModal');
    let modalInstance = bootstrap.Modal.getInstance(modal); // get the open modal 

    document.getElementById('submit').value = 'Update'; // changes button text
    
    document.getElementById('mealname').value = mealItem.mealname;
    document.getElementById('calories').value = mealItem.calories;
    document.getElementById('cost').value = mealItem.cost;
    document.getElementById('instructions').value = mealItem.instructions;
    document.getElementById('category').value = mealItem.category;
    document.getElementById('URL').value = mealItem.URL;

    
    modalInstance.hide()
    
    togglePages('createmealPage')

    
}
    


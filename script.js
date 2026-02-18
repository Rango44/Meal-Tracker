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

      

let imageURL = '';
      
//Below runs when form is submitted, gets inputs
const form = document.querySelector('form'); //selects the form
    form.addEventListener('submit', (e) => { //runs when form is submitted
        e.preventDefault(); //stop screen from refreshing

        const mealData = new FormData(form);
        const mealItem = Object.fromEntries(mealData);

        if (mealItem.category === 'n/a') {
            window.alert("Please select a category");
            return;
        }

        if (imageURL !== '') {

            mealItem.mealimage = imageURL;

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

        imageURL=''; // needed to avoid image being saved multiple times
        console.log(mealItem);
        displayMeal();
        form.reset();
        

        });

document.querySelector("#mealimage").addEventListener("change", function () { // image processing, runs when image is uplaoded

            const fr = new FileReader();

            
            fr.addEventListener("load", () => {
                console.log(fr.result);
                imageURL = fr.result;

});
                fr.readAsDataURL(this.files[0]);
            
        });
        

function displayMeal() {
    let category = document.getElementById('category').value;

    let container = document.getElementById(category);
    let container2 = document.getElementById('recentlymademeals');
    
     container.innerHTML = ''; //clears the container ready for new data when loop runs multiple times
     container2.innerHTML = ''; //clears the container ready for new data when loop runs multiple times

    const keys = Object.keys(localStorage) //gets all keys from local storage
    .filter(key => key.startsWith('mealItem_')) //only picks up data that starts with 'mealItem_'
    const sortedkeys = keys.sort((a, b) => { //sorts using 2 parameters
        const timeA = parseInt(a.split("_")[1]); // select date part of key
        const timeB = parseInt(b.split("_")[1]); // select date part of key
        return timeB - timeA; // newest first order
        
        });
    
    
        
        
        sortedkeys.forEach(key => {
            const json = localStorage.getItem(key);
            const mealItem = JSON.parse(json);

            container2.innerHTML += createCard(mealItem, key);

            if (mealItem.category === category) {
            container.innerHTML += createCard(mealItem, key);
            }
        });
           
            
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


        const keys = Object.keys(localStorage) //gets all keys from local storage
    .filter(key => key.startsWith('mealItem_')) //only picks up data that starts with 'mealItem_'
    const sortedkeys = keys.sort((a, b) => { //sorts using 2 parameters
        const timeA = parseInt(a.split("_")[1]); // select date part of key
        const timeB = parseInt(b.split("_")[1]); // select date part of key
        return timeB - timeA; //newest order first
        
        });
    
    
        
        
        sortedkeys.forEach(key => {
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
        });
        
    }
    


function createCard(mealItem, key) {


    return `

    

            <div class="card mb-3 me-3" style= "width: 280px; height: 180px;" id="${key}">
            <div class="card-body">
            <h5 class="card-title">${mealItem.mealname}</h5>
            <p class="card-text">
            ${mealItem.cost ? '£' + mealItem.cost : '' }<br> <!--if cost exists, display with £, else display ntohing -->
            ${mealItem.calories ? mealItem.calories + ' cal' : '<br>'}  <!--if calories exists, end with cal, else display ntohing -->
            <div>
            
            </div>
            </p>
            <input type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mealModal" value = View onclick="mealModal('${key}')"></input> <!-- send the name/unique key of the meal item selected to the modal fucntion -->
            
            </div>
            </div>
            
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
            <p>${mealItem.cost ? '£' + mealItem.cost : ''} </p> <!--if cost exists, display with £, else display ntohing -->
            <p>${mealItem.calories ? mealItem.calories + ' calories' : ''}  </p> <!--if calories exists, end with calories, else display ntohing -->
            <p class="text-break"style="white-space: pre-wrap; text-wrap: wrap">${mealItem.instructions}</p> <!-- linebreaks included-->
            <p>Category: ${mealItem.category}</p>
            <p>${mealItem.URL ? 'URL: ' + mealItem.URL : ''} </p> <!--if URL exists, display with URL, else display ntohing --></p>
            <br>
            <br>
           <div class="img-modal-container">
            <img class="img-modal"src="${mealItem.mealimage}">
            </div>
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
    


loadMeals(); // load from local storage


function save() {

}

function load() {

    }

function togglePages(page) {
    const pages = document.querySelectorAll('.pageview'); //selects all elements with class 'pageview'
    pages.forEach(page => page.style.display = 'none'); // hides all pages
    document.getElementById(page).style.display = 'block'; // shows the selected page

    if (page === 'calendarPage') {
        initCal();
    }

    if (page === 'homePage') {
        
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
        localStorage.setItem('mealItem_' + Date.now(), json); // sets title of json data to 'mealItem_' + date. contains form data

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

            container2.innerHTML += createCard(mealItem);

            if (mealItem.category === category) {
            container.innerHTML += createCard(mealItem);
            
            
            }
        }
    }
}

function loadMeals() {
let container2 = document.getElementById('recentlymademeals');
        for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); //title of the item containing the data

        if (key.startsWith('mealItem_')) { // only pick up data that starts with 'mealItem_'
            const json = localStorage.getItem(key);
            const mealItem = JSON.parse(json);

            if (mealItem.category === 'breakfast') {
                const container=document.getElementById('breakfast');
                container.innerHTML += createCard(mealItem);
                container2.innerHTML += createCard(mealItem);
            }

            else if (mealItem.category === 'lunch') {
                const container=document.getElementById('lunch');
                container.innerHTML += createCard(mealItem);
                container2.innerHTML += createCard(mealItem);
            }

            else if (mealItem.category === 'dinner') {
                const container=document.getElementById('dinner');
                container.innerHTML += createCard(mealItem);
                container2.innerHTML += createCard(mealItem);
            }

            else if (mealItem.category === 'baking/dessert') {
                const container=document.getElementById('baking/dessert');
                container.innerHTML += createCard(mealItem);
                container2.innerHTML += createCard(mealItem);
            }
        }
    }
}

function createCard(mealItem) {
    return `
            <div class="card" style="width: 18rem;">
            <div class="card-body">
            <h5 class="card-title">${mealItem.mealname}</h5>
            <p class="card-text">
            ${mealItem.calories} <br>
            ${mealItem.cost}
            </p>
            <input type="button" class="btn btn-primary" onclick="mealModal(${mealItem.mealname})">Go somewhere</input>
            
            </div>
            </div>
        `

}

function mealModal(mealItem) {

}
    


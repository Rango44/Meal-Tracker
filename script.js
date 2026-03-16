loadMeals(); // load from local storage
 let mealKey = null;
 let addingItem = null;
 let selectedDate = null;
 let onCal = null; 

function save() {

}

function load() {

    }

function togglePages(page, btn) {
    const pages = document.querySelectorAll('.pageview'); //selects all elements with class 'pageview'
    pages.forEach(page => page.style.display = 'none'); // hides all pages
    document.getElementById(page).style.display = 'block'; // shows the selected page

    const navBtns = document.querySelectorAll('.nav-btn'); //selects all elements with class 'nav-btn'
    navBtns.forEach(btn => btn.classList.remove('active')); // removes 'active' class from all nav buttons
    
    if (btn !== undefined) { // if one of the nav bar buttons are pressed
        
        document.getElementById(btn).classList.add('active'); // adds 'active' class to selected nav button
    } else { // if the page changes from a button other than the nav button, find out what page it is and activate the right nav btn.
        if (page === 'calendarPage') {
            document.getElementById('calendarbtn').classList.add('active')
        }
        if (page === 'mealsPage' || page === 'viewallmealsPage' || page === 'createmealPage') {
            document.getElementById('mealpagebtn').classList.add('active')
        }
    }
    

    if (page === 'calendarPage') {
        onCal=true;
        loadMeals(); // load meals, ensures the information is always updated when viewing
        initCal();
    }

    if (page !== 'calendarPage') {
        onCal=false;
    }

    if (page === 'settingsPage') {
        
    }


    if (page === 'homePage') {
       
    }

    if (page === 'mealsPage') {
        loadMeals(); // load meals, ensures the information is always updated when viewing
        
    }

    if (page !== 'createmealPage') {
        form.reset(); // reset form values after leaving the form 
        document.getElementById('submit').value = 'Confirm'; //ensure button is confirm after leaving editing page
        document.getElementById('preview').src = ''; //ensure preview image is cleared after leaving page
        document.getElementById("preview").style.display = 'none'; //no preview image box
    }

    if (page === 'viewallmealsPage') {
        loadMeals(); // load meals, ensures the information is always updated when viewing
    }

    if (page !== 'viewallmealsPage' && page !== 'mealsPage') { // if the page isnt a meal page after going to add to the calendar, disable the add button on the card button, assuming they dont want to add anymore.
        addingItem=null; // reset adding item variable so add button only appears when coming from calendar
    }

}
      

let imageURL = '';
      
//Below runs when form is submitted, gets inputs
const form = document.querySelector('form'); //selects the form
    form.addEventListener('submit', async (e) => { //runs when form is submitted
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
        else {
            delete mealItem.mealimage // clear empty object if no iamge is uplaoded so we can verify if there actually is an image or not
        }


        if (mealKey !== null) { // if we're editing an item

        const oldJson = await localforage.getItem(mealKey); // get existing json data, needed to retrieve calDate array 
        const oldItem = JSON.parse(oldJson);
        
        if (oldItem.calDates) {
            mealItem.calDates = oldItem.calDates; // add existing calendar date array to new edited item
            }
        }


        const json = JSON.stringify(mealItem);

        if (mealKey !== null) { // if we're editing an item
            try {
            await localforage.setItem(mealKey, json); // replaces the json for existing item 
            document.getElementById('submit').value = 'Confirm'; // changes button text after we're done editing
            mealKey = null; // resets mealKey


            togglePages('mealsPage')
            } catch (error) {
                window.alert(error);
            }

        } else { try {

            await localforage.setItem('mealItem_' + Date.now(), json); // sets title of json data to 'mealItem_' + date. contains form data
            } catch (error) {
                window.alert(error);
            }
        }

        imageURL=''; // needed to avoid image being saved multiple times
        
        console.log(mealItem);
        
        form.reset();
        

        });

document.querySelector("#mealimage").addEventListener("change", function () { // image processing, runs when image is uplaoded

            const fr = new FileReader();
            
            fr.addEventListener("load", () => {
                console.log(fr.result);
                imageURL = fr.result;
                document.getElementById("preview").src = fr.result;
                document.getElementById("preview").style.display = 'block';

});
                fr.readAsDataURL(this.files[0]);
            
        });
        

function resetForm() {
    form.reset(); // reset form values after leaving the form 
        document.getElementById('submit').value = 'Confirm'; // wont be 'updating' anything, just confirm
        document.getElementById('preview').src = ''; //preview image is cleared
        document.getElementById('preview').style.display = 'none';
        imageURL=''
}

function removeImg() {
    document.getElementById('preview').src = ''; //preview image is cleared
    document.getElementById('preview').style.display = 'none';
    
}

function deleteImg(){
    document.getElementById('preview').src = ''; //preview image is cleared
    document.getElementById('preview').style.display = 'none';
    imageURL=''
}

async function loadMeals() {
let container = document.getElementById('breakfast');
let container2 = document.getElementById('lunch');
let container3 = document.getElementById('dinner');
let container4 = document.getElementById('baking/dessert');
let container5 = document.getElementById('recentlymademeals');

container.innerHTML='';
container2.innerHTML='';
container3.innerHTML='';
container4.innerHTML='';
container5.innerHTML='';


        const keys = (await localforage.keys()) //gets all keys from local storage
    .filter(key => key.startsWith('mealItem_')) //only picks up data that starts with 'mealItem_'
    const sortedkeys = keys.sort((a, b) => { //sorts using 2 parameters
        const timeA = parseInt(a.split("_")[1]); // select date part of key
        const timeB = parseInt(b.split("_")[1]); // select date part of key
        return timeB - timeA; //newest order first
        
        });
// sortedkeys.forEach(key => {    // way to get data from local storage (olddddddddd)

    for (const key of sortedkeys) {
            const json = await localforage.getItem(key);
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
        };
    }
    


function createCard(mealItem, key, date) {

let addBtn = ' ';
let removeBtn = ' ';

if (addingItem === true) {
    addBtn= `<input type="button" class="btn btn-success" value=" Add " onclick="confirmAdd('${key}')"></input>` // add button for when adding a meal to the calendar

};

if (onCal === true) {
    removeBtn= `<input type="button" class="btn btn-danger" value="Remove" onclick="dateRemove('${key}', '${date}')"></input>` // add button for when removing a meal from the calendar
}


    return `

  <div class="card ms-2 mb-3 me-3" style="min-width: 339px; max-width: 339px; height: 180px">
  <div class="row g-0 h-100">
    
    <div class="col-7 h-100">
      <div class="card-body">
        <h5 class="card-title text-truncate fs-4 pb-1">${mealItem.mealname}</h5>
        <p class="card-text">${mealItem.cost ? '£' + mealItem.cost : '' }<br> <!--if cost exists, display with £, else display ntohing -->
            ${mealItem.calories ? mealItem.calories + ' cal' : '<br>'}  <!--if calories exists, end with cal, else display ntohing --></p>

        <div class="d-flex justify-content-between">
            <input type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mealModal" value = " View " onclick="mealModal('${key}')"></input> <!-- send the name/unique key of the meal item selected to the modal fucntion -->
            ${addBtn}
            ${removeBtn}
        </div>
            
      </div>
    </div>

      <div class="col-5 border rounded-end h-100" data-bs-toggle="modal" data-bs-target="#mealModal" onclick="mealModal('${key}')">
      ${mealItem.mealimage ? '<img class="img-card border border-1 rounded-end" src="' + mealItem.mealimage + '" >' 
    : '<img class="h-75 mt-4 ps-1 img-card rounded-end" src="source/noimage.png">' }
    </div>

    
  </div>
</div>

            
            
        `

}



async function mealModal(key) {
    const json = await localforage.getItem(key); // 
    const mealItem = JSON.parse(json);

    let title = document.getElementById('mealModalTitle');
    let container = document.getElementById('mealModalBody');
    let footer = document.getElementById('mealModal-footer');

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
            
            
           <div class="pt-4 d-flex mx-auto justify-content-center align-items-center col-12">
            ${mealItem.mealimage ? '<img class="img-modal border border-5 rounded" src="' + mealItem.mealimage + '">' : '' }
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


 async function openDate(date) { // runs when you click on a date on the calendar
            let title = document.getElementById('calModalTitle');
            let container = document.getElementById('calModalBody');
            let footer = document.getElementById('calModal-footer');
            
            container.innerHTML = '';

            const keys = (await localforage.keys()) //gets all keys from local storage
            .filter(key => key.startsWith('mealItem_')); //only picks up data that starts with 'mealItem_'

            for (const key of keys) { // get all meals
            const json = await localforage.getItem(key);
            const mealItem = JSON.parse(json);
            

            if (mealItem.calDates && mealItem.calDates.includes(date)) { // if an item has a cal date array that has the selected date in the index
                container.innerHTML += createCard(mealItem, key, date); // display meal card if its planned for the selected date
            }
        }
            

            title.innerHTML= `${date}`


            footer.innerHTML = `
            <button type="button" class="btn btn-primary" onclick="addItem('${date}')">Add</button>
            `

                let modal = (document.getElementById('calendarModal'));
                let modalInstance = bootstrap.Modal.getOrCreateInstance(modal); // get the open modal
                modalInstance.show();
          }   

async function initCal(){
    let events = []; // for calendar

    const keys = (await localforage.keys()) //gets all keys from local storage
    .filter(key => key.startsWith('mealItem_')); //only picks up data that starts with 'mealItem_'

    for (const key of keys) { // get all meals
    const json = await localforage.getItem(key);
    const mealItem = JSON.parse(json);

        if (mealItem.calDates) { // if a meal has a planned date
            mealItem.calDates.forEach(date => { // add event to calendar for every date the meal is planned for
                events.push({
                    start: date,
                    display: 'background',
                    })
                })
            }
        }


    var calendarEl = document.getElementById('calendar');
    calendarEl.innerHTML = ''; // clear calendar before re writing so it doesn't secretly duplicate
    var calendar = new FullCalendar.Calendar(calendarEl, {
    
          initialView: 'dayGridMonth' ,
          height: '100%',
          aspectRatio: 1,
          events: events,
          headerToolbar: {
               left: 'title',
               right: 'prev,next',
            },
            dateClick: function(info) {
                openDate(info.dateStr)
            },


        });


        calendar.render();
      };



         





function deleteItem(key) {

    let modal = document.getElementById('mealModal');
    let modalInstance = bootstrap.Modal.getInstance(modal); // get the open modal 

    let text = "Are you sure you want to delete this item?"

    if (confirm(text) == true) {
    localforage.removeItem(key);
    loadMeals();

    modalInstance.hide() // closes modal

    } else {
        return;
    }
    
}

async function editItem(key) {


    mealKey = key

    const json = await localforage.getItem(key);
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
    
    const preview = document.getElementById('preview');

    if (mealItem.mealimage) {
        preview.src = mealItem.mealimage
        preview.style.display = 'block';
        imageURL = mealItem.mealimage // save existing iamge to varaible so it stays on the card

    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
    
    
    modalInstance.hide()
    
    togglePages('createmealPage')
    

    
}

function addItem(date) {

    
    let modal = document.getElementById('calendarModal');
    let modalInstance = bootstrap.Modal.getInstance(modal); // get the open modal

    togglePages('viewallmealsPage')

    modalInstance.hide()
    addingItem=true;
    selectedDate = date;

    
}

async function confirmAdd(key) {

    const container = document.getElementById('calModalBody');

    let json = await localforage.getItem(key); // 
    const mealItem = JSON.parse(json);

    if (mealItem.calDates) { //if the json object has a calendar date array, add the date to it. 
        mealItem.calDates.push(selectedDate);
    } else { // if array doesnt exist, make the array and then add to it. Stores date(s) a meal is planned for in the calendar.
        mealItem.calDates = []; 
        mealItem.calDates.push(selectedDate);
    }

    json = JSON.stringify(mealItem); // convert for saving
    await localforage.setItem(key, json); 

    container.innerHTML += createCard(mealItem, key);
    togglePages('calendarPage')
    
    window.alert("Item added to " + selectedDate);


addingItem=null;
}

async function dateRemove(key, date) {
    let json = await localforage.getItem(key); 
    const mealItem = JSON.parse(json);

    let index = mealItem.calDates.indexOf(date); //find date/index in the array

    mealItem.calDates.splice(index, 1); //remove date from array

    json = JSON.stringify(mealItem); // convert for saving
    await localforage.setItem(key, json); 

    openDate(date); // refresh modal
    initCal(); // refresh refresh calendar
}
    


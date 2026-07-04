 
 let mealKey = null; // used to store the key of meal, needed for edit 
 let addingItem = null; // used to determine if an item is being added to the calendar, makes add button visible on cards
 let selectedDate = null; // stores the selected date so it can be used in the confirmAdd function
 let onCal = null; // used to determine if the user is on the calendar page. makes remove button visible on cards if true
 let prevModal = null; // stores the previous modal so the back button can be used to return to it.
 let loading = null; //used to prevent fucntions from running before they're finished

 
const urlInput = document.getElementById('URL');
const paste = document.getElementById('paste');
const label = document.getElementById('URLlabel');

//sets theme at startup
if (localStorage.getItem('theme') === 'dark') { 
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    document.getElementById('darkmodebtn').checked = true
} else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    document.getElementById('darkmodebtn').checked = false
}

function togglePages(page, btn) {
    const pages = document.querySelectorAll('.pageview'); //selects all elements with class 'pageview'
    pages.forEach(page => page.style.display = 'none'); // hides all pages
    document.getElementById(page).style.display = 'block'; // shows the selected page

    const navBtns = document.querySelectorAll('.nav-btn'); //selects all elements with class 'nav-btn'
    navBtns.forEach(btn => btn.classList.remove('active')); // removes 'active' class from all nav buttons
    
    if (btn !== undefined) { // if one of the nav bar buttons are pressed
        
        document.getElementById(btn).classList.add('active'); // adds 'active' class to selected nav button
    } else { // if the page changes from a function (nav button not pressed), find out what page it is and activate the right nav btn.
        if (page === 'calendarPage') {
            document.getElementById('calendarbtn').classList.add('active')
        }
        if (page === 'mealsPage' || page === 'viewallmealsPage' || page === 'createmealPage') {
            document.getElementById('mealpagebtn').classList.add('active')
        }
    }
    

    if (page === 'calendarPage') {

        onCal=true;
        if (loading === true) {return}
        loading=true;
        loadMeals(); // load meals, ensures the information is always updated when viewing
        initCal();
        loading=null;
    }

    if (page !== 'calendarPage') {
        onCal=false;
        prevModal = null; 
        
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

    if (page === 'createmealPage') {
        URLUI(); // ensures the UI is correct when editing an item with a url
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

        if (imageURL !== '') { // if an image is added or exists, save it to the object
            mealItem.mealimage = imageURL;
        } else {
            delete mealItem.mealimage // delete field from object if no image is uplaoded so we can verify if there actually is an image or not, stops the empty image icon from appearing
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
            mealKey = null; // resets mealKey because we're not editing an item anymore
            togglePages('mealsPage')

            } catch (error) { //if there's an error when editing
                window.alert(error);
            }

        } else { try { // if we're adding a new item (not editing an existing item)

            await localforage.setItem('mealItem_' + Date.now(), json); // sets title of json data to 'mealItem_' + date. contains form data
            } catch (error) {
                window.alert(error);
            }
        }

        imageURL=''; // clear image, needed to avoid image being saved multiple times
    
        //console.log(mealItem);
        
        removeImg();
        form.reset();
        

        });

function URLUI()  {

    if (urlInput.value.includes('https://')){ //if the URL field starts with https
        paste.classList.remove('d-none') // show paste button
        label.innerHTML = '🔎' 
        label.style.cursor = 'pointer'

        label.onclick = function() { //when your press the URL label
        let url = urlInput.value;
        if(url) window.open(url)}; // open URL

        if (urlInput.value === '') { 
            paste.classList.add('d-none')
            label.innerHTML = 'Video URL:'
            label.style.cursor = 'default'
        }

        } else {
            paste.classList.add('d-none')
            label.innerHTML = 'Video URL:'
            label.style.cursor = 'default'
        }
}
    //Paste button visibility control and URL click fucntionality
    urlInput.addEventListener('input', URLUI);// runs when theres an input in the URL input box

            

        

document.querySelector("#mealimage").addEventListener("change", function () { // image processing, runs when image is uplaoded

            const fr = new FileReader();
            

            if (this.files[0].type.startsWith('image/')) { // if the uplaoded file is actually an image
                fr.addEventListener("load", () => { 
                //console.log(fr.result);
                imageURL = fr.result;
                document.getElementById("preview").src = fr.result;
                document.getElementById("preview").style.display = 'block';

            });
                fr.readAsDataURL(this.files[0]); 

            } else {
                window.alert("Please choose a or take a picture");

            }
            
            
            
        });
        


function resetForm() {
    form.reset(); // reset form values after leaving the form 
        document.getElementById('submit').value = 'Confirm'; //ensures button is 'confirm', not 'update' 
        document.getElementById('preview').src = ''; //preview image is cleared
        document.getElementById('preview').style.display = 'none';
        imageURL=''
        paste.classList.add('d-none') // ensure paste button is hidden
        label.innerHTML = 'Video URL:' //URL label back to normal
        label.style.cursor = 'default'
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

if (loading === true) {return} //prevents cards getting duplicated when navigating the app quickly.

loading = true;
document.getElementById('loadingindicator').classList.remove('d-none') //show loading

let container = document.getElementById('breakfast');
let container2 = document.getElementById('lunch');
let container3 = document.getElementById('dinner');
let container4 = document.getElementById('baking/dessert');
let container5 = document.getElementById('recentlymademeals');
let container6 = document.getElementById('snack');

container.innerHTML='';
container2.innerHTML='';
container3.innerHTML='';
container4.innerHTML='';
container5.innerHTML='';
container6.innerHTML='';

let emptyMsg = `<p class="text-muted fs-6">Nothing here yet... </p>`;


    const keys = (await localforage.keys()) //gets all keys from local storage

    const sortedkeys = keys.sort((a, b) => { //sorts using 2 parameters
    const timeA = parseInt(a.split("_")[1]); // select date part of a key
    const timeB = parseInt(b.split("_")[1]); // select date part of another key
        return timeB - timeA; //newest first. displays as last in, first out
        });

// sortedkeys.forEach(key => {    // way to get data from local storage (olddddddddd)

    for (const key of sortedkeys) { //for every key
        const json = await localforage.getItem(key); //get the data
        const mealItem = JSON.parse(json); //parse the data

        //create meal card in recently made and category containers
        if (mealItem.category === 'breakfast') {
            container.innerHTML += createCard(mealItem, key);
            container5.innerHTML += createCard(mealItem, key);
        }

        else if (mealItem.category === 'lunch') {
            container2.innerHTML += createCard(mealItem, key);
            container5.innerHTML += createCard(mealItem, key);
        }

        else if (mealItem.category === 'dinner') {   
            container3.innerHTML += createCard(mealItem, key);
            container5.innerHTML += createCard(mealItem, key);
        }

        else if (mealItem.category === 'baking/dessert') {  
            container4.innerHTML += createCard(mealItem, key);
            container5.innerHTML += createCard(mealItem, key);
        }

        else if (mealItem.category === 'snack') { 
            container6.innerHTML += createCard(mealItem, key);
            container5.innerHTML += createCard(mealItem, key);
        }
            
        };

    //place holder messages if no cards are in a container

    if (container.innerHTML === '') {
        container.innerHTML = emptyMsg;
    }

    if (container2.innerHTML === '') {
        container2.innerHTML = emptyMsg;
    }

    if (container3.innerHTML === '') {
        container3.innerHTML = emptyMsg;
    }
    if (container4.innerHTML === '') {
        container4.innerHTML = emptyMsg;
    }
    if (container5.innerHTML === '') {
        container5.innerHTML = emptyMsg;
    } 
    if (container6.innerHTML === '') {
        container6.innerHTML = emptyMsg;
    } 

    loading = null; //loading finished
    document.getElementById('loadingindicator').classList.add('d-none') //hide loading
} 
    
function createCard(mealItem, key, date) { 

let addBtn = ' ';
let removeBtn = ' ';

if (addingItem === true) {
    addBtn= `<input type="button" class="btn btn-success" value=" Add " onclick="confirmAdd('${key}')"></input>` // add button for when adding a meal to the calendar

};

if (onCal === true) {
    removeBtn= `<input type="button" class="btn btn-danger" value="Remove" onclick="dateRemove('${key}', '${date}')"></input>` // add button for when removing a meal from the calendar
    /* quantity = `<input type="number" class="form-control float-end" id="quantity" name="quantity" value="1" min="1" style="width:45px">` */
}

    return `

  <div class="card ms-2 mb-3 me-3 border-3 rounded-2" style="min-width: 319px; max-width: 319px; height: 180px">
  <div class="row g-0 h-100">
    
    <div class="col-7 h-100">
      <div class="card-body rounded-start-1">
        <h5 class="card-title text-truncate fs-5 pb-1">${mealItem.mealname}</h5>
        
        <p class="card-text">${mealItem.cost ? '£' + mealItem.cost : '' }<br> <!--if cost exists, display with £, else display ntohing -->
            ${mealItem.calories ? mealItem.calories + ' cal' : '<br>'}  <!--if calories exists, end with cal, else display ntohing --></p>

        <div class="d-flex gap-1 justify-content-start">
            <input type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mealModal" value = " View " onclick="mealModal('${key}')"></input> <!-- send the name/unique key of the meal item selected to the modal fucntion -->
            ${addBtn}
            ${removeBtn}
        </div>
            
      </div>
    </div>

      <div class="col-5 rounded-end h-100" data-bs-toggle="modal" data-bs-target="#mealModal" onclick="mealModal('${key}')">
      ${mealItem.mealimage ? '<img class="img-card rounded-end-1" src="' + mealItem.mealimage + '" >' 
    : '<img class="h-75 mt-4 ps-1 img-card rounded-end" src="source/noimage.png">' }
    </div>

    
  </div>
</div>
`

}



async function mealModal(key) {
    const json = await localforage.getItem(key);  
    const mealItem = JSON.parse(json);
    
    let header = document.getElementById('mealModalHeader');
    let container = document.getElementById('mealModalBody');
    let footer = document.getElementById('mealModal-footer');
    let closeBtn = `<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>` //normal close button

    if (prevModal !== null) { // close button is a back button so we return to calendar modal
        closeBtn = `<button type="button" class="close" data-bs-toggle="modal" data-bs-target="#calendarModal" aria-label="Close"> <span aria-hidden="true">&larr;</span> </button>`
    }
    
    header.innerHTML = `<h5 class="modal-title text-wrap text-break" id="mealModalTitle">${mealItem.mealname} </h5> ${closeBtn}` 
     

    container.innerHTML = `
            <div class="container-fluid">
            <div class="row">
            <div class="col">
            <div class="d-flex justify-content-between">
                <p>${mealItem.cost ? '£' + mealItem.cost : ''} </p> <!--if cost exists, display with £, else display ntohing -->
                <p>${mealItem.calories ? mealItem.calories + ' calories' : ''}  </p> <!--if calories exists, end with calories, else display ntohing -->
            </div>
            <p class="text-break"style="white-space: pre-wrap; text-wrap: wrap">${mealItem.instructions}</p> <!-- linebreaks included-->
            <p>Category: ${mealItem.category}</p>
            <p class="truncate">URL:  <a href="${mealItem.URL}">${mealItem.URL}</a> </p>
            
            
            
           <div class="pt-4 d-flex mx-auto justify-content-center align-items-center col-12">
            ${mealItem.mealimage ? '<img class="img-modal border border-5 rounded" src="' + mealItem.mealimage + '">' : '' }
            </div>
            </div>
            </div>
            </div>
    `

    footer.innerHTML = `
        <button type="button" class="btn btn-secondary py-2" onclick="editItem('${key}')">Edit</button>
        <button type="button" class="btn btn-danger py-2" onclick="deleteItem('${key}')">Delete</button>
    `


}


async function openDate(date) { // runs when you click on a date on the calendar

if (loading === true) {return}

loading=true;

    let title = document.getElementById('calModalTitle');
    let container = document.getElementById('calModalBody');
    let footer = document.getElementById('calModal-footer');
    let totalCal = 0;
    let totalCost = 0;

    //date formatting
    const [year, month, day] = date.split('-'); // seperate date parts separated by hyphens for formatting
    const tempDate = new Date(year, month - 1, day); //creates a JS date thing so we can format it. -1 month because months are counted 0-11
    
    const options = { 
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    };

    formatDate = tempDate.toLocaleDateString('en-UK', options); //formats date
    
    container.innerHTML = ''; //clears container before re writing, prevents item duplication
    const keys = (await localforage.keys()) //gets all keys from local storage

    for (const key of keys) { // get all meals
    const json = await localforage.getItem(key);
    const mealItem = JSON.parse(json);
    
    
    if (mealItem.calDates && mealItem.calDates.includes(date)) { // if an item has a cal date array that has the selected date in the index
        container.innerHTML += createCard(mealItem, key, date); // display meal card if its planned for the selected date
        totalCal += Number (mealItem.calories)
        totalCost += Number (mealItem.cost)
    }
}
    
     
    title.innerHTML= `${formatDate}`
    let stats = `<div> </div>  `; // creates empty space so add button is on the right if nothing is planned
    if (container.innerHTML !== '') { //if there's meals planned for the day, show stats
        stats = ` <div> <strong>Total calories: </strong> ${totalCal} <br> <strong> Total cost: </strong> £${totalCost.toFixed(2)}</div>`            
    }

    footer.innerHTML = `${stats}<button type="button" class="btn btn-primary " onclick="addItem('${date}')">Add</button>`

    let modal = (document.getElementById('calendarModal'));
    let modalInstance = bootstrap.Modal.getOrCreateInstance(modal); // get the calendar modal
    prevModal = modalInstance; //remember the modal so we can return to it if we want
    
    modalInstance.show(); // calendar modal appears

     if (container.innerHTML === '') {
        container.innerHTML = `<p class="text-muted fs-6"> Nothing planned for today, yet... </p>`
    }

    
    loading=false;
  }   

async function initCal(){
    let events = []; // for calendar

    const keys = (await localforage.keys()) //gets all keys from local storage

    for (const key of keys) { // get all meals
    const json = await localforage.getItem(key);
    const mealItem = JSON.parse(json);

        if (mealItem.calDates) { // if a meal has a planned date
            mealItem.calDates.forEach(date => { // add event to calendar for every date the meal is planned for
                events.push({ //highlight background of dates that have plans
                    start: date,
                    display: 'background',
                    })
                })
            }
        }


    var calendarEl = document.getElementById('calendar');
    calendarEl.innerHTML = ''; // clear calendar before re writing so it doesn't secretly duplicate
    var calendar = new FullCalendar.Calendar(calendarEl, {
    // Calendar layout options
      initialView: 'dayGridMonth',
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
    let modalInstance = bootstrap.Modal.getInstance(modal); // get the open modal so we can hide it later

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

    mealKey = key // stores key of meal so the form knows we're editing that item 

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

    if (mealItem.mealimage) { // if the item we're editing has an image, show it
        preview.src = mealItem.mealimage
        preview.style.display = 'block';
        imageURL = mealItem.mealimage // save existing or new image to varaible so it is retained after editing other values.

    } else { //if there's not an image, hide the empty image icon
        removeImg() 
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

    let json = await localforage.getItem(key);
    const mealItem = JSON.parse(json);

    if (mealItem.calDates && mealItem.calDates.includes(selectedDate)) { //if the meal is already planned for the selected date
        window.alert("This meal is already planned for " + selectedDate);
        return;
    }

    if (mealItem.calDates) { //if the item has a calendar date array, add the date to the array. 
        mealItem.calDates.push(selectedDate);
    } else { // if array doesnt exist, make the array and then add to it. Stores date(s) a meal is planned for in the calendar.
        mealItem.calDates = []; 
        mealItem.calDates.push(selectedDate);
    }

    json = JSON.stringify(mealItem); // convert for saving
    await localforage.setItem(key, json); 

    container.innerHTML += createCard(mealItem, key);
    togglePages('calendarPage')


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
    initCal(); // refresh calendar
}
    
async function clearData() {

    let text = "Are you sure you want to remove ALL of your data?"

    if (confirm(text) === false) {
        return;
    } else {
       await localforage.clear();
       loadMeals();
       window.alert("DATA REMOVED");
    } 
}

async function exportData() {

    let everything = {}; // object to store everything temporarily
    let data

    const keys = (await localforage.keys()) //gets all keys from local storage
            for (const key of keys) { // get all meals
            const json = await localforage.getItem(key);
            everything[key]= JSON.parse(json); // parse each item to the 'everything' JS object
    }
    data = JSON.stringify(everything, null, 2); // convert object to json string for exporting, separates each line with line breaks


    //file
    let a = document.createElement("a");
    let file = new Blob([data], {type: "application/json" });
    a.href = URL.createObjectURL(file);
    a.download = "meal-tracker-data.json";
    a.click();

}

async function importData() {
    const input = document.getElementById('importInput');
    input.onchange = read;// runs when a file is selected 
    function read() {
        const file = input.files[0]; //get file from import input

        if (file.type !== "application/json" || !file.name.includes("meal-tracker-data"))  { //if the file isn't json from this app, halt and notify
        window.alert("Select a JSON file exported from this app... (meal-tracker-data.json)");
        input.value = '';
        return;
    }

    const reader = new FileReader();
    let names = ''

    reader.addEventListener("load", async () => { // runs when the file gets read from readastext at bottom of function
    //console.log(reader.result);
    try {
    const data = JSON.parse(reader.result);
    //console.log(reader.result);

    for (const key in data) {
    if (data[key].mealname.includes('undefined') || !key.includes('mealItem') || !data[key].category.includes ('breakfast') && !data[key].category.includes ('lunch') && !data[key].category.includes ('dinner') && !data[key].category.includes ('baking/dessert') && !data[key].category.includes ('snack'))  { //if theres an undefined name or key in wrong format or category that doesn't match the app. this appears when wrong json data is imported.
        window.alert("Invalid data detected. Please select a JSON file exported from this app... (meal-tracker-data.json)");
        return; // nothing is imported 
        }
    } 

    for (const key in data) {
        const json = JSON.stringify(data[key]) //get data for each item and convert to json string for saving
        await localforage.setItem(key, json); // save item with extracted key and json data
        names += data[key].mealname + ',  '; //accumulate imported names
    }

        window.alert("Successfully imported : " + names);
    
    }
    catch (error) {
        window.alert("Invalid data detected. Please select a JSON file exported from this app... (meal-tracker-data.json)\n\n" + error);
        names = ''; //reset for next fucntion run
        input.value = ''; //reset so another file can be imported
        return;
    }
    });
    
    
    names = ''; //reset for next function run
    input.value = ''; //reset so another file can be imported
    reader.readAsText(file); //reads file and then runs the above ^
    
    }
}

async function urlPaste() { //description scraper
let description = ''
let cleanDescription = ''
let finalDescription = ''
let text = ''
let output = document.getElementById('instructions'); //text area on create meal page

document.getElementById('loadingindicator').classList.remove('d-none') //show loading
    
    let request
    let response

// instagram apth
    if (urlInput.value.includes ('instagram')) {
        text = "Do you want to paste the description from the Insagram video?";
        
        if (confirm(text) === true) {
            request = await fetch ('https://api.microlink.io?url=' + (urlInput.value));
            response = await request.json();
try {
            description = response.data.description;
            cleanDescription = description.split(':') // removes the unwanted instagram text at the start of description (left of colon)
            finalDescription = cleanDescription.slice(1).join(':').trim(); // shows the second part of array containing the real video description, includes other colons, gets rid of a space at the start the start of description.
            output.value += '\nDescription captured from video:\n' +finalDescription + '\n'
            console.log(response)
        
        } catch (error) {
            window.alert ('Something went wrong, please try again.' + error);
            document.getElementById('loadingindicator').classList.add('d-none') //hide loading
            return}
        }
    }     

//tiktok path
    else if (urlInput.value.includes ('tiktok')) {
        text = "Do you want to paste the description from the TikTok video?";

        if (confirm(text) === true) {
            try {
            request = await fetch ('https://api.microlink.io?url=' + (urlInput.value));
            response = await request.json();
            description = response.data.description;

                if (description === 'TikTok PWA') { //This is the description output soemtimes, not sure why
                    window.alert ('Please copy the Tiktok link and try again. It may take a few trys.');
                    document.getElementById('loadingindicator').classList.add('d-none')
                    console.log(response)
                    return}

            cleanDescription = description // this adds own line breaks before the characters below as line breaks not captured for TT
                .split(' -').join('\n-')
                .split(' •').join('\n•')
                .split(' *').join('\n*')
                .split(' :').join('\n:')
                .split(' #').join('\n#')
                .split(' 1').join('\n1')
                .split(' 2').join('\n2')
                .split(' 3').join('\n3')
                .split(' 4').join('\n4')
                .split(' 5').join('\n5')
                .split(' 6').join('\n6')
                .split(' 7').join('\n7')
                .split(' 8').join('\n8')
                .split(' 9').join('\n9')
                .split(' 10').join('\n10')
                .split(' 11').join('\n11')
                .split(' 12').join('\n12');

            finalDescription = cleanDescription
            output.value += '\nDescription captured from video:\n' +finalDescription + '\n'
            console.log(response)

        } catch (error) {
            window.alert ('Something went wrong, please try again.' + error);
            document.getElementById('loadingindicator').classList.add('d-none') //hide loading
            return}
        }
    }
            
//youtube path
    else if (urlInput.value.includes ('youtube') || urlInput.value.includes('youtu.be')) {
        text = "Do you want to paste the description from the Youtube video?";

        if (confirm(text) === true) {

            //YOUTUBE API METHOD
            let regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/; //video ID extractor magic 
            let match = urlInput.value.match(regex);
            let videoID = match[1];
            let api = 'AIzaSyBV4CA9WeZ5UWG1wSpoEPKcHf49heYFRlg'; //this probably isn't good practice but it works

            try {
            
            let ytRequest = await fetch ('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + videoID + '&key=' + api);
            let ytResponse = await ytRequest.json();

            finalDescription= ytResponse.items[0].snippet.description
            output.value += '\nDescription captured from video:\n' +finalDescription + '\n'
            console.log(ytResponse)
            
        } catch (error) {
            window.alert ('Something went wrong, please try again.' + error);
            document.getElementById('loadingindicator').classList.add('d-none') //hide loading
            return}
        }
    }


    else { window.alert ('Unkown source: please check your URL and only use videos from Youtube, TikTok, or Instagram.'); 
        document.getElementById('loadingindicator').classList.add('d-none') //hide loading
        return}

    
    

    document.getElementById('loadingindicator').classList.add('d-none')
}



function theme() {
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme','light')
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-bs-theme','dark')
        localStorage.setItem('theme', 'dark');
    }
    
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
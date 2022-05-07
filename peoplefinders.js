const API_URL = 'https://randomuser.me/api'
const personContainer = document.getElementById('person-cards')


/**
 * we have made two version sof our data because we still need the original data
 everytime the user refreshes or adds a filter, this way it is easy to fetch the original data

 */
let originalData = []
let data = []

/**
 * This function will get data from randomuser.me API and store it in 
 * variables 'data' and 'originalData' which will then be used to display the data on the screen
 like names, images, age, DOB etc
 */
async function fetchData (number) {
  // number should not be lesser than zero
  if (number >= 0) {
    // for this assignment we will be taking 40 users as a standard, and here, we are checking if the number entered is greater than the number displayed on the screen, if yes, then more data will have to be brought from the API
    if (number > originalData.length) {
      const response = await fetch(API_URL + '?results=' + number)
      const jsonResponse = await response.json()

      originalData = jsonResponse.results

      console.log(originalData)
    }

    // we are 
    data = originalData.slice(0, number)
  }
}

/**
 * This function will set the greeting for a random user generated using API
 */
async function setGreeting () {
  // If we don't provide '?results=' in fetch, then we get data for a single person
  const response = await fetch(API_URL)
  const jsonResponse = await response.json()

  const person = jsonResponse.results[0]

  const greetingTag = document.getElementById('greeting')
  greetingTag.innerText = 'Hey! ' + person.name.first + ' ' + person.name.last + ' ' +'welcome to people finders!'
  

}

/**
 * This function will display the data present in the variable 'data'
 */
function displayData () {
  // Clear the contents of 'personContainer' before setting new data to avoid duplication
  personContainer.innerHTML = ""

  // Iterate over every element in variable 'data' and create card for them
  for (const personData of data) {
    createPersonCard(personData)
  }
}

/**
 * This function will create a extra information div
 * We can display things like age, dob, gender, etc using this
 * The first parameter 'title' will be displayed on first line
 * The second parameter 'value' will be displayed on second line
 */
function createCardBottom (title, value) {
  const container = document.createElement('div')
  container.classList.add('card_bottom')

  const innerContainer = document.createElement('div')

  const titleTag = document.createElement('p')
  titleTag.innerText = title

  const valueTag = document.createElement('p')
  valueTag.innerText = value
//following lines mean appending or affixing the title and value to the existing title and value tags ( in inner container)
  innerContainer.append(titleTag)
  innerContainer.append(valueTag)

  container.append(innerContainer)
//to return the updated contents of the container
  return container
}

/**
 * This function will create a card for the person provided as a parameter
 */
function createPersonCard (personData) {
  const personCard = document.createElement('div')
  personCard.classList.add('person_card')
  personCard.style.backgroundColor = Color()
//this displays the name of the user, in h2 which is a heading sizze, this will be diplayed in the top center of the card
  const nameTag = document.createElement('h2')
  nameTag.innerText = personData.name.title + ' ' + personData.name.first + ' ' + personData.name.last
//this displays the location ( coutnry and city )of the user in h4 which is smaller heading size than h2, this come above the image
  const placeTag = document.createElement('h4')
  placeTag.innerText = personData.location.city + ', ' + personData.location.country
//this is importing the image if the user from the API 
  const personImage = document.createElement('img')
  personImage.src = personData.picture.large
//the h2, h4, and img have all been styled in the css file and included in the html inside divs 

//following lines mean appending or affixing the name tag, image tag and the location tag
  personCard.append(nameTag)
  personCard.append(placeTag)
  personCard.append(personImage)
// creating the lower half of thew card with the information like the email, dat eof birth , age, gender, and location and while importing from the API we are simultaneously appending the respective class/object
  const emailTag = createCardBottom( personData.email,"")
  personCard.append(emailTag)

  const bdayTag = createCardBottom(new Date(personData.dob.date).toLocaleDateString(),"")
  personCard.append(bdayTag)

  const ageTag = createCardBottom(personData.dob.age,"")
  personCard.append(ageTag)

  const locationTag = createCardBottom(personData.gender,"")
  personCard.append(locationTag)

  const phoneTag = createCardBottom(personData.phone,"")
  personCard.append(phoneTag)

  personContainer.append(personCard)
}

/**
 * This is the function which will be responsible for the filter bar.  it contanis all the buttons provided
 */
function setupFilters () {
  const personnumberInput = document.getElementById('people-number')
  personnumberInput.addEventListener('input', (e) => {
    const number = e.target.value
    fetchData(number).then(function () {
      displayData()
    })
  })

//this is the show all filter, there is a button for which the onclick function is used and then the display data function is called to print the final data
  const showAll = document.getElementById('filter-show-all')
  showAll.onclick = function () {
    data = originalData
    displayData()
  }

  const showMale = document.getElementById('filter-show-male')
  showMale.onclick = function () {
    // This will return only the male population in the API
    //
    // The filter function will show the elements of the array that fulfill the condition 
    // 
    data = originalData.filter(function (val) { return val.gender === 'male' })
    displayData()
  }

  const showFemale = document.getElementById('filter-show-female')
  showFemale.onclick = function () {
    // This will filter show only female people on the API
    data = originalData.filter(function (val) { return val.gender === 'female' })
    displayData()
  }

  const sortFirstName = document.getElementById('filter-sort-first-name')
  sortFirstName.onclick = function () {
    // This will sort 'originalData' on the property 'name.first'
    // localeCompare will help us sort the data by comparing 2 strings
    //
    // The sort function will compare all elements in an array. If its compare function return 0, that indicates that
    // the elements are equal. If it return -1, then then first element is smaller than second. If it returns 1 then
    // the first element is larger than the second.
    //
    // This will check the data in the original file and filter and arrange the first name alphabetically on the first letter of the first name
    data = originalData.sort(function (a, b) { return a.name.first.localeCompare(b.name.first) })
    displayData()
  }


  const sortAge = document.getElementById('filter-sort-age')
  sortAge.onclick = function () {
    // This will check the data in the original file and filter and arrange the ages of the users in ascending order
    data = originalData.sort(function (a, b) { return a.dob.age - b.dob.age })
    displayData()
  }

  
}

//this is to set the colour for our person cards
function Color () {
 const hue = Math.floor(Math.random() * 100) ; 
  return `hsl(${hue},40%,0%)`;
}

// welcome message for the random user is showed
setGreeting().then(() => {
  // we start with a set of 40 users 
  fetchData(40).then(() => {
    // After the data is fetched fromthe API, the display data and filter fucntion is called
    displayData()
    setupFilters()
  })
})


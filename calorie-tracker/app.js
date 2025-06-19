// array to store all meals (each meal has food, calories, and macros)
let meals = [];

// this runs as soon as the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
  // try to get stored meals from localstorage
  const stored = localStorage.getItem('meals');
  if (stored) {
    // if stored meals exist, parse them from string to array
    meals = JSON.parse(stored);

    // display each meal in the list
    meals.forEach(displaymeal);

    // update the total calories and macros display
    updatetotal();

    // load the daily goal if it was previously saved
    loadgoal();
  }
});

// this function runs when you click the “add meal” button
function addmeal() {
  // grab values from the input fields
  const food = document.getElementById('food').value;
  const calories = parseInt(document.getElementById('calories').value);
  const protein = parseInt(document.getElementById('protein').value);
  const carbs = parseInt(document.getElementById('carbs').value);
  const fat = parseInt(document.getElementById('fat').value);

  // don’t continue if either food or calories is empty or invalid
  if (!food || isNaN(calories)) return;

  // create a new meal object with a unique id and macros
  const meal = {
    id: Date.now(),
    food: food,
    calories: calories,
    protein: isNaN(protein) ? 0 : protein,
    carbs: isNaN(carbs) ? 0 : carbs,
    fat: isNaN(fat) ? 0 : fat
  };

  // add this meal to the array
  meals.push(meal);

  // save the updated meals list to localstorage (as a string)
  localStorage.setItem('meals', JSON.stringify(meals));

  // display the new meal on the screen
  displaymeal(meal);

  // recalculate the total calories and macros
  updatetotal();

  // clear the input fields
  document.getElementById('food').value = '';
  document.getElementById('calories').value = '';
  document.getElementById('protein').value = '';
  document.getElementById('carbs').value = '';
  document.getElementById('fat').value = '';
}

// this function displays one meal item on the page
function displaymeal(meal) {
  const list = document.getElementById('meal-list');

  // create a new <li> element
  const item = document.createElement('li');

  // set the html to show food name, calories, macros, and delete button
  item.innerHTML = `
    ${meal.food} - ${meal.calories} cal
    (p: ${meal.protein}g / c: ${meal.carbs}g / f: ${meal.fat}g)
    <button onclick="deletemeal(${meal.id})">x</button>
  `;

  // add it to the list on the page
  list.appendChild(item);
}

// this function calculates and updates the total calories and macros
function updatetotal() {
  const total = meals.reduce((sum, m) => sum + m.calories, 0);
  const protein = meals.reduce((sum, m) => sum + m.protein, 0);
  const carbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const fat = meals.reduce((sum, m) => sum + m.fat, 0);

  document.getElementById('total').textContent = total;
  document.getElementById('protein-total').textContent = protein;
  document.getElementById('carbs-total').textContent = carbs;
  document.getElementById('fat-total').textContent = fat;


  // calculate and update progress bar
  const goal = parseInt(localStorage.getItem('goal')) || 0;
  const percent = goal > 0 ? Math.min((total / goal) * 100, 100) : 0;
  document.getElementById('calorie-progress').style.width = `${percent}%`;

  // optionally log macros
  console.log(`protein: ${protein}g, carbs: ${carbs}g, fat: ${fat}g`);
}

// function to delete a meal by its id
function deletemeal(id) {
  // remove the meal from the array
  meals = meals.filter(m => m.id !== id);

  // save the updated list
  localStorage.setItem('meals', JSON.stringify(meals));

  // clear and re-render the list
  document.getElementById('meal-list').innerHTML = '';
  meals.forEach(displaymeal);

  // update the totals
  updatetotal();
}

function resetday() {
  // clear all meals from memory
  meals = [];

  // remove from localstorage
  localStorage.removeItem('meals');

  // clear meal list from the page
  document.getElementById('meal-list').innerHTML = '';

  // reset calorie + macro totals
  updatetotal();
}


// listen for input changes in the daily goal field
document.getElementById('goal').addEventListener('input', e => {
  const val = parseInt(e.target.value);

  // only save valid numbers
  if (!isNaN(val)) {
    // save to localstorage
    localStorage.setItem('goal', val);

    // update the displayed goal
    document.getElementById('display-goal').textContent = val;
  }
});

// load the saved goal when the app starts
function loadgoal() {
  const g = localStorage.getItem('goal');

  // if a goal was saved before, show it in the input and header
  if (g) {
    document.getElementById('goal').value = g;
    document.getElementById('display-goal').textContent = g;
  }
}

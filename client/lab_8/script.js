function getRandomIntInclusive(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
  
function injectHTML(list){
  console.log('fired injectHTML');
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = "";
  list.forEach((item, index) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  })
}

function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}
  
function cutRestaruantList (list){
  console.log('fired cut list');
  const range = [...Array(15).keys()];
  return newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  });
}

function initMap(){
  const carto = L.map('map').setView([38.9897, -76.9378], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(carto);
  return carto;
}
 
function markerPlace(array, map){
  console.log('array for markers', array);

  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  array.forEach((item) => {
    console.log('markerPlace', item);
    const {coordinates} = item.geocoded_column_1;
    L.marker([coordinates[1], coordinates[0]]).addTo(map);
  });
}

async function mainEvent() {
  const mainForm = document.querySelector('.main_form');
  const filterDataButton = document.querySelector('#filter');
  const loadDataButton = document.querySelector('#data_load');
  const generateListButton = document.querySelector('#generate');
  const textField = document.querySelector('#resto');

  const loadAnimation = document.querySelector('#data_load_animation');
  loadAnimation.style.display = "none";
  generateListButton.classList.add("hidden");

  const carto = initMap();

  let storedList = [];

  let currentList = [];
  
  loadDataButton.addEventListener('click', async (submitEvent) => {
    console.log('loading data'); 
    loadAnimation.style.display = "inline-block";
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

    storedList = await results.json();
    if(storedList.length > 0){
      generateListButton.classList.remove("hidden");
    }

    loadAnimation.style.display = "none";
    console.table(storedList);
  });

  filterDataButton.addEventListener('click', (event) => {
    console.log("clicked filterDataButton");
    
    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);

    console.log(formProps);

    const newList = filterList(currentList, formProps.resto);
    console.log(newList);
    injectHTML(newList);
    markerPlace(newList, carto);
  });

  generateListButton.addEventListener('click', (event) => {
    console.log('generate new list');
    currentList = cutRestaruantList(storedList);
    injectHTML(currentList);
    markerPlace(currentList, carto);
  });

  textField.addEventListener('input', (event) => {
      console.log('input', event.target.value);
      const newList = filterList(currentList, event.target.value);
      console.log(newList);
      injectHTML(newList);
      markerPlace(newList, carto);
  });
}
  
document.addEventListener('DOMContentLoaded', async () => mainEvent());
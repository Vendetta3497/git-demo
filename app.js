'use strict';
let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalHabbitId;

const bodyApp = document.querySelector('.main_wrapper')
const menu = document.querySelector('.menu__list');
const title = document.querySelector('.title');
const progressPecent = document.querySelector('.progress_persent');
const progressLine = document.querySelector('.progress__cover-bar');
const day = document.querySelector('.day_sections')
const wrapperDays = document.querySelector('.wrapper_days');
const popupButton = document.querySelector('.add_button')
const popup = document.querySelector('.popup');
const popupCrossButton = document.querySelector('.popup__cross')
const addButton = document.querySelector('.add_button');

addButton.addEventListener('click', () => change())

function change() {
   popup.classList.add('popup_active')
   bodyApp.style.opacity = '0.6'

}

popupCrossButton.addEventListener('click', () => change2())

function change2() {
   popup.classList.remove('popup_active')
   bodyApp.style.opacity = '1'
}


const formButton = document.querySelector('.form_day__button');


function loadData() {
   const habbitString = localStorage.getItem(HABBIT_KEY)
   const habbitArray = JSON.parse(habbitString)
   if (Array.isArray(habbitArray)) {
      habbits = habbitArray;
   }
}

function saveData() {
   localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function rerenderMenu(activeHabbit) {
   for (const habbit of habbits) {
      const existed = document.querySelector(`[habbit-id="${habbit.id}"]`);
      if (!existed) {
         const button = document.createElement('button');
         button.className = 'menu__item';
         button.setAttribute('habbit-id', habbit.id)
         button.innerHTML = `<img class="menu__item__img" src="img/${habbit.icon}.svg" alt="${habbit.name}">`;
         button.addEventListener('click', () => {
            // console.log(habbit.id);
            rerender(habbit.id)
         })
            
         if (activeHabbit.id === habbit.id) {
            button.classList.add('menu__item_active');
         }
         menu.appendChild(button);
         continue;
      }
      if (activeHabbit.id === habbit.id) {
         existed.classList.add('menu__item_active');
      } else {
         existed.classList.remove('menu__item_active');
      }
   }
}

function rerenderHead(activeHabbit) {
   title.innerHTML = activeHabbit.name;
   // console.log(activeHabbit);
   const progress = activeHabbit.days.length;
   if (progress <= activeHabbit.target) {
      progressPecent.innerHTML = Math.floor(progress / activeHabbit.target * 100)+ '%';
      progressLine.style.width = progress / activeHabbit.target * 100 + '%';
   }
   else {
      progressPecent.innerHTML = '100%';
      progressLine.style.width = '100%';
   }
}

function rerenderBody(activeHabbit) {
   wrapperDays.innerHTML = ''
   for (const index in activeHabbit.days) {
      const createDay = document.createElement('div');
      createDay.classList.add('day_sections');
      createDay.innerHTML = `
      <span class="day_sections__count">
      Day ${Number(index) + 1}
      </span>
      <span class="day_sections__comment">
      ${activeHabbit.days[index].comment}
      </span>
      <button class="day_sections__button" onclick="removeDay(${index})">
         <img src="img/delete.svg" alt="delete">
      </button>`
      wrapperDays.appendChild(createDay);
}
}


function rerender(activeHabbitId) {
   globalHabbitId = activeHabbitId;
   const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
   rerenderMenu(activeHabbit);
   rerenderHead(activeHabbit);
   rerenderBody(activeHabbit);

}

// function createDay(event) {
//    event.preventDefault();
//    const form = event.target
//    const data = new FormData(form);
//    console.log(data.get('comment'));
//    const comment = data.get('comment');
//    form['comment'].classList.remove('remove')
//    if (!comment) {
//       form['comment'].classList.add('remove')
//       return;
//    }
// }

formButton.addEventListener('click', () => createDay2())

function createDay2() {
   const comment = document.querySelector('.form_day__comment').value;
   const form = document.querySelector('.form_day__comment');
   form.classList.remove('remove');
   if (!comment) {
      form.classList.add('remove');
      return;
   }
   console.log(globalHabbitId);
   habbits = habbits.map(el => {
         if (el.id === globalHabbitId) {
            return {
               ...el,
               days: el.days.concat([{comment : comment}]),
            }
      }
      return el;
   })
   form.value = '';
   rerender(globalHabbitId)
   saveData()
}
   


function removeDay(index) {
   console.log(index);
   habbits = habbits.map(el => {
      if (el.id === globalHabbitId) {
         el.days.splice(index, 1)
         return {
            ...el,
            days: el.days
         }
      }
      return el;
   })
   rerender(globalHabbitId)
   saveData()
}

function setIcon(context, icon) {
   document.querySelector('input[name="icon"]').value = icon;
   const activeIcon =  document.querySelector('.icon.icon_active')
   activeIcon.classList.remove('icon_active');
   context.classList.add('icon_active')
}

function addHabbits(event) {
   event.preventDefault();
   const form = event.target
   const data = new FormData(form)
   const icon = data.get('icon');
   const name = data.get('name');
   form['name'].classList.remove('remove')
   if (!name) {
      form['name'].classList.add('remove');
      return
   }
   const target = data.get('target');
   form['target'].classList.remove('remove')
   if (!target) {
   form['target'].classList.add('remove');
      return
   }
   const newElement = {
      id: habbits.length + 1,
      icon: icon,
      name: name,
      target: target,
      days: []
   }

   habbits.push(newElement)

   rerender(globalHabbitId)
   saveData()
}

(() => {
   loadData();
   rerender(habbits[0].id);
})();

console.log(habbits);

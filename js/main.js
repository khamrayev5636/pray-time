const elBody = document.querySelector("body");
const elSwitchButton = document.querySelector(".site-header__switch");

// Form start DOM
const elForm = document.querySelector(".js-pray__form");
const elSelectRegion = elForm.querySelector(".js-pray__region");
const elSelectMoth = elForm.querySelector(".js-pray__month");

// Table start DOM
const elPrayWrapper = document.querySelector(".js-pray__wrapper");
const elPrayWrapperRegion = document.querySelector(".js-wrapper__region");
const elPrayTbody = document.querySelector(".pray-tbody");

// Day prayList start DOM
const elPrayList = document.querySelector(".js-pray__list");
const elPrayListRegion = document.querySelector(".js-pray__title");
const elPrayListYear = document.querySelector(".js-list__year");

// New Date()

const now = new Date();

// console.log(now.getHours() + ":" + now.getMinutes());

if(now.getHours() < 10 && now.getMinutes() < 10){
    elPrayListYear.textContent = `0${now.getHours()}:0${now.getMinutes()}`;
}else if(now.getHours() < 10) {
    elPrayListYear.textContent = `0${now.getHours()}:${now.getMinutes()}`;
}else if(now.getHours() > 10 && now.getMinutes() < 10) {
    elPrayListYear.textContent = `${now.getHours()}:0${now.getMinutes()}`;
}else {
    elPrayListYear.textContent = now.getHours() + ":" + now.getMinutes();
}


// Dark Light Button start

elSwitchButton.addEventListener("click" , ()=> {
    elBody.classList.toggle("dark")
    elSwitchButton.classList.toggle("site-header__switch--js")
});

// Render function day (kunlik chiqaradigan funksiya);


function prayRanderDay(arrs) {
    
    elPrayList.innerHTML = ""
    
    const elPrayTempDay = document.querySelector(".pray-temp__day").content;
    const elPrayDayFragment = document.createDocumentFragment();
    
    const elCloneDay = elPrayTempDay.cloneNode(true);
    
    elCloneDay.querySelector(".js-pray__title").textContent = arrs.region;
    elCloneDay.querySelector(".js-pray__date--time").textContent = arrs.date;
    elCloneDay.querySelector(".js-pray__weekday").textContent = arrs.weekday;
    elCloneDay.querySelector(".pray-day__sunrise").textContent = arrs.times.tong_saharlik;
    elCloneDay.querySelector(".pray-region__sunrise").textContent = arrs.region;
    elCloneDay.querySelector(".pray-day__fajr").textContent = arrs.times.quyosh;
    elCloneDay.querySelector(".pray-region__fajr").textContent = arrs.region;
    elCloneDay.querySelector(".pray-day__zuxr").textContent = arrs.times.peshin;
    elCloneDay.querySelector(".pray-region__zuxr").textContent = arrs.region;
    elCloneDay.querySelector(".pray-day__asr").textContent = arrs.times.asr;
    elCloneDay.querySelector(".pray-region__asr").textContent = arrs.region;
    elCloneDay.querySelector(".pray-day__magrib").textContent = arrs.times.shom_iftor;
    elCloneDay.querySelector(".pray-region__magrib").textContent = arrs.region;
    elCloneDay.querySelector(".pray-day__isha").textContent = arrs.times.hufton;
    elCloneDay.querySelector(".pray-region__isha").textContent = arrs.region;
    
    elPrayDayFragment.appendChild(elCloneDay)
    elPrayList.appendChild(elPrayDayFragment)
    
}

// Async function mainDayFunc

async function mainDayFunc(url) {
    
    try {
        
        const res = await fetch(url)
        const data = await res.json();
        
        // console.log(data);   
        prayRanderDay(data)
        
    } catch (error) {
        elPrayList.innerHTML = "Not found 404"
    }
}

mainDayFunc(`https://islomapi.uz/api/present/day?region=${elSelectRegion.value}`);

// Render Function week end month (oylarini Domga render qib beradigan funksiya)

function prayRander(arr , node) {
    
    const elPrayTemplate = document.querySelector(".pray-temp").content;
    const elPrayFragment = document.createDocumentFragment();
    
    arr.forEach(item => {
        
        elPrayWrapperRegion.textContent = item.region;
        
        const elPrayClone = elPrayTemplate.cloneNode(true);
        
        elPrayClone.querySelector(".pray-date").textContent = item.date.slice(0,10);
        elPrayClone.querySelector(".pray-fajr").textContent = item.times.tong_saharlik;
        elPrayClone.querySelector(".pray-sun").textContent = item.times.quyosh;
        elPrayClone.querySelector(".pray-zuxr").textContent = item.times.peshin;
        elPrayClone.querySelector(".pray-asr").textContent = item.times.asr;
        elPrayClone.querySelector(".pray-magrib").textContent = item.times.shom_iftor;
        elPrayClone.querySelector(".pray-isha").textContent = item.times.hufton;
        elPrayClone.querySelector(".pray-day").textContent = item.weekday;
        
        if(item.weekday == "Juma") {
            elPrayClone.querySelector(".pray-tr").style.backgroundColor = "#14dd2f";
        }
        
        elPrayFragment.appendChild(elPrayClone);
        
    });
    
    node.appendChild(elPrayFragment);
}

// Asny function

async function getPrayRegion(url) {
    
    try {
        const res = await fetch(url);
        
        const data = await res.json();
        // console.log(data);
        prayRander(data , elPrayTbody)
    } catch (error) {
        elPrayTbody.textContent = "Not Found 404"
    }
    
}

// Elform submit function

elForm.addEventListener("submit" , (evt) => {
    evt.preventDefault()
    
    elPrayTbody.innerHTML = "";
    
    
    const elSelectRegionValue = elSelectRegion.value.trim();
    const elSelectMothValue = elSelectMoth.value.trim();
    
    if(elSelectMothValue == "month") {
        elPrayList.style.display = "none"
        elPrayWrapper.style.display = "block"
        getPrayRegion(`https://islomapi.uz/api/monthly?region=${elSelectRegionValue}&month=5`); 
    }
    
    if(elSelectMothValue == "week") {
        elPrayList.style.display = "none"
        elPrayWrapper.style.display = "block"
        getPrayRegion(`https://islomapi.uz/api/present/week?region=${elSelectRegionValue}`)
    }
    
    if(elSelectMothValue == "day") {
        elPrayList.style.display = "block"
        elPrayWrapper.style.display = "none"
        mainDayFunc(`https://islomapi.uz/api/present/day?region=${elSelectRegionValue}`)
    }
})

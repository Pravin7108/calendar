const holidays=[
    {hdate:"04-04-2023",
    holiday:"Mahavir Jayanthi",
},
    {hdate:"08-04-2023",
    holiday:"Birthday",
},
{
    hdate:"07-04-2023",
    holiday:"Good Friday",
},
{
    hdate:"14-04-2023",
    holiday:"Tamil New Year",
}];

const calendar=document.querySelector('#calendar');
let navigation=0;
let clicked=null;
const monthBanner=document.querySelector('#month');
let events=localStorage.getItem("events")?JSON.parse(localStorage.getItem("events")):[];
const weekdays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function loadCalendar(){
    const dt=new Date();

    if(navigation!=0){
        dt.setMonth(new Date().getMonth()+navigation);
    }
    const day=dt.getDate();
    const month=dt.getMonth();
    const year=dt.getFullYear();
    monthBanner.innerText=`${dt.toLocaleDateString("en-us",{
        month:"long",
    })} ${year}`;

    calendar.innerHTML="";
    const dayInMonth=new Date(year,month+1,0).getDate();
    const firstDayOfMonth=new Date(year,month,1);

    const dateText=firstDayOfMonth.toLocaleDateString("en-us",{
        weekday:"long",
        year:"numeric",
        month:"numeric",
        day:"numeric"
    });
    const dayString = dateText.split(", ")[0];
    const emptyDays = weekdays.indexOf(dayString);

    for(let i=1;i<=dayInMonth + emptyDays ;i++){
        const dayBox=document.createElement('div');
        dayBox.classList.add("day");
        const monthVal=(month +1)<10?"0"+(month+1):(month+1);
        const dateVal=(i- emptyDays)<10?"0"+(i- emptyDays):(i - emptyDays);
        const dateText=`${dateVal}-${monthVal}-${year}`;
        
        if(i>emptyDays){
            dayBox.innerText=i-emptyDays;
            
            const eventOfTheDay=events.find((e)=>e.date==dateText);

            const holidayOfTheDay=holidays.find((e)=>e.hdate==dateText);

            if(i - emptyDays === day && navigation==0){
                dayBox.id="currentDay";
            }

            // Events but not worked
            if(eventOfTheDay){
                const eventDiv=document.createElement("div");
                eventDiv.classList.add("event");
                eventDiv.innerText=eventOfTheDay.title;
                dayBox.appendChild(eventDiv);
            }

            // Holidays -perfectly worked
            if(holidayOfTheDay){
                const eventDiv=document.createElement("div");
                eventDiv.classList.add("event");
                eventDiv.classList.add("holiday");
                eventDiv.innerText=holidayOfTheDay.holiday;
                dayBox.appendChild(eventDiv);
            }

            dayBox.addEventListener("click",()=>{
                showModal(dateText);
            });
        }else{
            dayBox.classList.add("plain");
        }
        calendar.appendChild(dayBox);
    }
}
function buttons(){
    const btnBack=document.querySelector('#btnBack');
    const btnNext=document.querySelector('#btnNext');
    const btnDelete=document.querySelector('#btnDelete');
    const btnSave=document.querySelector('#btnSave');
    const txtTitle=document.querySelector('#txtTitle');
    btnBack.addEventListener('click',()=>{
        navigation--;
        loadCalendar();
    });
    
    btnNext.addEventListener('click',()=>{
        navigation++;
        loadCalendar();
    });

    btnDelete.addEventListener("click",()=>{
        events=events.filter((e)=>e.date!==clicked);
        localStorage.setItem("events",JSON.stringify(events));
        closeModal();
    });

    btnSave.addEventListener("click",()=>{
        if(txtTitle.value){
            txtTitle.classList.remove("error");
            events.push({
                date:clicked,
                title:txtTitle.value.trim(),
            });
            txtTitle.value="";
            localStorage.setItem("events",JSON.stringify(events));
            closeModal();
        }else{
            txtTitle.classList.add("error");
        }
    });
}

const modal=document.querySelector("#modal");
const viewEventForm=document.querySelector('#viewEvent');
const addEventForm=document.querySelector('#addEvent');

function showModal(dateText){
    clicked=dateText;
    const eventOfTheDay=events.find((e)=>e.date==dateText);
    if(eventOfTheDay){
        // event already present
        document.querySelector("#eventText").innerText=eventOfTheDay.title;
        viewEventForm.style.display="block";
    }else{
        // add new event
        addEventForm.style.display="block";
    }
    modal.style.display="block";
}

// close modal
const closeButtons=document.querySelectorAll('.btnClose');
closeButtons.forEach((btn)=>{
    btn.addEventListener("click",closeModal);
});
function closeModal(){
    viewEventForm.style.display="none";
    addEventForm.style.display="none";
    modal.style.display="none";
    clicked=null;
    loadCalendar();
}
buttons();
loadCalendar();

/*
1. Add Event
2. Delete event
3. Update localstorage
*/
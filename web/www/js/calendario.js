const yy = new Date().getFullYear();
let actualYear = new Date().getFullYear();
let actualMonth = new Date().getMonth();
let actualDay = new Date().getDate()
let events=[];
yearSelect=document.getElementById('yearSelect');
for(i=actualYear+5; i > actualYear-5; i--){
    li= document.createElement('li');
    a= document.createElement('a');
    a.innerText=i;
    li.prepend(a);
    yearSelect.prepend(li);
}

function drawCalendar(){
    document.querySelector('.calendar').innerHTML  ='';
    yearLabel=document.getElementById('yearLabel');
    yearLabel.innerHTML=actualYear+'<i class="material-icons right">arrow_drop_down</i>';
    locale = 'es'
    const intlForMonths = new Intl.DateTimeFormat(locale, { month: 'long' })
    const month = intlForMonths.format(new Date(actualYear, actualMonth))
    const months = [...Array(12).keys()]
    const intlForWeeks = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    const weekDays = [...Array(7).keys()].map((dayIndex) =>
        intlForWeeks.format(new Date(2020, 2, dayIndex + 1))
    )
    let tabs = `<div class="col s12"><ul class="tabs tabs-fixed-width">`;
    const calendar = months.map((monthIndex) => {
        const monthName = intlForMonths.format(new Date(actualYear, monthIndex))
        const nextMonthIndex = (monthIndex + 1) % 12
        const daysOfMonth = new Date(actualYear, nextMonthIndex, 0).getDate()
        const startsOn = new Date(actualYear, monthIndex, 1).getDay()
        tabs+=`<li class="tab"><a class="unamBlue-text text-darken-1 ${(month===monthName)?'active':''}"  href="#${monthName}">${monthName}</a></li>`;
        mm= (monthIndex+1).toString().padStart(2, "0");
        return {
        daysOfMonth,
        monthName,
        startsOn,
        mm
        }
    })
    tabs+=`</ul></div>`;
    const html = calendar
    .map(({ daysOfMonth, monthName, startsOn ,mm}) => {
    const days = [...Array(daysOfMonth).keys()]
    const firstDayAttributes = `class='first-day' style='--first-day-start: ${startsOn}'`
    const htmlDaysName = weekDays
        .map((dayName) => `<li class='day-name'>${dayName}</li>`)
        .join('')
    const htmlDays = days
        .map(
        (day, index) =>
            `<li ${index === 0 ? firstDayAttributes : ''}><div class="dayContent" date="${actualYear+'-'+mm+'-'+(day+1).toString().padStart(2, "0")}"><span class="day ${(actualDay===(day + 1)&&month===monthName)?'gold-text':''}">${day + 1}</span><div class="events"></div></div></li>`
        )
        .join('')
    return `<div id="${monthName}" class=" col s12"><h4>${monthName}</h4><ol>${htmlDaysName}${htmlDays}</ol></div>`
    })
    .join('')

    document.querySelector('.calendar').innerHTML = tabs+ html
    $(document).ready(function(){$('.tabs').tabs();});
}
function drawWeek(startDay = new Date()){
    let week = document.getElementById('calendarSemana');
    week.innerHTML='';
    let daysContent='';
    let date= new Date(startDay);
    let year= date.getFullYear();
    let start = new Date(startDay);
    start.setDate(start.getDate() -( (date.getDay()==6)?-1:date.getDay()));
    end = new Date(start.getFullYear(),start.getMonth(),start.getDate());
    end.setDate(start.getDate() +6);
    const locale = 'es'
    const intlForMonths = new Intl.DateTimeFormat(locale, { month: 'long' })
    const month = intlForMonths.format(new Date(year, start.getMonth()))
    const months = [...Array(12).keys()]

    const intlForWeeks = new Intl.DateTimeFormat(locale, { weekday: 'long' })
    const weekDays = [...Array(7).keys()].map((dayIndex) =>
        intlForWeeks.format(new Date(2020, 2, dayIndex + 1))
    )
    htmlDaysName = weekDays.map((dayName) => `<div class='week-day-name'>${dayName}</div>`).join('')

    let loop = new Date(start.getFullYear(),start.getMonth(),start.getDate());

    while (loop <= end) {
        daysContent+= `<div class="weekDay grey lighten-4 ${(date.getDate()===(loop.getDate())&&loop.getMonth()===date.getMonth())?'gold-text':''} " day="${loop.getFullYear()+'-'+(loop.getMonth()+1).toString().padStart(2, "0")+'-'+(loop.getDate()).toString().padStart(2, "0")}"><span>${loop.getDate()}</span><div class="weekHours"></div></div>`;
        //increment
        let newDate = loop.setDate(loop.getDate() + 1);
        loop = new Date(loop.getFullYear(),loop.getMonth(),loop.getDate());
    }
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() + 1);

    week.innerHTML+=`<div class="row center-align"><div class="col s3"><a class="changeWeek btn-floating btn waves-effect waves-light unamBlue" date="${start.getFullYear()+'-'+(start.getMonth()+1).toString().padStart(2, "0")+'-'+(start.getDate()).toString().padStart(2, "0")}"><i class="material-icons">navigate_before</i></a></div><h4 class="col s6">${month} - ${year}<h4><div class="col s3"><a class="changeWeek btn-floating btn waves-effect waves-light unamBlue" date="${end.getFullYear()+'-'+(end.getMonth()+1).toString().padStart(2, "0")+'-'+(end.getDate()).toString().padStart(2, "0")}"><i class="material-icons">navigate_next</i></a></div></div>`;
    week.innerHTML+=`<div class="week unamBlue"><div class="week-day-name">Hora</div>`+htmlDaysName+`</div><div class=" weekSchedule grey lighten-4"><div class="weekDay"><span> .</span><div id="hoursColummn"></div></div>`+daysContent+'<div>'
    document.querySelectorAll('.changeWeek').forEach(element => {
        element.addEventListener('click',function(event){
            let date= event.target.parentNode.getAttribute('date');
            drawWeek(date);
        });
    });
    hours= document.getElementById('hoursColummn');
    for(i=0;i<=24;i++)
        hours.innerHTML+=`<div class="weekHour" hora="${i}">${i}:00h</div>`;
    document.querySelectorAll('.weekHours').forEach(element=>{
        for(i=0;i<=24;i++){
            element.innerHTML+=`<div class="weekHour" hora="${i}"></div>`;
        }
    });
    loadLocalEvents(filters);
}
function drawDay(startDay = null){
    dayConainer= document.getElementById('Dia');
    locale = 'es'
    dayConainer.innerHTML='';
    if (startDay!==null){
        date= new Date(startDay);
        start = new Date(startDay);
        end=new Date(startDay);
        date.setDate(date.getDate() + 1);
        start.setDate(start.getDate());
        end.setDate(end.getDate() + 2);

    }
    else{
        date= new Date();
        start = new Date();
        end=new Date();
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() + 1);
    }
    let year= date.getFullYear();
    const intlForMonths = new Intl.DateTimeFormat(locale, { month: 'long' })
    const month = intlForMonths.format(new Date(year, date.getMonth()))
    const months = [...Array(12).keys()]

    const intlForWeeks = new Intl.DateTimeFormat(locale, { weekday: 'short' })
    const weekDays = [...Array(7).keys()].map((dayIndex) =>
        intlForWeeks.format(new Date(2020, 2, dayIndex + 1))
    )

    dayConainer.innerHTML+=`<div class="row center-align">
        <div class="col s3"><a class="changeDay btn-floating btn waves-effect waves-light unamBlue" date="${start.getFullYear()+'-'+(start.getMonth()+1).toString().padStart(2, "0")+'-'+(start.getDate()).toString().padStart(2, "0")}"><i class="material-icons">navigate_before</i></a></div>
        <h4 class="col s6">${date.getDate()} - ${month} - ${year}<h4>
        <div class="col s3"><a class="changeDay btn-floating btn waves-effect waves-light unamBlue" date="${end.getFullYear()+'-'+(end.getMonth()+1).toString().padStart(2, "0")+'-'+(end.getDate()).toString().padStart(2, "0")}"><i class="material-icons">navigate_next</i></a></div>
    </div>
    <div class="row grey lighten-4">
        <div id="dayHours" class="col s1"></div>
        <div id="dayContent" date="${(date.getFullYear()+'-'+(date.getMonth()+1).toString().padStart(2, '0')+'-'+date.getDate().toString().padStart(2, '0'))}" class="col s11"></div>
    </div>`;
    dayHours = document.getElementById('dayHours');
    dayContent = document.getElementById('dayContent');
    for(i=0;i<=24;i++){
        dayHours.innerHTML+=`<div class="weekHour" hora="${i}">${i}:00h</div>`;
        dayContent.innerHTML+=`<div class="weekHour flex " hora="${i}"></div>`;
    }
    document.querySelectorAll('.changeDay').forEach(element => {
        element.addEventListener('click',function(event){
            let date= event.target.parentNode.getAttribute('date');
            drawDay(date);
        });
    });
    loadLocalEvents(filters);
}
function loadLocalEvents(object={name:'',sede:''}){
    document.querySelectorAll('#Dia #dayContent .weekHour').forEach(e=> {
        e.innerHTML="";
      });
    document.querySelectorAll('.weekDay .weekHour').forEach(e=> {
        if (e.parentNode.id!='hoursColummn')
            e.innerHTML="";
      });
    document.querySelectorAll('.dayContent > .events').forEach(e=> {
        e.innerHTML="";
      });
    console.log('load events');
    filerEvents=events;
    console.log(object);
    if(filerEvents.length>0)
    if(object.sede!='')
        filerEvents=filerEvents.filter(e => e.sede.toLowerCase() == object.sede.toLowerCase());
    if(object.name!='')
        filerEvents=filerEvents.filter(e => e.title.toLowerCase().includes(object.name.toLowerCase()));
    filerEvents.forEach(event => {
        datefrom = new Date(Date.parse(event.datefrom));
        dateto = new Date(Date.parse(event.dateto));
        formatedDate= datefrom.getFullYear()+'-'+(datefrom.getMonth()+1).toString().padStart(2, '0')+'-'+datefrom.getDate().toString().padStart(2, '0');
        //month
        space=document.querySelector('.dayContent[date="'+formatedDate+'"] > .events');
        time=datefrom.getHours()+':'+datefrom.getMinutes()+'h';
        space.append(doMonthPill(event,time));
        //day
        space=document.querySelector('#Dia #dayContent[date="'+formatedDate+'"] .weekHour[hora="'+(datefrom.getHours())+'"]');
        time=datefrom.getHours()+':'+datefrom.getMinutes()+'h';
        if(space)
          space.append(doDayPill(event,time))
        //week
        space=document.querySelector('.weekDay[day="'+formatedDate+'"] .weekHour[hora="'+(datefrom.getHours())+'"]');
        time=datefrom.getHours()+':'+datefrom.getMinutes()+'h';
        if(space)
          space.append(doWeekPill(event,time));

       });
       $('.tooltipped').tooltip();

}

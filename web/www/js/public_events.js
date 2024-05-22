pillColors={
  "18a4f115ca2d2e":"blue",
  "18a4f11d9168a6":"red",
  "18a4f11fe72b36":"orange",
  "18a4f121b8314e":"grey",
  "18a4f1239f3b56":"yellow",
  "18a4f1256916aa":"green",
  "18a4f1273cfdde":"purple",
  "18a4f1290f2b46":"teal",
  "18a4f12b7343c2":"cyan",
  "18a4f12d4fcf12":"light-green",
  "18a4f12fd374e6":"amber",
  "18a4f1319bf816":"deep-orange",
  "18a4f134ac49a2":" blue-grey"
};
const getNavigatorLanguage = () => {
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0];
  } else {
    return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
  }
}
function loadEvents(){
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
 $.ajax({
   type: "GET",
   url: 'api/events',
   processData: false,  // tell jQuery not to process the data
   contentType: false ,
   success: function (response) {
       events = response;
       events.forEach(event => {
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
   },
   fail:function (response) {
       console.log(response);
   },
   dataType: 'json'
 });
}
function drawEvents(){

}
function doMonthPill(event,time) {
  div=document.createElement('div');
  div.classList.add(pillColors[event.sede],"monthEvent","tooltipped");
  div.setAttribute('id_event',event.id);
  div.setAttribute('data-position','bottom');
  div.setAttribute('data-tooltip',event.title);
  div.innerText=time+" "+event.title;
  div.addEventListener("click",function name(e) {
    //date conversions
    console.log(sedes[event.sede].zona_horaria);
    dateFrom=event.datefrom+' '+sedes[event.sede].zona_horaria;
    dateFromLocal= new Date(dateFrom);
    dateTo=event.dateto+' '+sedes[event.sede].zona_horaria;
    dateToLocal= new Date(dateTo);
  
    document.getElementById('eventTitle').innerText=event.title;
    document.getElementById('eventHours').innerText=dateFrom;
    document.getElementById('eventHoursLocal').innerText=dateFromLocal.toLocaleString(getNavigatorLanguage());
    document.getElementById('eventDay').innerText=dateTo;
    document.getElementById('eventDayLocal').innerText=dateToLocal.toLocaleString(getNavigatorLanguage());
    if(validURL(event.url)){
      document.getElementById('eventUrl').href=event.url;
      document.getElementById('fbShare').href="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(event.picture);
      document.querySelector('.fb-share-button').classList.remove('hide');
    }else{
      document.getElementById('eventUrl').innerText=event.url;
      document.getElementById('eventUrl').href='#!';
      document.querySelector('.fb-share-button').classList.add('hide');
    }
    document.getElementById('eventType').value=event.type;
    document.getElementById('eventSede').innerText=  sedes[event.sede].nombre;
    document.getElementById('eventImage').src=event.picture;
    var instance = M.Modal.getInstance($('#modalDisplayEvent'));
    instance.open();
  });
  return div;

}

function doDayPill(event,time) {
  datefrom = new Date(Date.parse(event.datefrom));
  dateto = new Date(Date.parse(event.dateto));
  div=document.createElement('div');
  div.classList.add("imgDayComtent");
  img = document.createElement('img');
  size=(parseInt(dateto.getHours())-(parseInt(datefrom.getHours())));
  img.setAttribute( 'style','height:'+(15*(size+(size==1?0:1)))+'vh;');
  img.classList.add(pillColors[event.sede],"weekEvent","tooltipped");
  img.src=event.picture;
  img.setAttribute('id_event',event.id);
  img.setAttribute('data-position','bottom');
  img.setAttribute('data-tooltip',event.title);
  div.alt=time+" "+event.title;
  img.addEventListener("click",function name(e) {
    //date conversions
    console.log(sedes[event.sede].zona_horaria);
    dateFrom=event.datefrom+' '+sedes[event.sede].zona_horaria;
    dateFromLocal= new Date(dateFrom);
    dateTo=event.dateto+' '+sedes[event.sede].zona_horaria;
    dateToLocal= new Date(dateTo);
   
    document.getElementById('eventTitle').innerText=event.title;
    document.getElementById('eventHours').innerText=dateFrom;
    document.getElementById('eventHoursLocal').innerText=dateFromLocal.toLocaleString(getNavigatorLanguage());
    document.getElementById('eventDay').innerText=dateTo;
    document.getElementById('eventDayLocal').innerText=dateToLocal.toLocaleString(getNavigatorLanguage());
    if(validURL(event.url)){
      document.getElementById('eventUrl').href=event.url;
      document.getElementById('fbShare').href="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(event.picture);
      document.querySelector('.fb-share-button').classList.remove('hide');
    }else{
      document.getElementById('eventUrl').innerText=event.url;
      document.getElementById('eventUrl').href='#!';
      document.querySelector('.fb-share-button').classList.add('hide');
    }
    document.getElementById('eventType').value=event.type;
    document.getElementById('eventSede').innerText=  sedes[event.sede].nombre;
    document.getElementById('eventImage').src=event.picture;
    var instance = M.Modal.getInstance($('#modalDisplayEvent'));
    instance.open();
  });
  img.addEventListener("mouseover",function name(e) {
    e.target.parentElement.style.overflow="visible";
  });
  img.addEventListener("mouseout",function name(e) {
    e.target.parentElement.style.overflow="hidden";
  });
  div.append(img);
  return div;

}

function doWeekPill(event,time) {
  div=document.createElement('div');
  div.classList.add(pillColors[event.sede],"monthEvent","tooltipped");
  div.setAttribute('id_event',event.id);
  div.setAttribute('data-position','bottom');
  div.setAttribute('data-tooltip',event.title);
  div.innerText=time+" "+event.title;
  div.addEventListener("click",function name(e) {
    //date conversions
    console.log(sedes[event.sede].zona_horaria);
    dateFrom=event.datefrom+' '+sedes[event.sede].zona_horaria;
    dateFromLocal= new Date(dateFrom);
    dateTo=event.dateto+' '+sedes[event.sede].zona_horaria;
    dateToLocal= new Date(dateTo);
   
    document.getElementById('eventTitle').innerText=event.title;
    document.getElementById('eventHours').innerText=dateFrom;
    document.getElementById('eventHoursLocal').innerText=dateFromLocal.toLocaleString(getNavigatorLanguage());
    document.getElementById('eventDay').innerText=dateTo;
    document.getElementById('eventDayLocal').innerText=dateToLocal.toLocaleString(getNavigatorLanguage());
    if(validURL(event.url)){
      document.getElementById('eventUrl').href=event.url;
      document.getElementById('fbShare').href="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(event.picture);
      document.querySelector('.fb-share-button').classList.remove('hide');
    }else{
      document.getElementById('eventUrl').innerText=event.url;
      document.getElementById('eventUrl').href='#!';
      document.querySelector('.fb-share-button').classList.add('hide');
    }
    document.getElementById('eventType').value=event.type;
    document.getElementById('eventSede').innerText=  sedes[event.sede].nombre;
    document.getElementById('eventImage').src=event.picture;
    var instance = M.Modal.getInstance($('#modalDisplayEvent'));
    instance.open();
  });
  return div;

}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}
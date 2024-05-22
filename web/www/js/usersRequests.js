$.ajax({
    url: '/api/users?authkey=' + getCookie('authkey'),
    type: 'GET',
    contentType:'application/json',  
    dataType: 'text',                
    success: function (response) {
        users =JSON.parse(response);
        drawusers(users);
        
    }
});


function drawusers(users){

    table =document.getElementById('usersRequestList');table.innerHTML='';

    users.forEach(function (user) {
        
    
        tr=document.createElement('tr'); tr.setAttribute('userId',user.id);

       
        td_name =document.createElement('td');
        td_name.innerText= user.name;
        tr.append(td_name);

        td_usr =document.createElement('td');
        td_usr.innerText= user.usr;
        tr.append(td_usr);
       
        td_name =document.createElement('td');
        td_name.innerText= user.name;
        tr.append(td_matr);
        
        td_id_sede =document.createElement('td');
        td_id_sede.innerText= user.id_sede;
        tr.append(td_grup);


        td_name =document.createElement('td');
        td_name.innerText= user.name;
        tr.append(td_sem);


        td_status =document.createElement('td');
        td_status.innerText= user.status;
        tr.append(td_status);

       
        td_edit= document.createElement('td');
        td_edit.classList.add('row');
        div_edit= document.createElement('div');div_edit.classList.add('col', 's6');
        a_edit= document.createElement('a');
        a_edit.classList.add('btn-floating', 'btn-small', 'waves-effect', 'waves-light', 'gold');
        if(user.status==1)a_edit.classList.add('disabled');
        i_edit =document.createElement('i');
        i_edit.classList.add('material-icons', 'left');
        i_edit.innerText='edit';
        a_edit.append(i_edit);
        div_edit.append(a_edit);
        
        div_delete= document.createElement('div');div_delete.classList.add('col', 's6');
        a_delete= document.createElement('a');
        a_delete.classList.add('btn-floating', 'btn-small', 'waves-effect', 'waves-light', 'red');
        i_delete =document.createElement('i');
        i_delete.classList.add('material-icons', 'left');
        i_delete.innerText='delete';
        a_delete.append(i_delete);
        div_delete.append(a_delete);


        td_edit.append(div_edit);
        td_edit.append(div_delete);
        tr.append(td_edit);
        //td_edit.innerHTML='<div><a class="btn-floating btn-small waves-effect waves-light gold"><i class="material-icons left">edit</i>button</a></div>'; 
        a_edit.addEventListener('click',function(e){
            $.ajax({
                type: "PUT",
                url: '/api/users/'+user.id+'?authkey='+getCookie('authkey'),
                data: '{"status":1}',
                processData: false,  // tell jQuery not to process the data
                contentType: false ,
                success: function (response) {
                    console.log(response);
                    alert('Activated successfully');
                    i=users.findIndex(e => e.id === user.id);
                    users[i].status= 1;
                    drawusers(users);
                },
                fail:function (response) {
                    console.log(response);
                    alert('activation fail on user: '+response);
                },
                dataType: 'json'
            });
        });

        a_delete.addEventListener('click',function(e){
           c = confirm('This action cannot be undone, are you shure to continue?');
           if(c)
               $.ajax({
                   type: "DELETE",
                   url: '/api/users/'+user.id+'?authkey='+getCookie('authkey'),
                   processData: false,  // tell jQuery not to process the data
                   contentType: false ,
                   success: function (response) {
                       console.log(response);
                       alert('Updated successfully');
                       i=users.findIndex(e => e.id === user.id);
                       users.splice(i, 1);
                       drawusers(users);
                   },
                   fail:function (response) {
                       console.log(response);
                       alert('Fail creating user: '+response);
                   },
                   dataType: 'json'
               });
               else
                   return;
           });
        table.append(tr);
    });
    

}
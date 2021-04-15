
function getUsers(){
    $.ajax({
        url:'libs/php/getAll.php',
        dataType: 'JSON',
        type: 'POST',
        success: function(res){
            console.log(res)
            for (let i = 0; i < res.data.length; i++){
                const department = res.data[i].department;
                const email = res.data[i].email;
                const firstName = res.data[i].firstName;
                const lastName = res.data[i].lastName;
                const location = res.data[i].location;
                const id = res.data[i].id
                
                const table = `<div class="tables">
  <table>
  <tr class="table-names"><td>${firstName} ${lastName}</td></tr>
  
  <tr><td>${department}</td></tr>
  <tr><td>${location}</td></tr>
  <tr><td>${email}</td></tr>
  </table>
  <div class="table-buttons">
  <a  onclick="updateUser(${id})"  >Update</a>
  <a onclick="deleteUser(${id})">Delete</a>
 
  </div>
 </div>`;


                
                $('.tableUsers').append(table);
            }
        },
        error: function(err){
            console.log(err);
        }
    })
}



function insertDepartment() {
   
    let depName = $('#depName');
    let location = $('#location');

    $.ajax({
       url: 'libs/php/insertDepartment.php',
       dataType: 'text',
       type: 'POST',
       data:{
           name: depName.val(),
           locationID: location.val()
       },
    
    success: function(res){
        console.log('You have successfully added a department.')
    }
})
}

function getPersonnel(e){
    e.preventDefault();
    let employeeId = $('#employeeId');
    $('#tableUsers').empty();
   
    $.ajax({
        url: 'libs/php/getPersonnel.php',
        dataType: 'JSON',
        type: 'POST',
        data:{
            id: employeeId.val()
        },    
     success: function(res){

         console.log(res)
         const firstName = res.data.personnel[0].firstName;
         const lastName = res.data.personnel[0].lastName;
         const email = res.data.personnel[0].email;
     

         let info = `The user you are looking for is ${firstName} ${lastName} ${email}, <span id="department"></span> , `
         $('#tableUsers').append(info)
      
         const depId = res.data.personnel[0].departmentID;
         console.log(depId)
         for (let i = 0; i < res.data.department.length; i++){
            if (depId === res.data.department[i].id){
                console.log(res.data.department[i]);
                let department = res.data.department[i].name;
                let departmentId = res.data.department[i].id;
                $('#department').append(department);

                $.ajax({
                    url: 'libs/php/getLocation.php',
                    dataType: 'JSON',
                    type: 'POST',
                   
                    success: function(u){
                        console.log(u)
                        
                        for (let j = 0; j < u.data.length; j++){
                            let locid = u.data[j].id
                            if (departmentId === locid){
                                console.log(u.data[j])
                                let location = u.data[j].name
                                console.log(location)
                                $('#tableUsers').append(location);
                                
                            }
                        }
                        
                    }
                })
            } 

         }
     }
 })
}

function addUser(){
    $('#addUserModal').modal('show');
    $('#addUser').on('click', function(){
        let firstName = $('#firstName');
        let lastName = $('#lastName');
        let department = document.getElementById('department').value;
        let dep = department.charAt(0).toUpperCase() + department.slice(1);
        let email = $('#email');
        console.log(dep)
        $('#addUserModal').modal('hide');
    if (firstName.val() != '' && lastName.val() != '' && dep.value != '' && email.val() != ''){
    $.ajax({
        url: 'libs/php/addUser.php',
        dataType: 'JSON',
        type: 'POST',
        data:{
            firstName: firstName.val(),
            lastName: lastName.val(),
            department: dep,
            email: email.val(),
        },
        success: function(res){
            $('.tableUsers').empty();
            console.log(res)
            console.log("Success")
            getUsers();
        },
        error: function(err){
            console.log(err);
        }
    })
}
else {
    console.log('Please Enter the correct details.')
}
})
}

function addDepartment(){
    $('#addDepartmentModal').modal('show');

    $('#addDepartment').on('click', function(){
    
    let depName = document.getElementById('addDepartmentNameModal');
    let locName = document.getElementById('addDepartmentLocationModal');
  
        $.ajax({
            url: 'libs/php/addDepartment.php',
            dataType:'JSON',
            type:'POST',
            
            data:{
                depName: depName.value,
                depLocation: locName.value
            },
            success:function(res){
                depName.value == '';
                locName.value == ''; 
                console.log(res)
                $('#addDepartmentModal').modal('hide');
                $("#departments-fill").empty();
                fillDepartment();
            },
            error:function(err){
                console.log(err)
            }
        })
    })
}

function addLocation(){
    $('#addLocationModal').modal('show');
    
    $('#addLocation').on('click', function(){
        let locationName = document.getElementById('addLoca');
       console.log(locationName.value)
        $.ajax({
            url: 'libs/php/addLocation.php',
            dataType: 'JSON',
            type: 'POST',
            data:{
                locName: locationName.value
            },
            success:function(res){
                $('#addLocationModal').modal('hide');
                locationName.value == '';
                $("#location-fill").empty();
                fillLocation();
                console.log(res)
            },
            error:function(err){
                console.log(err);
            }
        })
    })
}


function deleteUser(id){

    $.ajax({
        url: 'libs/php/deleteUser.php',
        type: 'POST',
        data:{
            deleteId:id
        },
        success: function(res){
            //Maybe add a success message with user details
  
            $('.tableUsers').empty();
            orderBy();
        },
        error: function(err){
            console.log(err)
         
        }
    })
}



function updateUser(id){
    $('#updateModal').modal('show');
    $('#update').on('click', function(){   

    let firstName = $('#firstNameUpdateModal');
    let lastName = $('#lastNameUpdateModal');
    let department = document.getElementById('departmentUpdateModal').value;
    let dep = department.charAt(0).toUpperCase() + department.slice(1);
    let email = $('#emailUpdateModal');
   
    $.ajax({
        url: 'libs/php/updateUser.php',
        type: 'POST',
        data: {
            updateId: id,
            firstName: firstName.val(),
            lastName: lastName.val(),
            department: dep,
            email: email.val()
        },
        success:function(res){
            $('#updateModal').modal('hide');
            console.log(id)
            
            firstName.val() == '';
            lastName.val() == '';
            email.val() == ''
            $('.tableUsers').empty()
            orderBy();
   
        },
        error:function(err){
            console.log(err)
        }
    })
    })
}

function fillDepartment(){
$.ajax({
    url: 'libs/php/departmentFill.php',
    dataType: 'JSON',
    type: 'POST',
    success: function(res){
        console.log(res)
        for (let i = 0; i < res.data.length; i++){
            let depName = res.data[i].name;
            let table = `<input type="checkbox"><label for="${depName}"><span class="departmentfillitem">${depName}</span></label></br>`
            $("#departments-fill").append(table);
        }
        
    },
    error:function(err){
        console.log(err)
    }
})
}

function fillLocation(){

    $.ajax({
        url: 'libs/php/locationFill.php',
        dataType: 'JSON',
        type: 'POST',
        success: function(res){
            console.log(res)
            
            for (let i = 0; i < res.data.length; i++){
                let depName = res.data[i].name;
                let id = res.data[i].id;
                console.log(id)
                let depName2 = depName.replace(' ', '');
                let table = `<input value='${depName}' id="${id}" type="checkbox"><label for="${depName}"><span class="locationfillitem">${depName}</span></label></br>`
                $("#location-fill").append(table);
                console.log(document.getElementById(`${id}`))
                let va = document.getElementById(`${id}`).value;
                 $(`#${id}`).on('click', function(){
                   console.log(va)
                })

            }
            
        },
        error:function(err){
            console.log(err)
        }
    })
}



function orderBy(){
    $('.tableUsers').empty();
    let orderVal = document.querySelector('#order-by-select');
    let val = orderVal.value;
    let directionValue = document.querySelector('#order-by-direction');
    let dirVal = directionValue.value;
    


        console.log('Working')
        $.ajax({
            url: 'libs/php/orderBy.php',
            dataType: 'JSON',
            type: 'POST',
            data: {
                val: val,
                order: dirVal
            },
            success: function(res){
                console.log(res)
                for (let i = 0; i < res.data.length; i++){
                    const department = res.data[i].department;
                    const email = res.data[i].email;
                    const firstName = res.data[i].firstName;
                    const lastName = res.data[i].lastName;
                    const location = res.data[i].location;
                    const id = res.data[i].id
                    
                    const table = `<div class="tables">
      <table>
      <tr class="table-names"><td>${firstName} ${lastName}</td></tr>
      
      <tr><td>${department}</td></tr>
      <tr><td>${location}</td></tr>
      <tr><td>${email}</td></tr>
      </table>
      <div class="table-buttons">
      <a  onclick="updateUser(${id})"  >Update</a>
      <a onclick="deleteUser(${id})">Delete</a>
     
      </div>
     </div>`;
    
    
                    
                    $('.tableUsers').append(table);
                }
            },
            error: function(err){
                console.log(err)
            }
        })
}

getUsers();
fillDepartment();
fillLocation();

function getUsers(){
    $('.tableUsers').empty();
    $.ajax({
        url:'libs/php/getAll.php',
        dataType: 'JSON',
        type: 'POST',
        success: function(res){
    
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



function addUser(){
    console.log("Yes")
    $('#addUserModal').modal('show');
    $('#addUser').one('click', function(){
        
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

    $('#addDepartment').one('click', function(){
    
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
                departmentFill();
                
            },
            error:function(err){
                console.log(err)
            }
        })
    })
}

function addLocation(){
    $('#addLocationModal').modal('show');  
    $('#addLocation').one('click', function(){
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
                locationFill();
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
    $('#update').one('click', function(){   

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



function departmentFill(){


$.ajax({
    url: 'libs/php/departmentFill.php',
    dataType: 'JSON',
    type: 'POST',
    success:function(res){
        document.getElementById('department-first').style.display = 'block';
        document.getElementById('department-fill').style.display = 'none';
        document.getElementById('defaultSearch').style.display = 'block';
        document.getElementById('orderBy').style.display = 'none';
        let newVal = '<option value="">All</option>';
        $('#department-first').html(newVal);
        var departmentSelect = document.getElementById('department-first');
        for(let i = 0; i < res.data.length; i++){
            let depName = res.data[i].name;
            let id = res.data[i].id;
            let locationId = res.data[i].locationId;
            let el = document.createElement('option');
            el.textContent = depName;
            el.value = id;
            departmentSelect.appendChild(el);
            
            }
            let orderBy = document.getElementById('order-by-select');
            let direction = document.getElementById('order-by-direction');
            $('#department-first').change(function(){
                $(this).off('change');
                document.getElementById('defaultSearch').style.display = 'none';
                document.getElementById('orderBy').style.display = 'block';
                $('#orderBy').on('click', function(){
                  
                searchDisplay(departmentSelect.value,"", orderBy.value, direction.value)
                })
                
            })
 
            
        },
            error:function(err){
                console.log(err);
            }  
})
}

function justOrderBy(){
    let order = document.getElementById('order-by-select').value;
    let direction = document.getElementById('order-by-direction').value;
    let locId = '';
    let depId = '';
    searchDisplay(locId, depId, order, direction)
    
}



function locationFill(){
    $.ajax({
        url: 'libs/php/locationFill.php',
        dataType: 'JSON',
        type: 'POST',
        success:function(res){
          
            document.getElementById('defaultSearch').style.display = 'block';
            document.getElementById('orderBy').style.display = 'none';
            
            let newVal = '<option value="">All</option>';
            $('#location-fill').html(newVal);
            var locationSelect = document.getElementById('location-fill');
            for(let i = 0; i < res.data.length; i++){
                let depName = res.data[i].name;
                let id = res.data[i].id;
                let el = document.createElement('option');
                el.textContent = depName;
                el.value = id;
                locationSelect.appendChild(el);

            }   
            

            $('#location-fill').change(function(){
                $(this).off('change');
                document.getElementById('defaultSearch').style.display = 'none';
                document.getElementById('orderBy').style.display = 'block';
                departmentForOrder(locationSelect.value)
            })
            
        },
            error:function(err){
                console.log(err);
            }  
})
}

function departmentForOrder(id){
    let orderBy = document.getElementById('order-by-select');
    let direction = document.getElementById('order-by-direction');
    $.ajax({
        url:'libs/php/departmentFillForOrder.php',
        dataType: 'JSON',
        type: 'POST',
        data: {
            locationId: id
        },
        success:function(res){
            console.log(res)
            document.getElementById('department-first').style.display = 'none';
            document.getElementById('department-fill').style.display = 'block';
            let newVal = '<option value="">All</option>';
            $('#department-fill').html(newVal);
            let departmentSelect = document.getElementById('department-fill');
            for (let i = 0; i < res.data.length; i++){
                let depName = res.data[i].name;
                let id = res.data[i].id;
                let el = document.createElement('option');
                el.textContent = depName;
                el.value = id;
                departmentSelect.appendChild(el);
            }
            $('#orderBy').on('click', function(){
                $(this).off('click')
                departmentFill();
                locationFill();
                searchDisplay(departmentSelect.value, id, orderBy.value, direction.value)
                console.log(departmentSelect.value);
                console.log(orderBy.value);
                console.log(direction.value);
                

              
            })
            
        },
    })
}





function searchDisplay(departmentSelect, locationId, orderBySelect, directionValue){
    console.log('working')
        console.log(departmentSelect);
        $.ajax({
            url:'libs/php/orderBy.php',
            dataType: 'JSON',
            type: 'POST',
            data: {
                departmentId: departmentSelect,
                locationId:locationId,
                orderBySelect: orderBySelect,
                directionValue:directionValue
            },
            success:function(res){
               console.log(res)
             $('.tableUsers').empty();
             for (let i = 0; i < res.data.length; i++){
                const department = res.data[i].department;
                const email = res.data[i].email;
                const firstName = res.data[i].firstName;
                const lastName = res.data[i].lastName;
                const location = res.data[i].locationName;
                const locationId = res.data[i].locationId;
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
            error:function(err){
                console.log(err)
            }
        })    
    
}





function editDepartment(){  
    $('#editDepartmentModal').modal('show');
    $.ajax({
        url: 'libs/php/departmentFill.php',
        dataType: 'JSON',
        type: 'POST',
        success:function(res){
            console.log(res)
            var departmentSelect = document.getElementById('department-fill-for-edit');
            for(let i = 0; i < res.data.length; i++){
                let depName = res.data[i].name;
                let id = res.data[i].id;
                let el = document.createElement('option');
                el.textContent = depName;
                el.value = id;
                departmentSelect.appendChild(el);
            }
            $('#editDepartmentConfirm').on('click', function(){
                
                const newDep = document.getElementById('editDepartmentName');
                console.log(newDep);
                $('#editDepartmentModal').modal('hide');
                $.ajax({
                    url: 'libs/php/editDepartment.php',
                    dataType: 'JSON',
                    type: 'POST',
                    data:{
                        id: departmentSelect.value,
                        newDep: newDep.value
                    },
                    success:function(res){
                        departmentSelect.innerHTML="";

                        departmentFill();
                },
                    error:function(err){
                        console.log(err);
                    }
                
                }) 
            
            })
            

            }
            })
}

function deleteDepartment(){
    $('#deleteDepartmentModal').modal('show');
    $.ajax({
        url:'libs/php/departmentFill.php',
        dataType: 'JSON',
        type: 'POST',
        success:function(res){
            var departmentSelect = document.getElementById('department-fill-for-delete');
            for(let i = 0; i < res.data.length; i++){
                let depName = res.data[i].name;
                let id = res.data[i].id;
                let el = document.createElement('option');
                el.textContent = depName;
                el.value = id;
                departmentSelect.appendChild(el);
            }
            console.log(res)
            $('#deleteDepartmentConfirm').on('click', function(){
                $.ajax({
                    url: 'libs/php/deleteDepartment.php',
                    dataType: 'JSON',
                    'type': 'POST',
                    data:{
                        id: departmentSelect.value
                    },
                    success:function(res){
                        console.log(res);
                        while(departmentSelect.firstChild){
                            departmentSelect.removeChild(departmentSelect.firstChild)
                        }
                        $('#deleteDepartmentModal').modal('hide');
                        departmentFill();
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            })
           
        },
        error:function(err){
            console.log(err);
        }
    })
}

function editLocation(){
    $('#editLocationModal').modal('show');
    $.ajax({
        url: 'libs/php/locationFill.php',
        dataType: 'JSON',
        type: 'POST',
        success:function(res){
            console.log(res)
            var locationSelect = document.getElementById('location-fill-for-edit');
            for(let i = 0; i < res.data.length; i++){
                let locName = res.data[i].name;
                let id = res.data[i].id;
                let el = document.createElement('option');
                el.textContent = locName;
                el.value = id;
                locationSelect.appendChild(el);
            }
            $('#editLocationConfirm').on('click', function(){
                let editLoc = document.getElementById('editLocationName');
                console.log('Working')
                $.ajax({
                    url: 'libs/php/editLocation.php',
                    dataType: 'JSON',
                    type: 'POST',
                    data: {
                        newLoc: editLoc.value,
                        id: locationSelect.value
                    },
                    success:function(res){
                        console.log(res);
                        $('#editLocationModal').modal('hide');
                        locationSelect.innerHTML="";
                        locationFill();
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            })
        },
        error:function(err){
            console.log(err)
        }
    })
}

function deleteLocation(){
    $('#deleteLocationModal').modal('show');
    $.ajax({
        url: 'libs/php/locationFill.php',
        dataType: 'JSON',
        type: 'POST',
        success:function(res){
            console.log(res);
            let locationSelect = document.getElementById('location-fill-for-delete');
            for(let i = 0; i < res.data.length; i++){
                let locName = res.data[i].name;
                let id = res.data[i].id;
                let el = document.createElement('option');
                el.textContent = locName;
                el.value = id;
                locationSelect.appendChild(el);
            }
            $('#deleteLocationConfirm').on('click', function(){
                $.ajax({
                    url: 'libs/php/deleteLocation.php',
                    dataType: 'JSON',
                    type: 'POST',
                    data:{
                        id: locationSelect.value
                    },
                    success:function(res){
                        console.log(res);
                        while(locationSelect.firstChild){
                            locationSelect.removeChild(locationSelect.firstChild)
                        }
                        $('#deleteLocationModal').modal('hide');
                        locationFill();
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            })
        }, 
        error:function(res){
            console.log(res);
        }
    })
}


getUsers();

departmentFill();

locationFill();


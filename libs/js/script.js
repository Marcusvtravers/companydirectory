
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
  <div class="table-info">
  <div class="personnel-names">
  <span>${firstName} ${lastName}</span></br>
</div>
<div class="personnel-info">
    <table class="personnel-info-table">
    <tr><td>${department}</td></tr>
    <tr><td>${location}</td></tr>
    <tr><td>${email}</td></tr>
    </table>
</div>
    
  </div>
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
 
    $('#addUserModal').modal('show');
    $('.close').on('click', function(){
        $('#addUserModal').modal('hide');
        $('#addUser').off('click')
    })
    document.getElementById('lastName').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('email').value = '';
    
    $.ajax({
        url: 'libs/php/departmentFill.php',
        dataType: 'JSON',
        type: 'POST',
        success:function(res){
            console.log(res)
            $('#department').empty();
            $('#addUserModal').modal('hide');
            let departmentAdd = document.getElementById('department');
            for(let i = 0; i < res.data.length; i++){
                let depName = res.data[i].name;
                let id = res.data[i].id;
                let locationId = res.data[i].locationId;
                let el = document.createElement('option');
                el.textContent = depName;
                el.value = id;
                departmentAdd.appendChild(el);
            }

        $('#addUserConfirm').on('click', function(){
        $('#addUserModal').modal('hide');
        $('#addUserConfirmModal').modal('show');
        let firstNameConfirm = $('#firstName');
        let lastNameConfirm = $('#lastName');
        let dep = $('#department option:selected');
        
        let email = $('#email');
        $('#addUserModal').modal('show');
        $('.close').on('click', function(){
            $('#addUserConfirmModal').modal('hide');
            $('#addUser').off('click');
        })
        let text = `Would you like to confirm ${firstNameConfirm.val()} ${lastNameConfirm.val()} - ${dep.text()} to the database`
        document.getElementById('addUserConfirmMessage').textContent = text;
        document.getElementById('addUser').style.display = 'block';
    }); 

    $('#addUser').one('click', function(){
        
        let firstName = $('#firstName');
        let lastName = $('#lastName');
        
        let email = $('#email');
        let dep = departmentAdd.value;
        console.log(dep)
        $('#addUserModal').modal('hide');
    if (firstName.val() != '' && lastName.val() != '' && dep != '' && email.val() != ''){
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
            let completetext = `${firstName.val()} ${lastName.val()} has been added to the database`;
            document.getElementById('addUserConfirmMessage').textContent = completetext;
            console.log(res)
            console.log("Success")
            getUsers();
            document.getElementById('addUser').style.display = 'none';
            
            $('.close').modal('hide');
        
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
},
error:function(err){
    console.log(err);
}
})
}

function addDepartment(){
    
    $('#addDepartmentModal').modal('show');
    document.getElementById('addDepartmentNameModal').value = ''

    $.ajax({
        url: 'libs/php/locationFill.php',
        dataType: 'JSON',
        type: 'POST',
        success:function(res){
            console.log(res)
            $('#addDepartmentLocationModal').empty();
            let locationNames = document.getElementById('addDepartmentLocationModal');
            for (let i = 0; i < res.data.length; i++){
                let depName = res.data[i].name;
                let id = res.data[i].id;
                let locationId = res.data[i].locationId;
                let el = document.createElement('option');
                el.textContent = depName;
                el.value = id;
                locationNames.appendChild(el);
            }

            $('.close').one('click', function(){
                $('#addDepartmentModal').modal('hide');  
                $('#addDepartment').off('click')
            })

    $('#addDepartmentConfirm').one('click', function(){
  
    $('#addDepartmentModal').modal('hide');
    $('#addDepartmentConfirmModal').modal('show');
    document.getElementById('addDepartment').style.display = 'block';
    let depName = document.getElementById('addDepartmentNameModal');
    let locName = $('#addDepartmentLocationModal option:selected');
    let text = `Are you sure you would like to add the new department ${depName.value} in the location ${locName.text()}`;
    document.getElementById('addDepartmentConfirmMessage').textContent = text;
        
    $('.close').on('click', function(){
        $(this).off('click');
        $('#addDepartmentConfirm').off('click');
        $('#addDepartmentConfirmModal').modal('hide');
        $('#addDepartment').off('click');
    })    
  
    $('#addDepartment').one('click', function(){
        console.log(depName.value);
         console.log(locName.val())
    
        $.ajax({
            url: 'libs/php/addDepartment.php',
            dataType:'JSON',
            type:'POST',
            
            data:{
                depName: depName.value,
                depLocation: locName.val()
            },
            success:function(res){
                depName.value == '';
                locName.value == ''; 
                console.log(res)
                let completeText = `The new department ${depName.value} has been successfully added.`;
                document.getElementById('addDepartmentConfirmMessage').textContent = completeText;
                document.getElementById('addDepartment').style.display = 'none';
                $("#departments-fill").empty();
                departmentFill();
               
                
            },
            error:function(err){
                console.log(err)
            }
        })
        })
    })
},
error:function(res){
    console.log(res)
}
  
})
  
}



function addLocation(){
    document.getElementById('addLoca').value = '';
    $('#addLocationModal').modal('show'); 
    $('.close').on('click', function(){
        $('#addLocationModal').modal('hide');
        $('#addLocation').off('click');
        $('#addLocationConfirm').off('click');
       
    })

    $('#addLocationConfirm').one('click', function(){
        $('#addLocationModal').modal('hide');  
        $('#addLocationConfirmModal').modal('show'); 
        let locationName = document.getElementById('addLoca');
       console.log(locationName.value)
    
       let text = `Are you sure you would like to add the new location ${locationName.value}?`;
       document.getElementById('addLocationConfirmMessage').textContent = text;

       $('.close').on('click', function(){
           $('#addLocationConfirm').off('click');
        $('#addLocationConfirmModal').modal('hide');
        $('#addLocation').off('click');
        
         })
    $('#addLocation').one('click', function(){
        $.ajax({
            url: 'libs/php/addLocation.php',
            dataType: 'JSON',
            type: 'POST',
            data:{
                locName: locationName.value
            },
            success:function(res){
               
                locationName.value == '';
                let completeText = `The new location ${locationName.value} has been successfully added.`;
                document.getElementById('addLocationConfirmMessage').textContent = completeText;
                document.getElementById('addLocation').style.display = 'none';
                $("#location-fill").empty();
                locationFill();
                console.log(res)
            },
            error:function(err){
                console.log(err);
            }
        })
    })
    })
}



function deleteUser(id){
    $('#deleteUserConfirmModal').modal('show');

    $.ajax({
        url: 'libs/php/getPersonnel.php',
        dataType: 'JSON',
        type: 'POST',
        data: {
            id: id
        },
        success:function(res){
            console.log(res)
            let firstName = res.data.personnel[0].firstName
            let lastName = res.data.personnel[0].lastName
            let text = `Are you sure you want to delete ${firstName} ${lastName} from the database?`
            document.getElementById('deleteUserConfirmMessage').textContent = text;
            document.getElementById('deleteUser').style.display = 'block';
           $('.close').on('click', function(){
               $('#deleteUserConfirmModal').modal('hide');
               $('#deleteUser').off('click');
           })
        $('#deleteUser').on('click', function(){

            $.ajax({
                url: 'libs/php/deleteUser.php',
                type: 'POST',
                data:{
                    deleteId:id
                },
                success: function(res){

                    //Maybe add a success message with user details
                    let confirmText = `${firstName} ${lastName} has been deleted.`
                    document.getElementById('deleteUserConfirmMessage').textContent = confirmText;
                    document.getElementById('deleteUser').style.display = 'none'

                    $('.tableUsers').empty();
                    getUsers();
                },
                error: function(err){
                    console.log(err)
                 
                }
            })
        
        })
    },
        error:function(err){
            console.log(err)
        }
    })
}


function updateUser(id){
    $('#updateModal').modal('show');
    document.getElementById('userUpdateDiv').style.display = 'block';
    document.getElementById('update').style.display = 'block';
    document.getElementById('successMsg').textContent = '';
    $('.close').on('click', function(){
        $('#updateModal').modal('hide');
        $('#update').off('click');
    })

    $.ajax({
        url: 'libs/php/getPersonnel.php',
        dataType: 'JSON',
        type: 'POST',
        data:{
            id:id
        },
        success:function(res){
            $('#departmentUpdateModal').empty();
            console.log(res)
            
           let departmentUpdateSelect = document.getElementById('departmentUpdateModal')
           for (let i = 0; i < res.data.department.length; i++){
            let depName = res.data.department[i].name;
            let depid = res.data.department[i].id;
            let el = document.createElement('option');
            el.textContent = depName;
            el.value = depid;
            departmentUpdateSelect.appendChild(el);
           }
       
    
        console.log(departmentUpdateSelect.value)
           let firstName = res.data.personnel[0].firstName
           let lastName = res.data.personnel[0].lastName
           let email = res.data.personnel[0].email
      


            document.getElementById('firstNameUpdateModal').value = firstName
           document.getElementById('lastNameUpdateModal').value = lastName
           
           document.getElementById('emailUpdateModal').value = email
           $('#update').one('click', function(){  
            let firstNameVal = $('#firstNameUpdateModal') 
            let lastNameVal = $('#lastNameUpdateModal')
            let depValue = departmentUpdateSelect.value
            let emailVal = $('#emailUpdateModal')
            console.log(firstNameVal.val())
            console.log(lastNameVal.val())
   
            $.ajax({
                url: 'libs/php/updateUser.php',
                type: 'POST',
                data: {
                    updateId: id,
                    firstName: firstNameVal.val(),
                    lastName: lastNameVal.val(),
                    department: depValue,
                    email: emailVal.val()
                },
                success:function(res){
                    const text = `The user ${firstNameVal.val()} ${lastNameVal.val()} was successfully updated.` 
                    document.getElementById('userUpdateDiv').style.display = 'none';
                    document.getElementById('successMsg').textContent = text;
                    document.getElementById('update').style.display = 'none';
                    firstNameVal.val() == '';
                    lastNameVal.val() == '';
                    emailVal.val() == ''
                    $('.tableUsers').empty()
                    getUsers();

           
                },
                error:function(err){
                    console.log(err)
                }
            })
        })
        },
        error:function(err){
            console.log(err)
        }
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
                
                const table =`<div class="tables">
                <div class="table-info">
                <div class="personnel-names">
                <span>${firstName} ${lastName}</span></br>
              </div>
              <div class="personnel-info">
                  <table class="personnel-info-table">
                  <tr><td>${department}</td></tr>
                  <tr><td>${location}</td></tr>
                  <tr><td>${email}</td></tr>
                  </table>
              </div>
                  
                </div>
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


let searchBar = document.getElementById('searchBar');


function searchBarDisplay(){
    let searchBarValue = document.getElementById('searchBar').value;
    console.log(searchBarValue);
    $.ajax({
        url: 'libs/php/searchBar.php',
        dataType: 'JSON',
        type: 'POST',
        data:{
            searchBarValue: searchBarValue
        },
        success:function(res){
            console.log(res)
            $('.tableUsers').empty();
             for (let i = 0; i < res.data.length; i++){
                const department = res.data[i].department;
                const email = res.data[i].email;
                const firstName = res.data[i].firstName;
                const lastName = res.data[i].lastName;
                const location = res.data[i].location;
                const locationId = res.data[i].locationId;
                const id = res.data[i].id
                
                const table = `<div class="tables">
                <div class="table-info">
                <div class="personnel-names">
                <span>${firstName} ${lastName}</span></br>
              </div>
              <div class="personnel-info">
                  <table class="personnel-info-table">
                  <tr><td>${department}</td></tr>
                  <tr><td>${location}</td></tr>
                  <tr><td>${email}</td></tr>
                  </table>
              </div>
                  
                </div>
                <div class="table-buttons">
               
              
                <a  onclick="updateUser(${id})"  >Update</a>
              
                <a onclick="deleteUser(${id})">Delete</a>
                </div>
               </div>`;


                
                $('.tableUsers').append(table);
                
            }
        },
        error:function(res){
            console.log(res);
        }
    })
}


searchBar.addEventListener('keyup', searchBarDisplay);



function editDepartment(){  
    $('#editDepartmentModal').modal('show');
    $('#department-fill-for-edit').empty();
    document.getElementById('editDepartmentName').value = "";
    document.getElementById('editDepSuccessMsg').textContent = "";
    document.getElementById('editDepartmentConfirm').style.display = "block";
    document.getElementById('editDepartmentForm').style.display = 'block';
    $('.close').on('click', function(){
        $('#editDepartmentModal').modal('hide');
        $('#editDepartmentConfirm').off('click');
    })

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
                        document.getElementById('editDepartmentForm').style.display = 'none';
                        document.getElementById('editDepSuccessMsg').style.display = 'block';
                        document.getElementById('editDepSuccessMsg').innerHTML = "Department Successfully Updated";
                        document.getElementById('editDepartmentConfirm').style.display = "none";
                        departmentFill();
                        $('.tableUsers').empty();
                        getUsers();
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
    document.getElementById('deleteDepartmentConfirm').style.display = 'none'
    document.getElementById('deleteDepartment').style.display = 'block';
    document.getElementById('deleteDepMsg').textContent = ''
    document.getElementById('deleteConfirmMsg').innerHTML = '';
    document.getElementById('department-delete-form').style.display = 'block'

    $('#department-fill-for-delete').empty();
    $('.close').on('click', function(){
        $('#deleteDepartmentModal').modal('hide');
        $('#deleteDepartment').off('click');
        $('#deleteDepartmentConfirm').off('click');
    })
    $.ajax({
        url:'libs/php/departmentFill.php',
        dataType: 'JSON',
        type: 'POST',
        success:function(res){
            $('departmentSelect').empty();
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

            $('#deleteDepartment').on('click', function(){
             console.log(departmentSelect.value)
                    $.ajax({
                        url:'libs/php/getDepartment.php',
                        dataType: 'JSON',
                        type: 'POST',
                        data:{
                            id: departmentSelect.value
                        },
                        success:function(res){
                        console.log(res) 
                            let deleteDep = res.data.department[0].name
                            document.getElementById('department-delete-form').style.display = 'none';
                            document.getElementById('deleteDepMsg').style.display = 'block';
                            let msg = `Are you sure you would like to delete ${deleteDep} from the database?`
                            document.getElementById('deleteDepMsg').textContent = msg;
                            document.getElementById('deleteDepartment').style.display = 'none';
                            document.getElementById('deleteDepartmentConfirm').style.display = 'block'

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
                                    document.getElementById('deleteConfirmMsg').style.display = 'block';
                                    document.getElementById('deleteDepMsg').style.display = 'none';
                                    let text = `Department successfully deleted.`;
                                    document.getElementById('deleteConfirmMsg').innerHTML = text;
                                    document.getElementById('deleteDepartmentConfirm').style.display = 'none';
                                    
                                
                                    departmentFill();
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
            }) 
           
        },
        error:function(err){
            console.log(err);
        }
    })
}

function editLocation(){
    $('#editLocationModal').modal('show');
    $('.close').on('click', function(){
        $('#editLocationModal').modal('hide');
        $('#editLocationConfirm').off('click');
    })
    document.getElementById('editLocationName').value = '';
    document.getElementById('editLocationSuccessMsg').style.display = 'none';
    document.getElementById('editLocationForm').style.display = 'block';
    document.getElementById('editLocationConfirm').style.display = 'block';
    $('#location-fill-for-edit').empty();
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

            $('#editLocationConfirm').one('click', function(){
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
                        document.getElementById('editLocationForm').style.display = 'none';
                        document.getElementById('editLocationConfirm').style.display = 'none'
                        document.getElementById('editLocationSuccessMsg').style.display = 'block';
                        let text = `Location successfully changed.`
                        document.getElementById('editLocationSuccessMsg').innerHTML = text;
                       // $('#editLocationModal').modal('hide');
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
    $('#location-fill-for-delete').empty();
    $('#deleteLocationModal').modal('show');
    document.getElementById('deleteLocMsg').innerHTML = "";
    document.getElementById('deleteLocationForm').style.display = 'block';
    document.getElementById('deleteLocConfirmMsg').innerHTML = '';
    document.getElementById('deleteLocationConfirm').style.display = 'none';
    document.getElementById('deleteLocation').style.display = 'block';
    $('.close').on('click', function(){
        $('#deleteLocationModal').modal('hide');
        $('#deleteLocation').off('click');
        $('#deleteLocationConfirm').off('click');
    })
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
            $('#deleteLocation').on('click', function(){
                $.ajax({
                    url: 'libs/php/getLocation.php',
                    dataType:'JSON',
                    type: 'POST',
                    data:{
                        id: locationSelect.value
                    },
                    success:function(res){
                        let locName = res.data.department[0].name;
                        let text = `Are you sure you want to delete ${locName} from the database?`
                        document.getElementById('deleteLocationForm').style.display = 'none';
                        document.getElementById('deleteLocation').style.display = 'none';
                        document.getElementById('deleteLocMsg').style.display = 'block';
                        document.getElementById('deleteLocMsg').innerHTML = text;
                        document.getElementById('deleteLocationConfirm').style.display = 'block';
                    }
                })
            })

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
                       let text = `Location successfully deleted.`
                       document.getElementById('deleteLocMsg').style.display = 'none';
                       document.getElementById('deleteLocConfirmMsg').style.display = 'block';
                       document.getElementById('deleteLocConfirmMsg').innerHTML = text;
                        document.getElementById('deleteLocationConfirm').style.display = 'none';
                
                        
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











$('.fa-bars').on('click', function(){
    locationFillForModal();
    departmentFillForModal();
    $('#smallScreenOptionsModal').modal('show');
    $('.close, #orderBy, #defaultSearch').on('click', function(){
        $('#smallScreenOptionsModal').modal('hide'); 
    
})
})

$('.fa-plus').click(function(){
    $('#dropdown-small').slideToggle('slow')
});

$('.fa-angle-down').click(function(){
    $('.dropdown-add ').slideDown('slow')
})
$('.dropdown-add').mouseleave(function(){
    $('.dropdown-add').slideUp('slow');
})

document.getElementById('department-fill').style.display = 'none';


// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });




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
    <tr><td>${email}</td></tr>
    <tr><td>${department} - ${location}</td></tr>
    </table>
</div>
    
  </div>
  <div class="table-buttons">
 

  <a  onclick="updateUser(${id})"  ><i class="fas fa-user-edit"></i></a>

  <a onclick="deleteUser(${id})"><i class="fas fa-trash-alt"></i></a>
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
       
    
       let text = `Are you sure you would like to add the new location ${locationName.value}?`;
       document.getElementById('addLocationConfirmMessage').textContent = text;
       document.getElementById('addLocation').style.display = 'block';
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
          
            
           let departmentUpdateSelect = document.getElementById('departmentUpdateModal')
           for (let i = 0; i < res.data.department.length; i++){
            let depName = res.data.department[i].name;
            let depid = res.data.department[i].id;
            let el = document.createElement('option');
            el.textContent = depName;
            el.value = depid;
            departmentUpdateSelect.appendChild(el);
           }
       
    
        
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
                $('#department-first-modal').off('change');
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
    $('#smallScreenOptionsModal').modal('hide');
}
function justOrderByModal(){
    let order = document.getElementById('order-by-select-modal').value;
    let direction = document.getElementById('order-by-direction-modal').value;
    let locId = '';
    let depId = '';
    searchDisplay(locId, depId, order, direction)
    $('#smallScreenOptionsModal').modal('hide');
}


function locationFill(){

    $.ajax({
        url: 'libs/php/locationFill.php',
        dataType: 'JSON',
        type: 'POST',
        success:function(res){
         
            document.getElementById('defaultSearch').style.display = 'block';
            document.getElementById('orderBy').style.display = 'none';

            //fullscreen

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
                
                if ($('#location-fill').val() == ''){
                    document.getElementById('defaultSearch').style.display = 'block';
                    document.getElementById('orderBy').style.display = 'none';
                    departmentFill();
                  
                } else {
                    document.getElementById('defaultSearch').style.display = 'none';
                    document.getElementById('orderBy').style.display = 'block';
                    departmentForOrder(locationSelect.value)
                }  
            })
        },
            error:function(err){
                console.log(err);
            }  
})
}



function departmentForOrder(id){
    $('#orderBy').off('click')
    $('#orderBy-modal').off('click')
    let orderBy = document.getElementById('order-by-select');
    let direction = document.getElementById('order-by-direction');
    let orderByModal = document.getElementById('order-by-select-modal');
    let directionModal = document.getElementById('order-by-direction-modal');
    $.ajax({
        url:'libs/php/departmentFillForOrder.php',
        dataType: 'JSON',
        type: 'POST',
        data: {
            locationId: id
        },
        success:function(res){
           
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
                

                $('#orderBy-modal').off('click');
                searchDisplay(departmentSelect.value, id, orderBy.value, direction.value)
               
            })



            document.getElementById('department-first-modal').style.display = 'none';
            document.getElementById('department-fill-modal').style.display = 'block';
            let newValModal = '<option value="">All</option>';
            $('#department-fill-modal').html(newValModal);
            let departmentSelectModal = document.getElementById('department-fill-modal');
            for (let i = 0; i < res.data.length; i++){
                let depName = res.data[i].name;
                let id = res.data[i].id;
                let el = document.createElement('option');
                el.textContent = depName;
                el.value = id;
                departmentSelectModal.appendChild(el);
            }
            $('#orderBy-modal').on('click', function(){ 
        
                searchDisplay(departmentSelectModal.value, id, orderByModal.value, directionModal.value) 
                $('#smallScreenOptionsModal').modal('hide');       
            })
            

        },
    })
}


function searchDisplay(departmentSelect, locationId, orderBySelect, directionValue){


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
                  <tr><td>${email}</td></tr>
                  <tr><td>${department} - ${location}</td></tr>
                  </table>
              </div>
                  
                </div>
                <div class="table-buttons">
               
              
                <a  onclick="updateUser(${id})"  ><i class="fas fa-user-edit"></i></a>
              
                <a onclick="deleteUser(${id})"><i class="fas fa-trash-alt"></i></a>
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

function departmentFillForModal(){

    $.ajax({
        url: 'libs/php/departmentFill.php',
        dataType: 'JSON',
        type: 'POST',
        success:function(res){
            document.getElementById('department-first-modal').style.display = 'block';
            document.getElementById('department-fill-modal').style.display = 'none';
            document.getElementById('defaultSearch-modal').style.display = 'block';
            document.getElementById('orderBy-modal').style.display = 'none';

            let newValModal = '<option value="">All</option>';
            $('#department-first-modal').html(newValModal);
            var departmentSelectModal = document.getElementById('department-first-modal');
            for(let i = 0; i < res.data.length; i++){
                let depName = res.data[i].name;
                let id = res.data[i].id;
                let locationId = res.data[i].locationId;
                let el = document.createElement('option');
                el.textContent = depName;
                el.value = id;
                departmentSelectModal.appendChild(el);
                
                }
                let orderByModal = document.getElementById('order-by-select-modal');
                let directionModal = document.getElementById('order-by-direction-modal');
                $('#department-first-modal').change(function(){
                    $(this).off('change');
                    $('#department-first').off('change')
                    document.getElementById('defaultSearch-modal').style.display = 'none';
                    document.getElementById('orderBy-modal').style.display = 'block';
                    $('#orderBy-modal').on('click', function(){
                    $('#smallScreenOptionsModal').modal('hide');    
                    searchDisplay(departmentSelectModal.value,"", orderByModal.value, directionModal.value)
                    })
                    
                })
            
        },
        error:function(res){
            console.log(res)
        }
    })
}

function locationFillForModal(){

    $.ajax({
        url: 'libs/php/locationFill.php',
        dataType: 'JSON',
        type: 'POST',
        success:function(res){
            document.getElementById('defaultSearch-modal').style.display = 'block';
            document.getElementById('orderBy-modal').style.display = 'none';

            let newValModal = '<option value="">All</option>';
            $('#location-fill-modal').html(newValModal);
            var locationSelectModal = document.getElementById('location-fill-modal');
            for(let i = 0; i < res.data.length; i++){
                let depName = res.data[i].name;
                let id = res.data[i].id;
                let el = document.createElement('option');
                el.textContent = depName;
                el.value = id;
                locationSelectModal.appendChild(el);

            } 
            
            $('#location-fill-modal').change(function(){
                
                
                if($('#location-fill-modal').val() == ''){
                    document.getElementById('defaultSearch-modal').style.display = 'block';
                    document.getElementById('orderBy-modal').style.display = 'none';
                    departmentFill();
                } else {
                    document.getElementById('defaultSearch-modal').style.display = 'none';
                    document.getElementById('orderBy-modal').style.display = 'block';
                    departmentForOrder(locationSelectModal.value)
                }
            })
        }, 
        error:function(err){
            console.log(err)
        }
    })
}


let searchBar = document.getElementById('searchBar');


function searchBarDisplay(){
    let searchBarValue = document.getElementById('searchBar').value;
    
    $.ajax({
        url: 'libs/php/searchBar.php',
        dataType: 'JSON',
        type: 'POST',
        data:{
            searchBarValue: searchBarValue
        },
        success:function(res){
            
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
                  <tr><td>${email}</td></tr>
                  <tr><td>${department} - ${location}</td></tr>
                  </table>
              </div>
                  
                </div>
                <div class="table-buttons">
               
              
                <a  onclick="updateUser(${id})"  ><i class="fas fa-user-edit"></i></a>
              
                <a onclick="deleteUser(${id})"><i class="fas fa-trash-alt"></i></a>
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



function getValueForEditDepartment(){
let depFirst = document.getElementById('department-first');
let depFill = document.getElementById('department-fill');



if (depFirst.value !== '' && depFill.value === ''){
    let text = $('#department-first>option:selected').text();
    editDepartment(`This is from dep first`,depFirst.value, text)
    depFirst.value = '';
    depFill.value = '';
} else {
    let text = $('#department-fill>option:selected').text();
    editDepartment(`This is from dep fill`, depFill.value, text)
    depFirst.value = '';
    depFill.value = '';
}
}

function getValueForEditDepartmentModal(){
    let depFirst = document.getElementById('department-first-modal');
let depFill = document.getElementById('department-fill-modal');



if (depFirst.value !== '' && depFill.value === ''){
    let text = $('#department-first-modal>option:selected').text();
    editDepartment(`This is from dep first`,depFirst.value, text)
    depFirst.value = '';
    depFill.value = '';
} else {
    let text = $('#department-fill-modal>option:selected').text();
    editDepartment(`This is from dep fill`, depFill.value, text)
    depFirst.value = '';
    depFill.value = '';
}
}

function editDepartment(msg,value, depName){
    document.getElementById('editDepartmentConfirm').style.display = "block";
    document.getElementById('editDepSuccessMsg').style.display = 'none';
    document.getElementById('editDepartmentName').value = '';

    $('#editDepartmentModal').modal('show');
    $('#smallScreenOptionsModal').modal('hide');
   
    $('.close').on('click', function(){
        $('#editDepartmentModal').modal('hide');
        $('#editDepartmentConfirm').off('click');
        
    })
    if (value === ''){
        
        document.getElementById('selectDepartmentToEditMsg').style.display = 'block';
        document.getElementById('editDepartmentConfirm').style.display = 'none';
        document.getElementById('msgForEditingDepartment').style.display = 'none';
    } else{
        
        document.getElementById('selectDepartmentToEditMsg').style.display = 'none';
        document.getElementById('msgForEditingDepartment').style.display = 'block';
        document.getElementById('oldDepName').innerHTML = depName
        
        let newDepName = document.getElementById('editDepartmentName');
        $('#editDepartmentConfirm').on('click', function(){

        
            $.ajax({
                url: 'libs/php/editDepartment.php',
                dataType: 'JSON',
                type: 'POST',
                data:{
                    id: value,
                    newDep: newDepName.value
                },
                success:function(res){
                    
                    document.getElementById('msgForEditingDepartment').style.display = 'none';
                    document.getElementById('editDepSuccessMsg').style.display = 'block';
                    document.getElementById('editDepSuccessMsg').innerHTML = `${depName} has successfully updated to ${newDepName.value}`;
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
}


function getValueForDeleteDepartment(){

    let depFirst = document.getElementById('department-first');
    let depFill = document.getElementById('department-fill');
 
    
    
    if (depFirst.value !== '' && depFill.value === ''){
        let text = $('#department-first>option:selected').text();
        deleteDepartment(`This is from dep first`,depFirst.value, text)
        depFirst.value = '';
        depFill.value = '';
    } else {
        let text = $('#department-fill>option:selected').text();
        deleteDepartment(`This is from dep fill`, depFill.value, text)
        depFirst.value = '';
        depFill.value = '';
    }
    
    }

function getValueForDeleteDepartmentModal(){
    let depFirst = document.getElementById('department-first-modal');
    let depFill = document.getElementById('department-fill-modal');

    
    
    if (depFirst.value !== '' && depFill.value === ''){
        let text = $('#department-first-modal>option:selected').text();
        deleteDepartment(`This is from dep first`,depFirst.value, text)
        depFirst.value = '';
        depFill.value = '';
    } else {
        let text = $('#department-fill-modal>option:selected').text();
        deleteDepartment(`This is from dep fill`, depFill.value, text)
        depFirst.value = '';
        depFill.value = '';
    }
    
}    

function deleteDepartment(msg, value, depName){

    $('#deleteDepartmentModal').modal('show');
    $('#smallScreenOptionsModal').modal('hide');
    $('.close').on('click', function(){
        $('#deleteDepartmentModal').modal('hide');
        $('#deleteDepartmentConfirm').off('click');
    })
    document.getElementById('selectDepartmentToDeleteMsg').style.display = 'none';
    document.getElementById('deleteSuccessMsg').style.display = 'none';
    document.getElementById('deleteConfirmMsg').style.display = 'none';
    if(value === ''){
        document.getElementById('selectDepartmentToDeleteMsg').style.display = 'block';
        document.getElementById('deleteDepartmentConfirm').style.display = 'none';
    } else {
        document.getElementById('deleteConfirmMsg').style.display = 'block';
        document.getElementById('deleteDepartmentConfirm').style.display = 'block';
        document.getElementById('deleteDepName').innerHTML = depName
        $('#deleteDepartmentConfirm').one('click', function(){

            $.ajax({
                url: 'libs/php/deleteDepartment.php',
                dataType: 'JSON',
                type: 'POST',
                data:{
                    id: value
                },
                success:function(res){
               
                    document.getElementById('deleteConfirmMsg').style.display = 'none';
                    document.getElementById('deleteDepartmentConfirm').style.display = 'none';
                    document.getElementById('deleteSuccessMsg').innerHTML = res.data.message;
                    document.getElementById('deleteSuccessMsg').style.display = 'block';
                    document.getElementById('deleteDepartmentConfirm').style.display = 'none';
                    departmentFill();
                },
                error:function(err){
                    console.log(err)
                }
            })
        })
    }

}




function editLocation(){

    document.getElementById('editLocationSuccessMsg').style.display = 'none';
    document.getElementById('editLocationConfirm').style.display = 'block';
    $('#smallScreenOptionsModal').modal('hide');
    let doc = document.getElementById('editLocationName').value = '';
    let locationSelect = document.getElementById('location-fill')
    let locationSelectModal = document.getElementById('location-fill-modal');
    document.getElementById('selectLocationToEditMsg').style.display = 'none';
    $('.close').on('click', function(){
        $('#editLocationModal').modal('hide');
        $('#editLocationConfirm').off('click');
        locationSelect.value = '';
        locationSelectModal.value = '';
    })
    $('#editLocationModal').modal('show');


    if (locationSelect.value == "" && locationSelectModal.value == ''){
        document.getElementById('edit-location-div').style.display = 'none';
        document.getElementById('selectLocationToEditMsg').style.display = 'block';
        document.getElementById('editLocationConfirm').style.display = 'none';
    } else if (locationSelect.value == '' && locationSelectModal.value != ''){
     
        $('.close').on('click', function(){
            $('#editLocationModal').modal('hide');
            $('#editLocationConfirm').off('click');
            
            locationSelectModal.value = '';
        })
        let text = $('#location-fill-modal>option:selected').text();
        document.getElementById('edit-location-name').innerHTML = text;

        document.getElementById('edit-location-div').style.display = 'block';
        let editLoc = document.getElementById('editLocationName')
        $('#editLocationConfirm').one('click', function(){
            $.ajax({
                url: 'libs/php/editLocation.php',
                dataType: 'JSON',
                type: 'POST',
                data: {
                    newLoc: editLoc.value,
                    id: locationSelectModal.value
                },
                success:function(res){
                  
                    
                    document.getElementById('edit-location-div').style.display = 'none';
                
                    document.getElementById('editLocationSuccessMsg').style.display = 'block';
                    document.getElementById('editLocationConfirm').style.display = 'none';
                    let successtext = `${text} has been successfully changed to ${editLoc.value}.`
                    document.getElementById('editLocationSuccessMsg').innerHTML = successtext;
                   // $('#editLocationModal').modal('hide');
                   
                    
                    locationFill();
                    getUsers();
                },
                error:function(err){
                    console.log(err);
                }
            })     
        })
    } else {
        let text = $('#location-fill>option:selected').text();
        document.getElementById('edit-location-name').innerHTML = text;
        document.getElementById('edit-location-div').style.display = 'block';
        let editLoc = document.getElementById('editLocationName')
        $('#editLocationConfirm').one('click', function(){
            $.ajax({
                url: 'libs/php/editLocation.php',
                dataType: 'JSON',
                type: 'POST',
                data: {
                    newLoc: editLoc.value,
                    id: locationSelect.value
                },
                success:function(res){
              
                    
                    document.getElementById('edit-location-div').style.display = 'none';
                
                    document.getElementById('editLocationSuccessMsg').style.display = 'block';
                    document.getElementById('editLocationConfirm').style.display = 'none';
                    let successtext = `${text} has been successfully changed to ${editLoc.value}.`
                    document.getElementById('editLocationSuccessMsg').innerHTML = successtext;
                   // $('#editLocationModal').modal('hide');
                   
                    
                    locationFill();
                    getUsers();
                },
                error:function(err){
                    console.log(err);
                }
            })     
        })

    }

}

function deleteLocation(){


    $('#smallScreenOptionsModal').modal('hide');
    $('#deleteLocationModal').modal('show');
    $('.close').on('click', function(){
        $('#deleteLocationModal').modal('hide');
        $('#deleteLocationConfirm').off('click');
    })
    document.getElementById('deleteLocConfirmMsg').style.display = 'none';
    document.getElementById('deleteLocationConfirm').style.display = 'block';
    let deleteLocMsg = document.getElementById('deleteLocMsg');
    let selectLocationToDeleteMsg = document.getElementById('selectLocationToDeleteMsg');

  
    deleteLocMsg.style.display = 'none';
    selectLocationToDeleteMsg.style.display = 'none';

    let deleteLocId = document.getElementById('location-fill')
    let deleteLocIdModal = document.getElementById('location-fill-modal')
    let text = $('#location-fill>option:selected').text();
    let confirmMsg = `Are you sure you would like to delete ${text} from the directory?`
    deleteLocMsg.innerHTML = confirmMsg;

    if (deleteLocId.value == "" && deleteLocIdModal.value == ''){
        deleteLocMsg.style.display = 'none';
        selectLocationToDeleteMsg.style.display = 'block';
        document.getElementById('deleteLocationConfirm').style.display = 'none';  
    } else if(deleteLocId.value == "" && deleteLocIdModal.value != ""){
        let textModal = $('#location-fill-modal>option:selected').text();
        let confirmMsgModal = `Are you sure you would like to delete ${textModal} from the directory?`
     
        document.getElementById('deleteLocMsg').innerHTML = confirmMsgModal;
        deleteLocMsg.style.display = 'block';
        $('#deleteLocationConfirm').one('click', function(){
            
            $.ajax({
                url: 'libs/php/deleteLocation.php',
                dataType: 'JSON',
                type: 'POST',
                data: {
                    id: deleteLocIdModal.value
                },
                success:function(res){
                    
                    let txt = res.data.message
                    document.getElementById('deleteLocMsg').style.display = 'none';
                    document.getElementById('deleteLocationConfirm').style.display = 'none';
                    document.getElementById('deleteLocConfirmMsg').style.display = 'block';
                    
                   
                    document.getElementById('deleteLocConfirmMsg').innerHTML = txt;
                   // $('#editLocationModal').modal('hide');
                   
                    
                    locationFill();
                    getUsers();
                },
                error:function(err){
                    console.log(err);
                }
            }) 
        })
   
    } else {
        deleteLocMsg.style.display = 'block';
        $('#deleteLocationConfirm').one('click', function(){
            $.ajax({
                url: 'libs/php/deleteLocation.php',
                dataType: 'JSON',
                type: 'POST',
                data: {
                    id: deleteLocId.value
                },
                success:function(res){
                   
                    let txt = res.data.message
                    document.getElementById('deleteLocMsg').style.display = 'none';
                    document.getElementById('deleteLocationConfirm').style.display = 'none';
                    document.getElementById('deleteLocConfirmMsg').style.display = 'block';
                    
                   
                    document.getElementById('deleteLocConfirmMsg').innerHTML = txt;
                   // $('#editLocationModal').modal('hide');
                   
                    
                    locationFill();
                    getUsers();
                },
                error:function(err){
                    console.log(err);
                }
            })     
        })
    }

}


getUsers();

departmentFill();

locationFill();












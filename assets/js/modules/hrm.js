async function send_hrmPost(str, data) {
    let [action, endpoint] = str.split(' ');

    try {
        const response = await $.post(`${base_url}/app/hrm_controller.php?action=${action}&endpoint=${endpoint}`, data);
        return response;
    } catch (error) {
        console.error('Error occurred during the request:', error);
        return null;
    }
}
document.addEventListener("DOMContentLoaded", function() {
	// console.log('HRM is here')
	// $('#add_employee').modal('show');
	
	$(document).on('click', '.add-educationRow', function(e) {
	    e.preventDefault();
	    let prevRow = $(e.target).closest('.row');
	    // Hide all "Add" buttons
	    $('button.add-educationRow').css('display', 'none');
	    $('button.remove-educationRow').css('display', 'block');
	    let newRow = `<div class="row education-row">
	        <div class="col col-xs-12 col-md-6 col-lg-4">
	            <div class="form-group">
	                <input type="text" class="form-control degree" id="degree" name="degree">
	                <span class="form-error text-danger">This is error</span>
	            </div>
	        </div>
	        <div class="col col-xs-12 col-md-6 col-lg-3">
	            <div class="form-group">
	                <input type="text" class="form-control institution" id="institution" name="institution">
	                <span class="form-error text-danger">This is error</span>
	            </div>
	        </div>
	        <div class="col col-xs-12 col-md-6 col-lg-2">
	            <div class="form-group">
	                <input type="text" class="form-control startYear" onkeypress="return isNumberKey(event)" id="startYear" name="startYear">
	                <span class="form-error text-danger">This is error</span>
	            </div>
	        </div>
	        <div class="col col-xs-12 col-md-6 col-lg-2">
	            <div class="form-group">
	                <input type="text" class="form-control endYear" onkeypress="return isNumberKey(event)" id="endYear" name="endYear">
	                <span class="form-error text-danger">This is error</span>
	            </div>
	        </div>
	        <div class="col col-xs-12 col-md-6 col-lg-1">
	            <div class="form-group">
	                <button type="button" class="btn form-control add-educationRow btn-info cursor" style="color: #fff;" >
                    	<i class="fa fa-plus-square"></i>
                    </button>
	                <button type="button" class="btn form-control remove-educationRow btn-danger cursor" style="display: none;">
	                	<i class="fa fa-trash"></i>
	                </button>
	            </div>
	        </div>
	    </div>`;

	    // Insert the new row after the current row
	    $(prevRow).after(newRow);
	});

	$(document).on('click', '.remove-educationRow', function(e) {
	    e.preventDefault();
	    let prevRow = $(e.target).closest('.row');
	    $(prevRow).fadeOut(500, function() {
	        $(this).remove();
	    });
	});

	$('#addEmployeeForm').on('submit', (e) => {
		handle_addEmployeeForm(e.target);
		return false
	})

	$('#editEmployeeForm').on('submit', (e) => {
		handle_editEmployeeForm(e.target);
		return false
	})

	$('#profile-img').on('change', async (e) => {
	    let employee_id = $('#employee_id').val();
	    let fileInput = $('#profile-img');
	    let file = fileInput[0].files[0];
	    let allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

	    // Validate file type
	    if (!file) {
	        alert('Please select a file.');
	        return;
	    }

	    let ext = file.name.split('.').pop().toLowerCase();
	    if (!allowedExtensions.includes(ext)) {
	        alert('Invalid file type. Please upload an image (jpg, jpeg, png, gif).');
	        return;
	    }

	    // Check file size (e.g., 5MB max)
	    if (file.size > 5 * 1024 * 1024) {
	        alert('File size exceeds the maximum limit of 5MB.');
	        return;
	    }

	    let formData = new FormData();
	    formData.append('employee_id', employee_id);
	    formData.append('avatar', file);

	    var ajax = new XMLHttpRequest();
		ajax.addEventListener("load", function(event) {
			console.log(event.target.response)
			let res = JSON.parse(event.target.response)
			if(res.error) {
				toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 5000 });
				return false;
			} else {
				toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration: 2000 }).then(() => {
                    location.reload();
                });
			}
		});
		
		ajax.open("POST", `${base_url}/app/hrm_controller.php?action=update&endpoint=employee_avatar`);
		ajax.send(formData);

	   
	});


	// Upload emplyees
	$('#upload_employeesInput').on('change', async (e) => {
	    let fileInput = $('#upload_employeesInput');
	    let file = fileInput[0].files[0];
	    let allowedExtensions = ['csv'];

	    // Validate file type
	    if (!file) {
	    	$('#upload_employeesInput').val('');
	        alert('Please select a file.');
	        return;
	    }

	    let ext = file.name.split('.').pop().toLowerCase();
	    if (!allowedExtensions.includes(ext)) {
	    	$('#upload_employeesInput').val('');
	        alert('Invalid file type. Please upload a csv  file.');
	        return;
	    }
		return false;	   
	});

	$('#upload_employeesForm').on('submit', (e) => {
		handle_upload_employeesForm(e.target);
		return false
	})

	load_employees();

	$('.filter#slcDepartment, .filter#slcState, .filter#slcLocation, .filter#slcStatus').on('change', () => {
		let department = $('.filter#slcDepartment').val();
		let state = $('.filter#slcState').val();
		let location = $('.filter#slcLocation').val();
		let status = $('.filter#slcStatus').val();

		load_employees(department, state, location, status);
	})
	
	

});	

function load_employees(department = '', state = '', location = '', status = '') {
	var datatable = $('#employeesDT').DataTable({
		// let datatable = new DataTable('#companyDT', {
	    "processing": true,
	    "serverSide": true,
	    "bDestroy": true,
	    "searching": true,  
	    "info": true,
	    "columnDefs": [
	        { "orderable": false, "searchable": false, "targets": [7] }  // Disable search on first and last columns
	    ],
	    "serverMethod": 'post',
	    "ajax": {
	        "url": "./app/hrm_controller.php?action=load&endpoint=employees",
	        "method": "POST",
	         "data": {
	            "department": department,
	            "state": state,
	            "location": location,
	            "status": status,
	        },
		    // dataFilter: function(data) {
			// 	console.log(data)
			// }
	    },
	    
	    "createdRow": function(row, data, dataIndex) { 
	    	// Add your custom class to the row 
	    	$(row).addClass('table-row ' +data.status.toLowerCase());
	    },
	    columns: [
	    	{ title: `Staff No.`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.staff_no}</span>
	                </div>`;
	        }},

	        { title: `Full name`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.full_name}</span>
	                </div>`;
	        }},

	        { title: `Phone Number`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.phone_number}</span>
	                </div>`;
	        }},

	        { title: `Emai;`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.email}</span>
	                </div>`;
	        }},

	        { title: `Position;`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.position}</span>
	                </div>`;
	        }},

	       { title: `Hire date;`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${formatDate(row.hire_date)}</span>
	                </div>`;
	        }},

	        { title: `Salary;`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${formatMoney(row.salary)}</span>
	                </div>`;
	        }},


	        { title: `Status`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.status}</span>
	                </div>`;
	        }},

	        { title: "Action", data: null, render: function(data, type, row) {
	            return `<div class="sflex scenter-items">
	            	<a href="${base_url}/employees/show/${row.employee_id}" class="fa smt-5 cursor smr-10 fa-eye"></a>
            		<a href="${base_url}/employees/edit/${row.employee_id}" class="fa  smt-5 cursor smr-10 fa-pencil"></a>
            		<span data-recid="${row.employee_id}" class="fa delete_employee smt-5 cursor fa-trash"></span>
                </div>`;
	        }},
	    ]
	});

	return false;
}


async function handle_addEmployeeForm(form) {
	clearErrors();
	 
    let error = validateForm(form)

    let fullName 	= $(form).find('#full-name').val();
    let phone 		= $(form).find('#phone').val();
    let email 		= $(form).find('#email').val();
    let staffNo 	= $(form).find('#staffNo').val();
    let nationalID 	= $(form).find('#nationalID').val();
    let gender 		= $(form).find('#gender').val();
    let dob 		= $(form).find('#dob').val();
    let address 	= $(form).find('#address').val();
    let state 		= $(form).find('#state').val();
    let stateName 	= $(form).find('#state option:selected').text();
    let city 		= $(form).find('#city').val();
    let bankName 	= $(form).find('#bankName').val();
    let accountNo 	= $(form).find('#accountNo').val();

    let position 	= $(form).find('#position').val();
    let project_id 	= $(form).find('#project').val();
    let project 	= $(form).find('#project option:selected').val();
    let dep 		= $(form).find('#dep').val();
    let depName 	= $(form).find('#dep option:selected').text();
    let dutyStation = $(form).find('#dutyStation').val();
    let dutyStationName = $(form).find('#dutyStation option:selected').val();
    let designation = $(form).find('#designation').val();
    let contractType 	= $(form).find('#contractType').val();
    let mohContract 	= $(form).find('#mohContract').val();
    let grade 			= $(form).find('#grade').val();
    let salary 		= $(form).find('#salary').val();
    let budgetCode 	= $(form).find('#budgetCode').val();
    let taxExempt 	= $(form).find('#taxExempt').val();
    let hireDate 		= $(form).find('#hireDate').val();
    let currentContract = $(form).find('#currentContract').val();
    let contractEnd 	= $(form).find('#contractEnd').val();
    let seniority 		= $(form).find('#seniority').val();
    let workDays 		= $(form).find('#workDays').val();
    let workHours 		= $(form).find('#workHours').val();

    let degree 			= [];
    let institution 	= [];
    let startYear 		= [];
    let endYear 		= [];

     $('.row.education-row').each((i, el) => {
     	if($(el).find('.degree').val()) {
	    	degree.push($(el).find('.degree').val());
	    	institution.push($(el).find('.institution').val());
	    	startYear.push($(el).find('.startYear').val());
	    	endYear.push($(el).find('.endYear').val());
	    }
    })

    console.log(degree, institution,startYear, endYear)

    if (error) return false;

    form_loading(form);

    let formData = {
        staff_no: staffNo,
        full_name: fullName,
        email: email,
        phone_number: phone,
        national_id: nationalID,
        gender: gender,
        date_of_birth: dob,
        state_id: state,
        state: stateName,
        city: city,
        address: address,
        branch_id : dep,
        branch : depName,
        location_id : dutyStation,
        location_name : dutyStationName,
        position : position,
        project_id:project_id,
        project:project,
        designation:designation,
        hire_date : hireDate,
        contract_start : currentContract,
        contract_end : contractEnd,
        work_days : workDays,
        work_hours : workHours,
        contract_type : contractType,
        salary:salary,
        budget_code : budgetCode,
        moh_contract : mohContract,
        payment_bank : bankName,
        payment_account : accountNo,
        grade : grade,
        tax_exempt : taxExempt,
        seniority : seniority,

        degree:degree,
        institution:institution,
        startYear:startYear,
        endYear:endYear

    }

    try {
        let response = await send_hrmPost('save employee', formData);
        console.log(response)
        // return false;

        if (response) {
            let res = JSON.parse(response)
            $('#add_branch').modal('hide');
            if(res.error) {
            	toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 5000 });
            } else {
            	toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration:2000 }).then(() => {
            		window.location = `${base_url}/employees`
            	});
            	console.log(res)
            }
        } else {
            console.log('Failed to save branch.' + response);
        }

    } catch (err) {
        console.error('Error occurred during form submission:', err);
    }

    return false;
}

async function handle_editEmployeeForm(form) {
	clearErrors();
	 
    let error = validateForm(form)

    let employee_id 	= $(form).find('#employee_id').val();
    let fullName 	= $(form).find('#full-name').val();
    let phone 		= $(form).find('#phone').val();
    let email 		= $(form).find('#email').val();
    let slcStatus 	= $(form).find('#slcStatus').val();
    let staffNo 	= $(form).find('#staffNo').val();
    let nationalID 	= $(form).find('#nationalID').val();
    let gender 		= $(form).find('#gender').val();
    let dob 		= $(form).find('#dob').val();
    let address 	= $(form).find('#address').val();
    let state 		= $(form).find('#state').val();
    let stateName 	= $(form).find('#state option:selected').text();
    let city 		= $(form).find('#city').val();
    let bankName 	= $(form).find('#bankName').val();
    let accountNo 	= $(form).find('#accountNo').val();

    let position 	= $(form).find('#position').val();
    let project_id 	= $(form).find('#project').val();
    let project 	= $(form).find('#project option:selected').val();
    let dep 		= $(form).find('#dep').val();
    let depName 	= $(form).find('#dep option:selected').text();
    let dutyStation = $(form).find('#dutyStation').val();
    let dutyStationName = $(form).find('#dutyStation option:selected').val();
    let designation = $(form).find('#designation').val();
    let contractType 	= $(form).find('#contractType').val();
    let mohContract 	= $(form).find('#mohContract').val();
    let grade 			= $(form).find('#grade').val();
    let salary 		= $(form).find('#salary').val();
    let budgetCode 	= $(form).find('#budgetCode').val();
    let taxExempt 	= $(form).find('#taxExempt').val();
    let hireDate 		= $(form).find('#hireDate').val();
    let currentContract = $(form).find('#currentContract').val();
    let contractEnd 	= $(form).find('#contractEnd').val();
    let seniority 		= $(form).find('#seniority').val();
    let workDays 		= $(form).find('#workDays').val();
    let workHours 		= $(form).find('#workHours').val();

    let degree 			= [];
    let institution 	= [];
    let startYear 		= [];
    let endYear 		= [];

     $('.row.education-row').each((i, el) => {
     	if($(el).find('.degree').val()) {
	    	degree.push($(el).find('.degree').val());
	    	institution.push($(el).find('.institution').val());
	    	startYear.push($(el).find('.startYear').val());
	    	endYear.push($(el).find('.endYear').val());
	    }
    })

    console.log(degree, institution,startYear, endYear)

    // return false;

    if (error) return false;

    form_loading(form);

    let formData = {
     	employee_id:employee_id,
        staff_no: staffNo,
        full_name: fullName,
        email: email,
        status:slcStatus,
        phone_number: phone,
        national_id: nationalID,
        gender: gender,
        date_of_birth: dob,
        state_id: state,
        state: stateName,
        city: city,
        address: address,
        branch_id : dep,
        branch : depName,
        location_id : dutyStation,
        location_name : dutyStationName,
        position : position,
        project_id:project_id,
        project:project,
        designation:designation,
        hire_date : hireDate,
        contract_start : currentContract,
        contract_end : contractEnd,
        work_days : workDays,
        work_hours : workHours,
        contract_type : contractType,
        salary:salary,
        budget_code : budgetCode,
        moh_contract : mohContract,
        payment_bank : bankName,
        payment_account : accountNo,
        grade : grade,
        tax_exempt : taxExempt,
        seniority : seniority,

        degree:degree,
        institution:institution,
        startYear:startYear,
        endYear:endYear

    }

    try {
        let response = await send_hrmPost('update employee', formData);
        console.log(response)
        // return false;

        if (response) {
            let res = JSON.parse(response)
            $('#add_branch').modal('hide');
            if(res.error) {
            	toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 5000 });
            } else {
            	toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration:2000 }).then(() => {
            		window.location = `${base_url}/employees`
            	});
            	console.log(res)
            }
        } else {
            console.log('Failed to save branch.' + response);
        }

    } catch (err) {
        console.error('Error occurred during form submission:', err);
    }

    return false;
}

async function handle_upload_employeesForm(form) {
	let fileInput = $(form).find('#upload_employeesInput');
    let file = fileInput[0].files[0];
    let allowedExtensions = ['csv'];

    // Validate file type
    if (!file) {
        alert('Please select a file.');
        return;
    }

    let ext = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        alert('Invalid file type. Please upload a csv  file.');
        return;
    }

    let formData = new FormData();
    formData.append('file', file);

    form_loading(form);
    var ajax = new XMLHttpRequest();
	ajax.addEventListener("load", function(event) {
		console.log(event.target.response)
		let res = JSON.parse(event.target.response)
		if(res.error) {
			toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 5000 });
			return false;
		} else if(res.errors) {
			swal('Sorry', `${res.errors} \n`, 'error');
			return false;
		} else {
			toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration: 2000 }).then(() => {
                location.reload();
            });
		}
	});
	
	ajax.open("POST", `${base_url}/app/hrm_controller.php?action=save&endpoint=upload_employees`);
	ajax.send(formData);
}
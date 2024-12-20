async function send_payrollPost(str, data) {
    let [action, endpoint] = str.split(' ');

    try {
        const response = await $.post(`${base_url}/app/payroll_controller.php?action=${action}&endpoint=${endpoint}`, data);
        return response;
    } catch (error) {
        console.error('Error occurred during the request:', error);
        return null;
    }
}

//Transactions
function load_transactions() {
	function check_actions(row) {
		let actions = '';
		if(row.payroll_id == 0) {
			actions += `<span data-recid="${row.transaction_id}" class="fa delete_transaction smt-5 cursor fa-trash"></span>`
		}

		return actions;
	}
	var datatable = $('#transactionsDT').DataTable({
		// let datatable = new DataTable('#companyDT', {
	    "processing": true,
	    "serverSide": true,
	    "bDestroy": true,
	    // "searching": false,  
	    "info": false,
	    "columnDefs": [
	        { "orderable": false, "searchable": false,  "targets": [7] }  // Disable search on first and last columns
	    ],
	    "serverMethod": 'post',
	    "ajax": {
	        "url": "./app/payroll_controller.php?action=load&endpoint=transactions",
	        "method": "POST",
		    /*dataFilter: function(data) {
				console.log(data)
			}*/
	    },
	    
	    "createdRow": function(row, data, dataIndex) { 
	    	// Add your custom class to the row 
	    	// $(row).addClass('table-row ' +data.status.toLowerCase());
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

	        { title: `Transactions type`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.transaction_type}</span>
	                </div>`;
	        }},

	        { title: `Transactions subtype`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.transaction_subtype}</span>
	                </div>`;
	        }},

	        { title: `Amount`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${formatMoney(row.amount)}</span>
	                </div>`;
	        }},

	        { title: `Status`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.status}</span>
	                </div>`;
	        }},

	      
	        { title: `Date `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${formatDate(row.date)}</span>
	                </div>`;
	        }},

	        { title: "Action", data: null, render: function(data, type, row) {
	            return `<div class="sflex scenter-items">
            		<span data-recid="${row.transaction_id}" class="fa edit_transactionInfo smt-5 cursor smr-10 fa-pencil"></span>
            			${check_actions(row)}
                </div>`;
	        }},
	    ]
	});

	return false;
}

function handleTransactions() {
	$('#addTransactionForm').on('submit', (e) => {
		handle_addTransactionForm(e.target);
		return false
	})

	load_transactions();

	// Attendance for change
	$(document).on('change', '.slcTransFor', (e) => {
		let transFor = $(e.target).val();
		if(transFor == 'All') {
			$('.attenForDiv').html('')
		} else {
			$.post(`./app/payroll_controller.php?action=search&endpoint=trans_for`, {transFor:transFor}, function(data) {
				// console.log(data)
				let res = JSON.parse(data);
				if(!res.error) {
					$('.attenForDiv').html(res.data)

					$('.my-select').selectpicker({
					    noneResultsText: "No results found"
					});


					$('.my-select').selectpicker('refresh');
				} else {
					swal('Ooops', res.msg, 'error');
					return false;
				}
			})
		}
	})

	// Edit location
	$(document).on('click', '.edit_payrollInfo', async (e) => {
	    let id = $(e.currentTarget).data('recid');
	    let modal = $('#edit_transaction');

	    let data = await get_payroll(id);
	    console.log(id)
	    if(data) {
	    	let res = JSON.parse(data);
	    	console.log(res)
	    	$(modal).find('#transaction_id').val(id);
	    	$(modal).find('#employee_name').val(`${res.full_name}, ${res.phone_number}`);
	    	$(modal).find('#transType4Edit').val(res.transaction_type);
	    	$(modal).find('#transSubType4Edit').val(res.transaction_subtype);
	    	$(modal).find('#transAmount4Edit').val(res.amount);
	    	$(modal).find('#transStatus4Edit').val(res.status);
	    	$(modal).find('#transDate4Edit').val(res.date);
	    	$(modal).find('#txtComments4Edit').val(res.description);

	    }

	    $(modal).modal('show');
	});


	// Edit location info form
	$('#editTransactionForm').on('submit', (e) => {
		handle_editTransactionForm(e.target);
		return false
	})

	// Delete location
	$(document).on('click', '.delete_transaction', async (e) => {
	    let id = $(e.currentTarget).data('recid');
	    swal({
	        title: "Are you sure?",
	        text: `You are going to delete this transaction  record.`,
	        icon: "warning",
	        className: 'warning-swal',
	        buttons: ["Cancel", "Yes, delete"],
	    }).then(async (confirm) => {
	        if (confirm) {
	            let data = { id: id };
	            try {
	                let response = await send_payrollPost('delete transaction', data);
	                console.log(response)
	                if (response) {
	                    let res = JSON.parse(response);
	                    if (res.error) {
	                        toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 3000 }).then(() => {
			            		location.reload();
			            	});;
	                    } else {
	                        toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration: 1000 }).then(() => {
	                            location.reload();
	                            // load_branches();
	                        });
	                        console.log(res);
	                    }
	                } else {
	                    console.log('Failed to edit state.' + response);
	                }

	            } catch (err) {
	                console.error('Error occurred during form submission:', err);
	            }
	        }
	    });
	});

	// Download sample file
	$('#downloadTransactionUploadForm').on('submit', (e) => {
		handle_downloadTransactionUploadForm(e.target);
		return false
	})

	// Upload attendance
	$('#transaction_uploadForm').on('submit', (e) => {
		handle_transaction_uploadForm(e.target);
		return false
	})
}

async function handle_addTransactionForm(form) {
    clearErrors();
    let error = validateForm(form)
    let ref_id, ref_name, err_mgs = '';

    let emp_id = $(form).find('#searchEmployee').val();
	let full_name = $(form).find('#searchEmployee option:selected').text();
	full_name = full_name.split(',')[0]
	err_mgs = 'employee';


    let transType = $(form).find('#transType').val();
    let transSubType = $(form).find('#transSubType').val();
    let transAmount = $(form).find('#transAmount').val();
    let transStatus = $(form).find('#transStatus').val();
    let transDate = $(form).find('#transDate').val();
    let txtComments = $(form).find('#txtComments').val();

    if(!emp_id) {
    	swal('Sorry', `Please select ${err_mgs}`, 'error')
    	return false;
    }

    if (error) return false;

    let formData = {
        emp_id: emp_id,
        transaction_type: transType,
        transaction_subtype:transSubType,
        amount:transAmount,
        date:transDate,
        status:transStatus,
        description:txtComments,
    };

    form_loading(form);

    try {
        let response = await send_payrollPost('save transaction', formData);
        console.log(response)
        if (response) {
            let res = JSON.parse(response)
            if(res.error) {
            	toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 1000 }).then(() => {
            		location.reload();
            	});
            } else {
            	toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration:1000 }).then(() => {
            		location.reload();
            		// load_budgetCodes();
            	});
            	console.log(res)
            }
        } else {
            console.log('Failed to save state.' + response);
        }

    } catch (err) {
        console.error('Error occurred during form submission:', err);
    }
}

async function handle_editTransactionForm(form) {
    clearErrors();
    let error = validateForm(form)
    let transaction_id 			= $(form).find('#transaction_id').val();
    let transType 		= $(form).find('#transType4Edit').val();
    let transSubType 	= $(form).find('#transSubType4Edit').val();
    let transAmount 	= $(form).find('#transAmount4Edit').val();
    let transStatus 	= $(form).find('#transStatus4Edit').val();
    let transDate 		= $(form).find('#transDate4Edit').val();
    let txtComments 	= $(form).find('#txtComments4Edit').val();

    if (error) return false;

    let formData = {
        transaction_id: transaction_id,
        transaction_type: transType,
        transaction_subtype:transSubType,
        amount:transAmount,
        date:transDate,
        status:transStatus,
        description:txtComments,
    };

    form_loading(form);

    try {
        let response = await send_payrollPost('update transaction', formData);
        console.log(response)
        if (response) {
            let res = JSON.parse(response)
            if(res.error) {
            	toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 1000 }).then(() => {
            		location.reload();
            	});
            } else {
            	toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration:1000 }).then(() => {
            		location.reload();
            		// load_budgetCodes();
            	});
            	console.log(res)
            }
        } else {
            console.log('Failed to save state.' + response);
        }

    } catch (err) {
        console.error('Error occurred during form submission:', err);
    }
}

async function get_transaction(id) {
	let data = {id};
	let response = await send_payrollPost('get transaction', data);
	return response;
}

async function handle_downloadTransactionUploadForm(form) {
    clearErrors();
    let error = validateForm(form)
    let ref_id, ref_name, err_mgs = '';
    let transFor = $(form).find('#slcTransFor').val();
    console.log(transFor)

    if(transFor == 'Department') {
    	ref_id = $(form).find('#searchDepartment').val();
    	ref_name = $(form).find('#searchDepartment option:selected').text();
    	err_mgs = 'department';
    } else if(transFor == 'Location') {
    	ref_id = $(form).find('#searchLocation').val();
    	ref_name = $(form).find('#searchLocation option:selected').text();
    	err_mgs = 'location';
    }

    let transDate = $(form).find('#transDate4Download').val();

    /*if(!ref_id) {
    	swal('Sorry', `Please select ${err_mgs}`, 'error')
    	return false;
    }*/

    if (error) return false;

    let formData = {
    	ref:transFor,
        ref_id: ref_id,
        ref_name: ref_name,
        date:transDate,
    };

    // form_loading(form);

    try {
        let response = await send_payrollPost('get downloadTransactionsCSV', formData);
        console.log(response)
        // return false;
        if (response) {
            let res = JSON.parse(response)
            if(res.error) {
            	toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 3000 }).then(() => {
            		location.reload();
            	});
            } else {
            	downloadCSV(res.data, filename = `Transactions upload file on ${formatDate(transDate)}.csv`);
				toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration:1000 }).then(() => {
            		let modal = $('#download_transactionUploadFile');
					$(modal).modal('hide');
            	});
            }
        } else {
            console.log('Failed to save state.' + response);
        }

    } catch (err) {
        console.error('Error occurred during form submission:', err);
    }

    return false;
}

async function handle_transaction_uploadForm(form) {
	let fileInput = $(form).find('#transaction_uploadInput');
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
	
	ajax.open("POST", `${base_url}/app/payroll_controller.php?action=save&endpoint=upload_transaction`);
	ajax.send(formData);
}

// Payroll
function load_payroll() {
	var datatable = $('#payrollDT').DataTable({
		// let datatable = new DataTable('#companyDT', {
	    "processing": true,
	    "serverSide": true,
	    "bDestroy": true,
	    // "searching": false,  
	    "info": false,
	    "columnDefs": [
	        { "orderable": false, "searchable": false,  "targets": [2, 4] }  // Disable search on first and last columns
	    ],
	    "serverMethod": 'post',
	    "ajax": {
	        "url": "./app/payroll_controller.php?action=load&endpoint=payroll",
	        "method": "POST",
		    /*dataFilter: function(data) {
				console.log(data)
			}*/
	    },
	    
	    "createdRow": function(row, data, dataIndex) { 
	    	// Add your custom class to the row 
	    	// $(row).addClass('table-row ' +data.status.toLowerCase());
	    },
	    columns: [

	    	{ title: `Payroll`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.ref} - ${row.ref_name}</span>
	                </div>`;
	        }},

	        { title: `Month `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${formatDate(row.month, 'month_name', false)}</span>
	                </div>`;
	        }},

	        { title: `Status `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.status} </span>
	                </div>`;
	        }},
	      

	        { title: `Employees `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.employee_count} employees</span>
	                </div>`;
	        }},
	      
	        { title: `Date added`, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${formatDate(row.added_date)}</span>
	                </div>`;
	        }},

	        { title: "Action", data: null, render: function(data, type, row) {
	            return `<div class="sflex scenter-items">
            		<a href="${base_url}/payroll/${row.id}" data-recid="${row.id}" class="fa edit_payrollInfo smt-5 cursor smr-10 fa-eye"></a>
            		<span data-recid="${row.id}" class="fa delete_payroll smt-5 cursor fa-trash"></span>
                </div>`;
	        }},
	    ]
	});

	return false;
}

// Payroll
function load_showPayroll() {
	function set_actions(row) {
		let actions = `<a data-recid="${row.id}" class="fa show_payslip smt-5 cursor smr-10 fa-eye"></a>`;
		if(row.status == 'Pending') {
			actions += `<a data-recid="${row.payroll_id}" data-emp_id="${row.emp_id}" class="fa approve_payrollBtn smt-5 cursor smr-10 fa-check"></a>`;
		} else if(row.status == 'Approved') {
			actions += `<a data-recid="${row.payroll_id}" data-emp_id="${row.emp_id}" class="fa pay_payrollBtn smt-5 cursor smr-10 fa-check"></a>`;
		} 

		actions += `<a data-recid="${row.id}" data-emp_id="${row.emp_id}" class="fa delete_payrollDetail smt-5 cursor smr-10 fa-trash"></a>`;

		return actions;
	}
	var datatable = $('#showpayrollDT').DataTable({
		// let datatable = new DataTable('#companyDT', {
	    "processing": true,
	    "serverSide": true,
	    "bDestroy": true,
	    // "searching": false,  
	    "info": false,
	    "columnDefs": [
	        { "orderable": false, "searchable": false,  "targets": [7] }  // Disable search on first and last columns
	    ],

	    "serverMethod": 'post',
	    "ajax": {
	        "url": `${base_url}/app/payroll_controller.php?action=load&endpoint=payroll_details`,
	        "method": "POST",
	        "data": {
	            "payroll_id": payroll_id,
	        },
		    /*dataFilter: function(data) {
				console.log(data)
			}*/
	    },
	    
	    "createdRow": function(row, data, dataIndex) { 
	    	// Add your custom class to the row 
	    	// $(row).addClass('table-row ' +data.status.toLowerCase());
	    },
	    columns: [

	    	{ title: `Staff No. `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.staff_no} </span>
	                </div>`;
	        }},

	        { title: `Full name `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.full_name} </span>
	                </div>`;
	        }},

	        { title: `Gross salary `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${formatMoney(row.base_salary)} </span>
	                </div>`;
	        }},

	        { title: `Earnings `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${formatMoney(row.earnings)} </span>
	                </div>`;
	        }},

	        { title: `Deductions `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${formatMoney(row.total_deductions)} </span>
	                </div>`;
	        }},

	        { title: `Tax `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${formatMoney(row.tax)} -  (${row.taxRate}%)</span>
	                </div>`;
	        }},

	        { title: `Net salary `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${formatMoney(row.net_salary)} </span>
	                </div>`;
	        }},

	        { title: `Status `, data: null, render: function(data, type, row) {
	            return `<div>
	            		<span>${row.status} </span>
	                </div>`;
	        }},


	        { title: "Action", data: null, render: function(data, type, row) {
	            return `<div class="sflex scenter-items">
            		${set_actions(row)}
                </div>`;
	        }},
	    ]
	});

	return false;
}



function handlePayroll() {
	$('#generatePayrollForm').on('submit', (e) => {
		handle_generatePayrollForm(e.target);
		return false
	})

	load_payroll();
	load_showPayroll();

	// Attendance for change
	$(document).on('change', '.slcTransFor', (e) => {
		let transFor = $(e.target).val();
		if(transFor == 'All') {
			$('.attenForDiv').html('')
		} else {
			$.post(`./app/payroll_controller.php?action=search&endpoint=trans_for`, {transFor:transFor}, function(data) {
				// console.log(data)
				let res = JSON.parse(data);
				if(!res.error) {
					$('.attenForDiv').html(res.data)

					$('.my-select').selectpicker({
					    noneResultsText: "No results found"
					});


					$('.my-select').selectpicker('refresh');
				} else {
					swal('Ooops', res.msg, 'error');
					return false;
				}
			})
		}
	})

	// Edit payroll
	$(document).on('click', '.edit_transactionInfo', async (e) => {
	    let id = $(e.currentTarget).data('recid');
	    let modal = $('#edit_transaction');

	    let data = await get_transaction(id);
	    console.log(id)
	    if(data) {
	    	let res = JSON.parse(data);
	    	console.log(res)
	    	$(modal).find('#transaction_id').val(id);
	    	$(modal).find('#employee_name').val(`${res.full_name}, ${res.phone_number}`);
	    	$(modal).find('#transType4Edit').val(res.transaction_type);
	    	$(modal).find('#transSubType4Edit').val(res.transaction_subtype);
	    	$(modal).find('#transAmount4Edit').val(res.amount);
	    	$(modal).find('#transStatus4Edit').val(res.status);
	    	$(modal).find('#transDate4Edit').val(res.date);
	    	$(modal).find('#txtComments4Edit').val(res.description);

	    }

	    $(modal).modal('show');
	});


	// Edit payroll info form
	$('#editTransactionForm').on('submit', (e) => {
		handle_editTransactionForm(e.target);
		return false
	})

	// Delete payroll
	$(document).on('click', '.delete_payroll', async (e) => {
	    let id = $(e.currentTarget).data('recid');
	    swal({
	        title: "Are you sure?",
	        text: `You are going to delete this payroll  record.`,
	        icon: "warning",
	        className: 'warning-swal',
	        buttons: ["Cancel", "Yes, delete"],
	    }).then(async (confirm) => {
	        if (confirm) {
	            let data = { id: id };
	            try {
	                let response = await send_payrollPost('delete payroll', data);
	                console.log(response)
	                if (response) {
	                    let res = JSON.parse(response);
	                    if (res.error) {
	                        toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 3000 }).then(() => {
			            		location.reload();
			            	});;
	                    } else {
	                        toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration: 1000 }).then(() => {
	                            location.reload();
	                            // load_branches();
	                        });
	                        console.log(res);
	                    }
	                } else {
	                    console.log('Failed to edit state.' + response);
	                }

	            } catch (err) {
	                console.error('Error occurred during form submission:', err);
	            }
	        }
	    });
	});

	// Approve payroll
	$(document).on('click', '.approve_payrollBtn', async (e) => {
	    let id = $(e.currentTarget).data('recid');
	    let emp_id = $(e.currentTarget).data('emp_id');
	    swal({
	        title: "Are you sure?",
	        text: `You are going to approve this payroll  record.`,
	        icon: "warning",
	        // className: 'warning-swal',
	        buttons: ["Cancel", "Yes, approve"],
	    }).then(async (confirm) => {
	        if (confirm) {
	            let data = { id: id, emp_id:emp_id };
	            try {
	                let response = await send_payrollPost('update approvePayroll', data);
	                console.log(response)
	                if (response) {
	                    let res = JSON.parse(response);
	                    if (res.error) {
	                        toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 3000 }).then(() => {
			            		location.reload();
			            	});;
	                    } else {
	                        toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration: 1000 }).then(() => {
	                            location.reload();
	                            // load_branches();
	                        });
	                        console.log(res);
	                    }
	                } else {
	                    console.log('Failed to edit state.' + response);
	                }

	            } catch (err) {
	                console.error('Error occurred during form submission:', err);
	            }
	        }
	    });
	});

	// Pay payroll
	/*$(document).on('click', '.pay_payrollBtn', async (e) => {
	    let id = $(e.currentTarget).data('recid');
	    let emp_id = $(e.currentTarget).data('emp_id');
	    swal({
	        title: "Are you sure?",
	        text: `You are going to pay this payroll  record.`,
	        icon: "warning",
	        // className: 'warning-swal',
	        buttons: ["Cancel", "Yes, pay"],
	    }).then(async (confirm) => {
	        if (confirm) {
	            let data = { id: id, emp_id:emp_id };
	            try {
	                let response = await send_payrollPost('update payPayroll', data);
	                console.log(response)
	                if (response) {
	                    let res = JSON.parse(response);
	                    if (res.error) {
	                        toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 3000 }).then(() => {
			            		location.reload();
			            	});;
	                    } else {
	                        toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration: 1000 }).then(() => {
	                            location.reload();
	                            // load_branches();
	                        });
	                        console.log(res);
	                    }
	                } else {
	                    console.log('Failed to edit state.' + response);
	                }

	            } catch (err) {
	                console.error('Error occurred during form submission:', err);
	            }
	        }
	    });
	});*/

	// Delete payroll detail
	$(document).on('click', '.delete_payrollDetail', async (e) => {
	    let id = $(e.currentTarget).data('recid');
	    swal({
	        title: "Are you sure?",
	        text: `You are going to delete this payroll detail  record.`,
	        icon: "warning",
	        className: 'warning-swal',
	        buttons: ["Cancel", "Yes, delete"],
	    }).then(async (confirm) => {
	        if (confirm) {
	            let data = { id: id };
	            try {
	                let response = await send_payrollPost('delete payrollDetail', data);
	                console.log(response)
	                if (response) {
	                    let res = JSON.parse(response);
	                    if (res.error) {
	                        toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: true, duration: 3000 }).then(() => {
			            		location.reload();
			            	});;
	                    } else {
	                        toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration: 1000 }).then(() => {
	                            location.reload();
	                            // load_branches();
	                        });
	                        console.log(res);
	                    }
	                } else {
	                    console.log('Failed to edit state.' + response);
	                }

	            } catch (err) {
	                console.error('Error occurred during form submission:', err);
	            }
	        }
	    });
	});
	// Download sample file
	$('#downloadTransactionUploadForm').on('submit', (e) => {
		handle_downloadTransactionUploadForm(e.target);
		return false
	})

	// Show payrol details
	$(document).on('click', '.show_payslip', async (e) => {
	    let id = $(e.currentTarget).data('recid');
	    let modal = $('#edit_transaction');
	    let data = await get_4payslipShow(id);
	    console.log(id)
	    if(data) {
	    	let res = JSON.parse(data);
	    	console.log(res)
	    	$(modal).find('#txtComments4Edit').val(res.description);
	    }

	    $(modal).modal('show');
	});
}

async function handle_generatePayrollForm(form) {
	clearErrors();
    let error = validateForm(form)
    let ref_id, ref_name, err_mgs = '';
    let transFor = $(form).find('#slcTransFor').val();
    console.log(transFor)

    if(transFor != 'All') {
	    if(transFor == 'Department') {
	    	ref_id = $(form).find('#searchDepartment').val();
	    	ref_name = $(form).find('#searchDepartment option:selected').text();
	    	err_mgs = 'department';
	    } else if(transFor == 'Location') {
	    	ref_id = $(form).find('#searchLocation').val();
	    	ref_name = $(form).find('#searchLocation option:selected').text();
	    	err_mgs = 'location';
	    } else if(transFor == 'Employee') {
	    	ref_id = $(form).find('#searchEmployee').val();
	    	ref_name = $(form).find('#searchEmployee option:selected').text();
	    	err_mgs = 'employee';
	    }
	}

    let month = $(form).find('#payrollMonth').val();

    if (error) return false;

    let formData = {
    	ref:transFor,
        ref_id: ref_id,
        ref_name: ref_name,
        month:month,
    };

    try {
        let response = await send_payrollPost('save payroll', formData);
        console.log(response)
        // return false;
        if (response) {
            let res = JSON.parse(response)
            if(res.error) {
            	toaster.warning(res.msg, 'Sorry', { top: '30%', right: '20px', hide: false, duration: 3000 }).then(() => {
            		// location.reload();
            	});
            } else {
				toaster.success(res.msg, 'Success', { top: '20%', right: '20px', hide: true, duration:1000 }).then(() => {
            		location.reload();
            	});
            }
        } else {
            console.log('Failed to save state.' + response);
        }

    } catch (err) {
        console.error('Error occurred during form submission:', err);
    }

    return false;
}

async function get_4payslipShow(id) {
	let data = {id};
	let response = await send_payrollPost('get 4payslipShow', data);
	return response;
}

document.addEventListener("DOMContentLoaded", function() {
	handleTransactions();
	handlePayroll();
	
	$('.my-select').selectpicker({
	    noneResultsText: "No results found"
	});

	// Search employee
	$(document).on('keyup', '.bootstrap-select.searchEmployee input.form-control', async (e) => {
    	let search = $(e.target).val();
    	let searchFor = 'leave';
    	let formData = {search:search, searchFor:searchFor}
		if(search) {
			try {
		        let response = await send_payrollPost('search employee4Select', formData);
		        console.log(response)
		        let res = JSON.parse(response);
		        if(!res.error) {
					$('#searchEmployee').html(res.options)
					$('.my-select').selectpicker('refresh');
				} 
		    } catch (err) {
		        console.error('Error occurred during form submission:', err);
		    }
		}
    })

    // Search department
	$(document).on('keyup', '.bootstrap-select.searchDepartment input.form-control', async (e) => {
    	let search = $(e.target).val();
    	let searchFor = 'leave';
    	let formData = {search:search, searchFor:searchFor}
		if(search) {
			try {
		        let response = await send_payrollPost('search department4Select', formData);
		        console.log(response)
		        let res = JSON.parse(response);
		        if(!res.error) {
					$('#searchDepartment').html(res.options)
					$('.my-select').selectpicker('refresh');
				} 
		    } catch (err) {
		        console.error('Error occurred during form submission:', err);
		    }
		}
    })
});


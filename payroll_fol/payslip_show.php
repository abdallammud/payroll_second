<div class="modal show fade" style="display:block;" data-bs-focus="false" id="show_payslip" tabindex="-1" role="dialog" aria-labelledby="show_payslipLabel" aria-hidden="true">
    <div class="modal-dialog" role="payslip" style="min-width:1000px; width: 90vw; max-width: 1200px;">
        <form class="modal-content" id="PayslipForm" style="border-radius: 14px 14px 0px 0px; margin-top: -15px;">
        	<div class="modal-header">
                <h5 class="modal-title">Payslip for the month <span class="paySlipMonth">December 2023</span></h5>
                <button type="button" class="close modal-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" >
                <div>
                	<div class="row">
                        <div class="col col-md-3 col-sm-12">
                        	<img class="w-100 " style="max-height: 230px;" src="<?=baseUri();?>/assets/images/avatars/01.png">
                        </div>

                        <div class="col  col-md-5 col-sm-12">
                        	<div class="border ">
                        		<div class="border-bottom p-2 sflex swrap  ">
                        			<span class=" sflex-basis-100">Employee name</span>
                        			<span class="bold sflex-basis-100">Full name</span>
                        		</div>
                        		<div class="border-bottom p-2 sflex swrap  ">
                        			<span class=" sflex-basis-100">Employee ID</span>
                        			<span class="bold sflex-basis-100">Full name</span>
                        		</div>
                        		<div class="border-bottom p-2 sflex swrap  ">
                        			<span class=" sflex-basis-100">Job title</span>
                        			<span class="bold sflex-basis-100">Full title</span>
                        		</div>
                        		<div class="border-bottom p-2 sflex swrap  ">
                        			<span class=" sflex-basis-100">Department</span>
                        			<span class="bold sflex-basis-100">Full title</span>
                        		</div>
                        	</div>
                        </div>

                        <div class="col  col-md-4 col-sm-12">
                        	<div class="border ">
                        		<div class="border-bottom p-2 sflex swrap  ">
                        			<span class=" sflex-basis-100">Payment method</span>
                        			<span class="bold sflex-basis-100">Full name</span>
                        		</div>
                        		<div class="border-bottom p-2 sflex swrap  ">
                        			<span class=" sflex-basis-100">Days worked</span>
                        			<span class="bold sflex-basis-100">Full name</span>
                        		</div>
                        		<div class="border-bottom p-2 sflex swrap  ">
                        			<span class=" sflex-basis-100">Job Status</span>
                        			<span class="bold sflex-basis-100">Full title</span>
                        		</div>
                        		<div class="border-bottom p-2 sflex swrap  ">
                        			<span class=" sflex-basis-100">Pay date</span>
                        			<span class="bold sflex-basis-100">Full title</span>
                        		</div>
                        	</div>
                        </div>
                    </div>
                    <div class="m-4"></div>
                    <h5 class="">Payroll details</h5>
                   	<table id="payrollDetails" class="table table-striped table-bordered" style="width:100%">
                   		<thead>
                   			<tr>
                   				<th>Earnings</th>
                   				<th>Amount</th>
                   				<th>Deductions</th>
                   				<th>Amount</th>
                   			</tr>
                   		</thead>
                   		<tbody>
                   			<tr>
                   				<td>Base salary</td>
                   				<td>Amount</td>
                   				<td>Un-paid days</td>
                   				<td>Amount</td>
                   			</tr>
                   			<tr>
                   				<td>Allowance</td>
                   				<td>Amount</td>
                   				<td>Un-paid hours</td>
                   				<td>Amount</td>
                   			</tr>
                   			<tr>
                   				<td>Commissions</td>
                   				<td>Amount</td>
                   				<td>Advance</td>
                   				<td>Amount</td>
                   			</tr>
                   			<tr>
                   				<td>Extra Hours</td>
                   				<td>Amount</td>
                   				<td>Loan</td>
                   				<td>Amount</td>
                   			</tr>
                   			<tr>
                   				<td>Bonus</td>
                   				<td>Amount</td>
                   				<td>Tax</td>
                   				<td>Amount</td>
                   			</tr>
                   			<tr>
                   				<td>Total Earnings</td>
                   				<td>Amount</td>
                   				<td>Total Deductions</td>
                   				<td>Amount</td>
                   			</tr>
                   			<tr>
                   				<td></td>
                   				<td>Net Salary</td>
                   				<td>Total Deductions</td>
                   				<td></td>
                   			</tr>
                   		</tbody>
                   	</table>

                    
                    
                </div>
            </div>

            
        </form>
    </div>
</div>

<style type="text/css">
	.dropdown.bootstrap-select.my-select {
		display: block;
		width: 100% !important;
	}
</style>
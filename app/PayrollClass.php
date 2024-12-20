<?php 
class EmployeeTransactions extends Model {
    public function __construct() {
        parent::__construct('employee_transactions', 'transaction_id');
    }
}

$GLOBALS['employeeTransactionsClass'] = $employeeTransactionsClass = new EmployeeTransactions();


// Payroll
class Payroll extends Model {
    public function __construct() {
        parent::__construct('payroll');
    }

    public function update_payrollRelatedTables($month, $payroll_id, $isDelete = false) {
        $conn = $GLOBALS['conn'];

        if($isDelete) $payroll_id = 0;

        $attendance = $conn->prepare("UPDATE `attendance` SET `payroll_id`=? WHERE `atten_date` LIKE '$month%'");
        $attendance->bind_param("s", $payroll_id);
        $attendance->execute();

        // Timesheet
        $timesheet = $conn->prepare("UPDATE `timesheet` SET `payroll_id`=? WHERE `ts_date` LIKE '$month%'");
        $timesheet->bind_param("s", $payroll_id);
        $timesheet->execute();

         // Transactions
        $transactions = $conn->prepare("UPDATE `employee_transactions` SET `payroll_id`=? WHERE `date` LIKE '$month%'");
        $transactions->bind_param("s", $payroll_id);
        $transactions->execute();

    }
}

$GLOBALS['payrollClass'] = $payrollClass = new Payroll();

// Payroll details
class PayrollDetailsClass extends Model {
    public function __construct() {
        parent::__construct('payroll_details');
    }
}

$GLOBALS['payrollDetailsClass'] = $payrollDetailsClass = new PayrollDetailsClass();
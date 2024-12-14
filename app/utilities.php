<?php 
function baseUri() {
    // Check if we are on HTTPS or HTTP
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    
    // Get the server name and the current path
    $host = $_SERVER['HTTP_HOST'];
    $path = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
    
    // Determine if it's a live environment or a local project directory
    if ($host === 'localhost' || $host === '127.0.0.1') {
        // For local development (e.g., subfolder)
        $baseUri = $protocol . $host . $path;
    } else {
        // For production (e.g., domain)
        $baseUri = $protocol . $host;
    }

    $GLOBALS['baseUri'] = $baseUri;

    return $baseUri;
}

function load_js_module() {
    if(isset($_GET['menu'])) {
        $menu = $_GET['menu'];
        if($menu == 'dashboard') {
            echo '<script src="assets/plugins/apexchart/apexcharts.min.js"></script>
                <script src="assets/js/dashboard2.js"></script>';
        } else {
            echo '<script type="text/javascript" src="'.baseUri().'/assets/js/modules/'.$menu.'.js"></script>';
        }
        
    }
}
function json($array) {
    echo json_encode($array);
}


function formatMoney($amount, $currencySymbol = '$', $decimals = 2) {
    $formattedAmount = number_format($amount, $decimals, '.', ',');
    return $currencySymbol . $formattedAmount;
}

function usernameFromEmail($email) {
    $username = strtok($email, '@');
    return $username;
}

function formatDate($dateString, $format = 'name', $time = false) {
    $date = new DateTime($dateString);

    if (!$date) {
        return "Invalid Date";
    }

    switch ($format) {
        case 'name':
            $return = $date->format('F d, Y');
            break;
        case '-':
            $return = $date->format('d-m-Y');
            break;
        case '/':
            $return = $date->format('d/m/Y');
            break;
        default:
            $return = $date->format('F d, Y');
    }

    if ($time) {
        $return .= ' ' . $date->format('H:i');
    }

    return $return;
}

function getDateDifference($startDate, $endDate) {
    // Convert the dates into DateTime objects
    $start = new DateTime($startDate);
    $end = new DateTime($endDate);
    
    // Calculate the difference
    $difference = $start->diff($end);
    
    // Extract months and days
    $months = $difference->m + ($difference->y * 12); // Total months, including years converted to months
    $days = $difference->d; // Remaining days
    
    // Get total days
    $totalDays = $start->diff($end)->days;

    // Format the result
    $result = [];
    if ($months > 0) {
        $result[] = "$months month" . ($months > 1 ? 's' : '');
    }
    if ($days > 0 || empty($result)) {
        $result[] = "$days day" . ($days > 1 ? 's' : '');
    }

    // Return the result as an array
    return [
        'description' => implode(' and ', $result), // Human-readable string
        'totalDays' => $totalDays // Total number of days
    ];
}


?>
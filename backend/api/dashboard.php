<?php

require_once __DIR__ . '/../middleware/jwt.php';

/**
 * DASHBOARD API
 * This file fetches all dashboard data
 */

function dashboardSummary() {

    verifyJWT();

    /**
     * -----------------------------------
     * TOTAL ANIMALS
     * -----------------------------------
     */
    $totalAnimals = fetchOne(

        "SELECT COUNT(*) as total
         FROM animals
         WHERE is_active = 1"

    )['total'] ?? 0;

    /**
     * -----------------------------------
     * TODAY MILK TOTAL
     * -----------------------------------
     */
    $todayMilk = fetchOne(

        "SELECT IFNULL(SUM(quantity_ltr),0) as total
         FROM milk_records
         WHERE milk_date = CURDATE()"

    )['total'] ?? 0;

    /**
     * -----------------------------------
     * MONTH REVENUE
     * -----------------------------------
     */
    $monthRevenue = fetchOne(

        "SELECT IFNULL(SUM(amount),0) as total
         FROM sales_records
         WHERE MONTH(sale_date) = MONTH(CURDATE())
         AND YEAR(sale_date) = YEAR(CURDATE())"

    )['total'] ?? 0;

    /**
     * -----------------------------------
     * FEED STOCK
     * -----------------------------------
     */
    $feedStock = fetchOne(

        "SELECT IFNULL(SUM(quantity),0) as total
         FROM stock_entries
         WHERE quantity > 0"

    )['total'] ?? 0;

    /**
     * -----------------------------------
     * LAST 7 DAYS MILK PRODUCTION
     * -----------------------------------
     */
    $milkProduction = fetchAll(

        "SELECT

            milk_date,

            IFNULL(SUM(quantity_ltr),0) as total,

            IFNULL(SUM(
                CASE
                    WHEN time_of_day = 'Morning'
                    THEN quantity_ltr
                    ELSE 0
                END
            ),0) as am,

            IFNULL(SUM(
                CASE
                    WHEN time_of_day = 'Evening'
                    THEN quantity_ltr
                    ELSE 0
                END
            ),0) as pm

         FROM milk_records

         WHERE milk_date >= CURDATE() - INTERVAL 7 DAY

         GROUP BY milk_date

         ORDER BY milk_date ASC"

    );

    /**
     * -----------------------------------
     * BREED DISTRIBUTION
     * -----------------------------------
     */
    $breedDistribution = fetchAll(

        "SELECT

            breed,
            COUNT(*) as total

         FROM animals

         WHERE breed IS NOT NULL
         AND breed != ''

         GROUP BY breed

         ORDER BY total DESC"

    );

    /**
     * -----------------------------------
     * MONTHLY REVENUE VS EXPENSES
     * -----------------------------------
     */
    $finance = fetchAll(

        "SELECT

            months.month_name,

            IFNULL(sales.total_revenue,0) as revenue,

            IFNULL(expenses.total_expense,0) as expenses

         FROM (

            SELECT 'Jan' as month_name, 1 as month_no
            UNION SELECT 'Feb',2
            UNION SELECT 'Mar',3
            UNION SELECT 'Apr',4
            UNION SELECT 'May',5
            UNION SELECT 'Jun',6
            UNION SELECT 'Jul',7
            UNION SELECT 'Aug',8
            UNION SELECT 'Sep',9
            UNION SELECT 'Oct',10
            UNION SELECT 'Nov',11
            UNION SELECT 'Dec',12

         ) months

         LEFT JOIN (

            SELECT

                MONTH(sale_date) as month_no,
                SUM(amount) as total_revenue

            FROM sales_records

            WHERE YEAR(sale_date) = YEAR(CURDATE())

            GROUP BY MONTH(sale_date)

         ) sales

         ON months.month_no = sales.month_no

         LEFT JOIN (

            SELECT

                MONTH(entry_date) as month_no,
                SUM(quantity) as total_expense

            FROM stock_entries

            WHERE YEAR(entry_date) = YEAR(CURDATE())

            GROUP BY MONTH(entry_date)

         ) expenses

         ON months.month_no = expenses.month_no

         ORDER BY months.month_no ASC"

    );

    /**
     * -----------------------------------
     * QUICK ACTION COUNTS
     * -----------------------------------
     */

    $vaccinationsDue = fetchOne(

        "SELECT COUNT(*) as total
         FROM health_records
         WHERE health_issue_date >= CURDATE() - INTERVAL 30 DAY"

    )['total'] ?? 0;

    $notifications = fetchOne(

        "SELECT COUNT(*) as total
         FROM pregnancy_records
         WHERE calv_due_date <= CURDATE() + INTERVAL 7 DAY"

    )['total'] ?? 0;

    $healthChecks = fetchOne(

        "SELECT COUNT(*) as total
         FROM health_records"

    )['total'] ?? 0;

    /**
     * -----------------------------------
     * FINAL RESPONSE
     * -----------------------------------
     */
    json([

        /**
         * TOP CARDS
         */
        'summary' => [

            'total_animals' => (int)$totalAnimals,

            'today_milk' => (float)$todayMilk,

            'month_revenue' => (float)$monthRevenue,

            'feed_stock' => (float)$feedStock
        ],

        /**
         * MILK PRODUCTION CHART
         */
        'milk_production' => $milkProduction,

        /**
         * BREED DISTRIBUTION
         */
        'breed_distribution' => $breedDistribution,

        /**
         * FINANCE CHART
         */
        'finance' => $finance,

        /**
         * QUICK ACTIONS
         */
        'quick_actions' => [

            'vaccinations_due' => (int)$vaccinationsDue,

            'notifications' => (int)$notifications,

            'health_checks' => (int)$healthChecks
        ]
    ]);
}

/**
 * ROUTER
 */
if (basename($_SERVER['SCRIPT_FILENAME']) === 'dashboard.php') {

    header('Content-Type: application/json');

    /**
     * OPTIONS
     */
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

        http_response_code(200);

        exit;
    }

    try {

        dashboardSummary();

    } catch (Throwable $e) {

        json([

            'error' => $e->getMessage(),

            'line' => $e->getLine(),

            'file' => $e->getFile()

        ], 500);
    }
}
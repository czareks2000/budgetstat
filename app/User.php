<?php

namespace App;

use App\Account;
use App\Category;
use App\Currency;
use App\Income;
use App\Expense;
use App\Helper\Helper;
use DB;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'currency_id', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function balance($currency_id = null)
    {

        $balances = DB::table(function ($query) {
                $query->selectRaw('*')
                    ->from('accounts')
                    ->where('user_id', '=', auth()->user()->id);
                }, 'accounts')
                ->join('currencies', 'accounts.currency_id', '=', 'currencies.id')
                ->select(DB::raw('sum(balance) as sum, currencies.name, currencies.sign'))
                ->groupBy('currency_id')
                ->get();


        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }

        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        $sum = 0;
        foreach ($balances as $result)
        {
            if($currency->name === "EUR" && $result->name === "EUR")
            {
                $sum += $result->sum;
            }
            else
            {
                $sum += $result->sum; //$response['rates'][$result->name];
            }

        }

        $total['sum'] = number_format($sum, 2, '.', ' ');
        $total['sign'] = $currency->sign;
        return $total;
    }

    public function total_income($currency_id  = null)
    {
        $user_id = auth()->user()->id;
        $month = date('m');
        $year = date('Y');

        $results_incomes = DB::select(DB::raw("SELECT sum(sum) as sum , currencies.sign , currencies.name from (SELECT sum(amount) as sum, accounts.currency_id FROM (SELECT * from incomes where user_id = $user_id and MONTH( `date` ) = $month and YEAR( `date` ) = $year) as incomes INNER JOIN accounts ON incomes.account_id = accounts.id GROUP BY account_id) as result INNER JOIN currencies on result.currency_id = currencies.id GROUP by currency_id"));

        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }

        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        $sum = 0;
        foreach ($results_incomes as $result)
        {
            if($currency->name === "EUR" && $result->name === "EUR")
            {
                $sum += $result->sum;
            }
            else
            {
                $sum += $result->sum; // $response['rates'][$result->name];
            }
        }

        $total['sum'] = number_format($sum, 2, '.', ' ');
        $total['sign'] = $currency->sign;

        return $total;
    }

    public function total_expense($currency_id  = null, $month = null, $year = null)
    {
        $user_id = auth()->user()->id;

        if($month === null || $year === null)
        {
            $month = date('m');
            $year = date('Y');
        }
        else if($month === 0)
        {
            $month = 12;
            $year--;
        }

        $results_expenses = DB::select(DB::raw("SELECT sum(sum) as sum , currencies.sign , currencies.name from (SELECT sum(amount) as sum, accounts.currency_id FROM (SELECT * from expenses where user_id = $user_id and MONTH( `date` ) = $month and YEAR( `date` ) = $year) as expenses INNER JOIN accounts ON expenses.account_id = accounts.id GROUP BY account_id) as result INNER JOIN currencies on result.currency_id = currencies.id GROUP by currency_id"));

        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }

        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        $sum = 0;
        foreach ($results_expenses as $result)
        {
            if($currency->name === "EUR" && $result->name === "EUR")
            {
                $sum += $result->sum;
            }
            else
            {
                $sum += $result->sum; // $response['rates'][$result->name];
            }
        }

        $total['sum'] = number_format($sum, 2, '.', ' ');
        $total['sign'] = $currency->sign;

        return $total;
    }

    public function total_loan($currency_id = null)
    {

        $results_loans = DB::table(function ($query) {
                $query->selectRaw('*')
                    ->from('contractors')
                    ->where('user_id', '=', auth()->user()->id);
                }, 'contractors')
                ->join('currencies', 'contractors.currency_id', '=', 'currencies.id')
                ->select(DB::raw('sum(debt) as sum, currencies.sign, currencies.name'))
                ->groupBy('currency_id')
                ->get();

        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }

        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        $sum = 0;
        foreach ($results_loans as $result)
        {
            if($currency->name === "EUR" && $result->name === "EUR")
            {
                $sum += $result->sum;
            }
            else
            {
                $sum += $result->sum; // $response['rates'][$result->name];
            }
        }

        $total['sum'] = number_format($sum, 2, '.', ' ');
        $total['sign'] = $currency->sign;

        return $total;

    }

    public function expensesByCategories($currency_id = null)
    {
        //expenses grouped by categories and sumed to one currency
        $user_id = auth()->user()->id;

        $year = date('Y');
        $month = date('m');

        $results = DB::select(DB::raw("SELECT categories.name as category, amount, currencies.name from (SELECT * FROM `expenses` WHERE user_id = $user_id and MONTH(date) = $month AND YEAR(date) = $year) as expenses INNER JOIN accounts ON expenses.account_id = accounts.id inner JOIN categories on expenses.category_id = categories.id INNER join currencies on accounts.currency_id = currencies.id"));

        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }

        $total = array();

        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        foreach ($results as $result)
        {
            if($currency->name === "EUR" && $result->name === "EUR")
            {
                if(array_key_exists($result->category,$total))
                {
                    $total[$result->category] += $result->amount;
                }
                else
                {
                    $total[$result->category] = $result->amount;
                }

            }
            else
            {
                if(array_key_exists($result->category,$total))
                {
                    $total[$result->category] +=  $result->amount; // $response['rates'][$result->name];
                }
                else
                {
                    $total[$result->category] = $result->amount; // $response['rates'][$result->name];
                }

            }
        }


        return $total;
    }

    public function incomesByCategories($currency_id = null)
    {
        //incomes in current month grouped by categories and sumed to one currency
        $user_id = auth()->user()->id;

        $year = date('Y');
        $month = date('m');

        $results = DB::select(DB::raw("SELECT categories.name as category, amount, currencies.name from (SELECT * FROM `incomes` WHERE user_id = $user_id and MONTH(date) = $month AND YEAR(date) = $year) as incomes INNER JOIN accounts ON incomes.account_id = accounts.id inner JOIN categories on incomes.category_id = categories.id INNER join currencies on accounts.currency_id = currencies.id"));

        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }

        $total = array();

        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        foreach ($results as $result)
        {
            if($currency->name === "EUR" && $result->name === "EUR")
            {
                if(array_key_exists($result->category,$total))
                {
                    $total[$result->category] += $result->amount;
                }
                else
                {
                    $total[$result->category] = $result->amount;
                }

            }
            else
            {
                if(array_key_exists($result->category,$total))
                {
                    $total[$result->category] +=  $result->amount; // $response['rates'][$result->name];
                }
                else
                {
                    $total[$result->category] = $result->amount; // $response['rates'][$result->name];
                }

            }
        }


        return $total;
    }

    public function avg_income($currency_id = null)
    {
        $user_id = auth()->user()->id;

        //Set currency
        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }
        //Get currency rates
        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        //Get total number of months
        $oldest_income = Income::where('user_id', $user_id)->oldest('date')->first();

        $date = strtotime($oldest_income->date);

        $year1 = date('Y', $date);
        $year2 = date('Y');

        $month1 = date('m', $date);
        $month2 = date('m');

        $number_months = (($year2 - $year1) * 12) + ($month2 - $month1) + 1;

        //convert amounts into one currency and add up monthly
        $results2 = DB::select(DB::raw("SELECT concat(year(date),'/',month(date)) as date, amount, currencies.name from (SELECT * FROM `incomes` WHERE user_id = $user_id) as incomes INNER JOIN accounts ON incomes.account_id = accounts.id INNER join currencies on accounts.currency_id = currencies.id"));

        $sum = 0;

        foreach($results2 as $result)
        {
            if($currency->name === "EUR" && $result->name === "EUR")
            {
                $sum += $result->amount;
            }
            else
            {
                $sum +=  $result->amount; // $response['rates'][$result->name];
            }
        }

        $avg_income = number_format($sum / $number_months, 2, '.', ' ');

        return $avg_income;
    }

    public function avg_expenses($currency_id = null)
    {
        $user_id = auth()->user()->id;

        //Set currency
        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }
        //Get currency rates
        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        //Get total number of months
        $oldest_expense = Expense::where('user_id', $user_id)->oldest('date')->first();

        $date = strtotime($oldest_expense->date);

        $year1 = date('Y', $date);
        $year2 = date('Y');

        $month1 = date('m', $date);
        $month2 = date('m');

        $number_months = (($year2 - $year1) * 12) + ($month2 - $month1) + 1;

        //convert amounts into one currency and add up monthly
        $results2 = DB::select(DB::raw("SELECT concat(year(date),'/',month(date)) as date, amount, currencies.name from (SELECT * FROM `expenses` WHERE user_id = $user_id) as expenses INNER JOIN accounts ON expenses.account_id = accounts.id INNER join currencies on accounts.currency_id = currencies.id"));

        $sum = 0;

        foreach($results2 as $result)
        {
            if($currency->name === "EUR" && $result->name === "EUR")
            {
                $sum += $result->amount;
            }
            else
            {
                $sum +=  $result->amount; // $response['rates'][$result->name];
            }
        }

        $avg_expenses = number_format($sum / $number_months, 2, '.', ' ');

        return $avg_expenses;
    }

    public function expensesByMonths($currency_id = null)
    {
        $user_id = auth()->user()->id;
        //create array with indexes of last 12 months format(YYYY/mm) with value of 0

        $expenses = array();
        for ($i = 12; $i >= 0; $i--) {
            $index = strval(date("Y-m", strtotime( date( 'Y-m-01' )." -$i months")));
            $expenses[$index] = 0.0;
        }

        //Set currency
        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }

        //Get currency rates
        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        $results = DB::select(DB::raw("SELECT DATE_FORMAT(date,'%Y-%m') as date, amount, currencies.name from (SELECT * FROM `expenses` WHERE user_id = $user_id and date > DATE_SUB(DATE_FORMAT(CURRENT_DATE,'%Y-%m-01'),INTERVAL 1 YEAR)) as expenses INNER JOIN accounts ON expenses.account_id = accounts.id INNER join currencies on accounts.currency_id = currencies.id"));

        //sum by months and assign sums to proper indexes in months array
        foreach ($results as $result)
        {

            if($currency->name === "EUR" && $result->name === "EUR")
            {
                $expenses[strval($result->date)] += $result->amount;
            }
            else
            {
                $expenses[strval($result->date)] +=  $result->amount; // $response['rates'][$result->name];
            }

        }

        //delete current month from array
        array_pop($expenses);

        return $expenses;

    }

    public function incomesByMonths($currency_id = null)
    {
        $user_id = auth()->user()->id;
        //create array with indexes of last 12 months format(YYYY/mm) with value of 0

        $incomes = array();
        for ($i = 12; $i >= 0; $i--) {
            $index = strval(date("Y-m", strtotime( date( 'Y-m-01' )." -$i months")));
            $incomes[$index] = 0.0;
        }

        //Set currency
        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }

        //Get currency rates
        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        $results = DB::select(DB::raw("SELECT DATE_FORMAT(date,'%Y-%m') as date, amount, currencies.name from (SELECT * FROM `incomes` WHERE user_id = $user_id and date > DATE_SUB(DATE_FORMAT(CURRENT_DATE,'%Y-%m-01'),INTERVAL 1 YEAR)) as incomes INNER JOIN accounts ON incomes.account_id = accounts.id INNER join currencies on accounts.currency_id = currencies.id"));

        //sum by months and assign sums to proper indexes in months array
        foreach ($results as $result)
        {

            if($currency->name === "EUR" && $result->name === "EUR")
            {
                $incomes[strval($result->date)] += $result->amount;
            }
            else
            {
                $incomes[strval($result->date)] +=  $result->amount; // $response['rates'][$result->name];
            }

        }

        //delete current month from array
        array_pop($incomes);

        return $incomes;

    }

    public function avg_expensesByCategories($currency_id = null)
    {

        $user_id = auth()->user()->id;

        $results = DB::select(DB::raw("SELECT categories.name as category, amount, currencies.name from (SELECT * FROM `expenses` WHERE user_id = $user_id) as expenses INNER JOIN accounts ON expenses.account_id = accounts.id inner JOIN categories on expenses.category_id = categories.id INNER join currencies on accounts.currency_id = currencies.id"));

        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }

        $total = array();

        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        foreach ($results as $result)
        {
            if($currency->name === "EUR" && $result->name === "EUR")
            {
                if(array_key_exists($result->category,$total))
                {
                    $total[$result->category] += $result->amount;
                }
                else
                {
                    $total[$result->category] = $result->amount;
                }

            }
            else
            {
                if(array_key_exists($result->category,$total))
                {
                    $total[$result->category] +=  $result->amount; // $response['rates'][$result->name];
                }
                else
                {
                    $total[$result->category] = $result->amount; // $response['rates'][$result->name];
                }

            }
        }



        foreach($total as $key => $value)
        {

            //$category = Category::where('name','=', $key)->first();
            $category = Category::where('name','=', $key)->where('type','=','expense')->first();

            //Get total number of months
            $oldest_expense = Expense::where('user_id', $user_id)->where('category_id', $category->id)->oldest('date')->first();

            $date = strtotime($oldest_expense->date);

            $year1 = date('Y', $date);
            $year2 = date('Y');

            $month1 = date('m', $date);
            $month2 = date('m');

            $number_months = (($year2 - $year1) * 12) + ($month2 - $month1) + 1;

            $total[$key] /= $number_months;
        }


        return $total;
    }
    public function avg_incomesByCategories($currency_id = null)
    {

        $user_id = auth()->user()->id;

        $results = DB::select(DB::raw("SELECT categories.name as category, amount, currencies.name from (SELECT * FROM `incomes` WHERE user_id = $user_id) as incomes INNER JOIN accounts ON incomes.account_id = accounts.id inner JOIN categories on incomes.category_id = categories.id INNER join currencies on accounts.currency_id = currencies.id"));

        if($currency_id === null)
        {
            $currency = Currency::find(auth()->user()->currency_id);
        }
        else
        {
            $currency = Currency::find($currency_id);
        }

        $total = array();

        //$get_data = Helper::callAPI('GET', 'http://api.exchangeratesapi.io/v1/latest?access_key=2d4325be10d0d50f89552e420e4bdbdc&base='.$currency->name, false);
        //$response = json_decode($get_data, true);

        foreach ($results as $result)
        {
            if($currency->name === "EUR" && $result->name === "EUR")
            {
                if(array_key_exists($result->category,$total))
                {
                    $total[$result->category] += $result->amount;
                }
                else
                {
                    $total[$result->category] = $result->amount;
                }

            }
            else
            {
                if(array_key_exists($result->category,$total))
                {
                    $total[$result->category] +=  $result->amount; // $response['rates'][$result->name];
                }
                else
                {
                    $total[$result->category] = $result->amount; // $response['rates'][$result->name];
                }

            }
        }



        foreach($total as $key => $value)
        {

            $category = Category::where('name','=', $key)->where('type','=','income')->first();

            //Get total number of months
            $oldest_income = Income::where('user_id', $user_id)->where('category_id', $category->id)->oldest('date')->first();

            $date = strtotime($oldest_income->date);

            $year1 = date('Y', $date);
            $year2 = date('Y');

            $month1 = date('m', $date);
            $month2 = date('m');

            $number_months = (($year2 - $year1) * 12) + ($month2 - $month1) + 1;

            $total[$key] /= $number_months;
        }


        return $total;
    }


    public $timestamps = false;
}

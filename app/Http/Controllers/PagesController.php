<?php

namespace App\Http\Controllers;

use App\Account;
use App\Currency;
use App\Contractor;
use App\Category;
use App\Income;
use App\Expense;
use App\Helper\Helper;
use DB;
use Illuminate\Http\Request;

class PagesController extends Controller
{   
    public function manage(){
        $title = "Manage accounts";

        $user_id = auth()->user()->id;
        $accounts = Account::where('user_id', $user_id)->get();
        $currencies = Currency::all();
    
        return view('pages.manage')->with('title', $title)
                                ->with('accounts', $accounts)
                                ->with('currencies', $currencies);
    }

    public function operations(){
        $title = "Operations";

        $user_id = auth()->user()->id;
        $accounts = Account::where('user_id', $user_id)->get();
        $categories_in = Category::where('type','income')->where(function ($query) { $query->where('user_id', auth()->user()->id)->orWhere('user_id', NULL);})->get();
        $categories_ex = Category::where('type','expense')->where(function ($query) { $query->where('user_id', auth()->user()->id)->orWhere('user_id', NULL);})->get();
        $categories = Category::where('user_id', auth()->user()->id)->get();
        $incomes = Income::where('user_id', $user_id)->orderBy('date','desc')->get()->limit(50);
        $expenses = Expense::where('user_id', $user_id)->orderBy('date','desc')->get()->limit(50);
        $currencies = Currency::all();

        return view('pages.operations')->with('title', $title)
                                    ->with('incomes', $incomes)
                                    ->with('expenses', $expenses)
                                    ->with('accounts', $accounts)
                                    ->with('currencies', $currencies)   
                                    ->with('categories_in', $categories_in)
                                    ->with('categories_ex', $categories_ex)
                                    ->with('categories', $categories);
    }

    public function stats(){
        $title = "Stats";
        
        $user_id = auth()->user()->id;
        $incomes = Income::where('user_id', $user_id)->orderBy('date','desc')->get();
        $expenses = Expense::where('user_id', $user_id)->orderBy('date','desc')->get();

        return view('pages.stats')->with('title', $title)
                                ->with('incomes', $incomes)
                                ->with('expenses', $expenses);
    }

    public function loans(){
        $title = "Loans";

        $user_id = auth()->user()->id;
        $contractors = Contractor::where('user_id', $user_id)->get();
        $accounts = Account::where('user_id', $user_id)->get();
        $currencies = Currency::all();

        $sum = "";

        $totals = DB::table(function ($query) {
                $query->selectRaw('*')
                    ->from('contractors')
                    ->where('user_id', '=', auth()->user()->id); 
                }, 'contractors')
                ->join('currencies', 'contractors.currency_id', '=', 'currencies.id') 
                ->select(DB::raw('sum(debt) as sum, currencies.sign'))
                ->groupBy('currency_id')
                ->get();

        foreach ($totals as $total)
        {
            $sum.=' <span style="color:#636363">'.$total->sum.'</span>'.$total->sign;
        }  

        return view('pages.loans')->with('title',$title)->with('contractors',$contractors)->with('accounts',$accounts)->with('currencies',$currencies)->with('sum',$sum);
    }

    public function settings(){
        $title = "Settings";
        $currencies = Currency::all();

        return view('pages.settings')->with('title',$title)->with('currencies',$currencies);
    }

    public function profile(){
        $title = "Profile";
        return view('pages.profile', compact('title'));
    }
}

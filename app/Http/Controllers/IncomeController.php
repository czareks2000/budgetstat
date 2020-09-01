<?php

namespace App\Http\Controllers;

use App\Income;
use App\Account;
use App\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'account' => 'integer|required',
            'category' => 'integer|required',
            'amount' => 'numeric|required',
            'date' => 'required|date_format:d/m/Y'
        ]);

        $account_id = $request->input('account');
        $amount = str_replace(',', '.', $request->input('amount'));
        //Create Income
        $income = new Income;
        $income->user_id = auth()->user()->id;
        $income->account_id = $account_id;
        $income->category_id = $request->input('category');
        $income->amount = $amount;
        $income->date = Carbon::createFromFormat('d/m/Y', $request->input('date'));
        $income->save();
        
        //Update the balance
        $account = Account::find($account_id);

        $new_balance = $account->balance + abs($amount);

        $account->balance = $new_balance;
        $account->save();

        return redirect('/operations')->with('success','<strong>'.$account->name.'</strong> balance is now: <strong>'.$account->balance.$account->currency()->first()->sign.'</strong>');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function show(Income $income)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function edit(Income $income)
    {
        //check for correct user
        if(auth()->user()->id !== $income->user_id){
            return redirect('/operations')->with('error','Unauthorized Page');
        }
        else
        {
            $title = "Edit income";

            $accounts = Account::where('user_id', auth()->user()->id)->get();
            $categories_in = Category::where('type','income')->where(function ($query) { $query->where('user_id', auth()->user()->id)->orWhere('user_id', NULL);})->get();

            return view('pages.editincome')->with('title', $title)
                                    ->with('income', $income)
                                    ->with('accounts', $accounts)
                                    ->with('categories_in', $categories_in);
        } 
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Income $income)
    {   
        $this->validate($request, [
            'amount' => 'numeric|required',
            'date' => 'required|date_format:d/m/Y'
        ]);
        
        $account_id = $request->input('account');
        $amount = str_replace(',', '.', $request->input('amount'));

        $amount_old = $income->amount;
        $account_id_old = $income->account_id;
        $account_old = Account::find($account_id_old);

        //Rollback to old balance
        $old_balance = $account_old->balance - abs($amount_old);
        $account_old->balance = $old_balance;
        $account_old->save();

        $account = Account::find($account_id);

        //Update Income
        $income->account_id = $account_id;
        $income->category_id = $request->input('category');
        $income->amount = $amount;
        $income->date = Carbon::createFromFormat('d/m/Y', $request->input('date'));
        $income->save();
        
        //Update the balance
        $new_balance = $account->balance + abs($amount);
        $account->balance = $new_balance;
        $account->save();

        return redirect('/operations')->with('success','<strong>'.$account->name.'</strong> balance is now: <strong>'.$account->balance.' '.$account->currency()->first()->sign.'</strong>');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Income  $income
     * @return \Illuminate\Http\Response
     */
    public function destroy(Income $income)
    {   
        //Update the balance
        $account = Account::find($income->account_id);
        $new_balance = $account->balance - abs($income->amount);
        $account->balance = $new_balance;
        $account->save();

        //delete the income
        $income->delete();
        
        return redirect('/operations')->with('success','<strong>'.$account->name.'</strong> balance is now: <strong>'.$account->balance.$account->currency()->first()->sign.'</strong>');
    }
}

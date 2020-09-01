<?php

namespace App\Http\Controllers;

use App\Account;
use App\Income;
use App\Expense;
use Illuminate\Http\Request;

class AccountController extends Controller
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
            'name' => 'required',
            'currency' => 'integer|required',
            'balance' => 'numeric|required'
        ]);

        //Create Account
        $account = new Account;
        $account->name = $request->input('name');
        $account->user_id = auth()->user()->id;
        $account->currency_id = $request->input('currency');
        $account->balance = str_replace(',', '.', $request->input('balance'));
        $account->save();

        return redirect('/manage')->with('success','Account Created');
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Account  $account
     * @return \Illuminate\Http\Response
     */
    public function show(Account $account)
    {        
        return response()->json(array('success' => true, 'account' => $account));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Account  $account
     * @return \Illuminate\Http\Response
     */
    public function edit(Account $account)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Account  $account
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Account $account)
    {
        $account->name = $request->input('name_');
        $account->currency_id = $request->input('currency_');
        $account->save();

        return redirect('/manage')->with('success','Account Updated');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Account  $account
     * @return \Illuminate\Http\Response
     */
    public function destroy(Account $account)
    {   
        //delete all expenses and incomes from this account
        $incomes = Income::where('account_id', $account->id)->get();
        foreach ($incomes as $income) {
            $income->delete();
        }
        $expenses = Expense::where('account_id', $account->id)->get();
        foreach ($expenses as $expense) {
            $expense->delete();
        }

        $account->delete();
        return redirect('/manage')->with('success','Account Deleted');
    }
}

<?php

namespace App\Http\Controllers;

use App\Expense;
use App\Category;
use App\Account;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ExpenseController extends Controller
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
            'account_' => 'integer|required',
            'category_' => 'integer|required',
            'amount_' => 'numeric|required',
            'date_' => 'required|date_format:d/m/Y'
        ]);
        
        $account_id = $request->input('account_');
        $amount = str_replace(',', '.', $request->input('amount_'));

        $account = Account::find($account_id);

        if($account->balance >= $amount)
        {
            //Create Expense
            $expense = new Expense;
            $expense->user_id = auth()->user()->id;
            $expense->account_id = $account_id;
            $expense->category_id = $request->input('category_');
            $expense->amount = $amount;
            $expense->date = Carbon::createFromFormat('d/m/Y', $request->input('date_'));
            $expense->save();

            //Update the balance
            $new_balance = $account->balance - abs($amount);
            $account->balance = $new_balance;
            $account->save();

            return redirect('/operations')->with('success','<strong>'.$account->name.'</strong> balance is now: <strong>'.$account->balance.' '.$account->currency()->first()->sign.'</strong>');
        }
        else
        {
            return redirect('/operations')->with('error','You don’t have enough funds in this account. <strong>'.$account->name.'</strong> balance is: <strong>'.$account->balance.' '.$account->currency()->first()->sign.'</strong>')->withInput();
        }
        
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Expense  $expense
     * @return \Illuminate\Http\Response
     */
    public function show(Expense $expense)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Expense  $expense
     * @return \Illuminate\Http\Response
     */
    public function edit(Expense $expense)
    {   
        //check for correct user
        if(auth()->user()->id !== $expense->user_id){
            return redirect('/operations')->with('error','Unauthorized Page');
        }
        else
        {
            $title = "Edit expense";

            $accounts = Account::where('user_id', auth()->user()->id)->get();
            $categories_ex = Category::where('type','expense')->where(function ($query) { $query->where('user_id', auth()->user()->id)->orWhere('user_id', NULL);})->get();

            return view('pages.editexpense')->with('title', $title)
                                    ->with('expense', $expense)
                                    ->with('accounts', $accounts)
                                    ->with('categories_ex', $categories_ex);
        } 
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Expense  $expense
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Expense $expense)
    {   
        $this->validate($request, [
            'amount' => 'numeric|required',
            'date' => 'required|date_format:d/m/Y'
        ]);
        $account_id = $request->input('account');
        $amount = str_replace(',', '.', $request->input('amount'));

        $amount_old = $expense->amount;
        $account_id_old = $expense->account_id;
        $account_old = Account::find($account_id_old);

        //Rollback to old balance
        $old_balance = $account_old->balance + abs($amount_old);
        $account_old->balance = $old_balance;
        $account_old->save();

        $account = Account::find($account_id);

        if($account->balance >= $amount)
        {   

            //Update Expense
            $expense->account_id = $account_id;
            $expense->category_id = $request->input('category');
            $expense->amount = $amount;
            $expense->date = Carbon::createFromFormat('d/m/Y', $request->input('date'));
            $expense->save();
            
            //Update the balance
            $new_balance = $account->balance - abs($amount);
            $account->balance = $new_balance;
            $account->save();

            return redirect('/operations')->with('success','<strong>'.$account->name.'</strong> balance is now: <strong>'.$account->balance.' '.$account->currency()->first()->sign.'</strong>');
        }
        else
        {
            //Undo the rollback
            $old_balance = $account_old->balance - abs($amount_old);
            $account_old->balance = $old_balance;
            $account_old->save();
            //
            return redirect()->route('expenses.edit', $expense->id)->with('error','You don’t have enough funds in this account. <strong>'.$account->name.'</strong> balance is: <strong>'.$account->balance.' '.$account->currency()->first()->sign.'</strong>')->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Expense  $expense
     * @return \Illuminate\Http\Response
     */
    public function destroy(Expense $expense)
    {   
        //Update the balance
        $account = Account::find($expense->account_id);
        $new_balance = $account->balance + abs($expense->amount);
        $account->balance = $new_balance;
        $account->save();

        //delete the expense
        $expense->delete();

        return redirect('/operations')->with('success','<strong>'.$account->name.'</strong> balance is now: <strong>'.$account->balance.' '.$account->currency()->first()->sign.'</strong>');
    }
}

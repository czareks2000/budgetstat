<?php

namespace App\Http\Controllers;

use App\Loan;
use App\Contractor;
use App\Currency;
use App\Account;
use Illuminate\Http\Request;

class LoanController extends Controller
{
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
            'borrower' => 'integer|required',
            'amount' => 'numeric|required'
        ]);
        
        $contractor_id = $request->input('borrower');
        $account_id = $request->input('account');
        $amount = str_replace(',', '.', $request->input('amount'));

        $contractor = Contractor::find($contractor_id);
        $currency = Currency::find($contractor->currency_id);
        $account = Account::find($account_id);

        if($account->currency_id == $contractor->currency_id)
        {   
            if($account->balance >= $amount)
            {
                //Create Loan
                $loan = new Loan;
                $loan->user_id = auth()->user()->id;
                $loan->contractor_id = $contractor_id;
                $loan->amount = $amount;   
                $loan->currency_id = $currency->id;
                $loan->save();

                //substract money
                $new_balance = $account->balance - abs($amount);
                $account->balance = $new_balance;
                $account->save();

                //add to borrower's debt
                $new_debt = $contractor->debt + abs($amount);
                $contractor->debt = $new_debt;
                $contractor->save();

                return redirect('/loans')->with('success','<strong>'.$account->name.'</strong> balance is now: <strong>'.$account->balance.$currency->sign.'</strong>');
            }
            else
            {
                return redirect('/loans')->with('error','You don’t have enough funds in this account. '.$account->name.'</strong> balance is: <strong>'.$account->balance.' '.$account->currency()->first()->sign.'</strong>')->withInput();
            }
            
        }
        else
        {
            return redirect('/loans')->with('error','You have to choose account with the same currency as borrower')->withInput();
        }
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function payoff(Request $request)
    {
        $this->validate($request, [
            'account_' => 'integer|required',
            'borrower_' => 'integer|required',
            'amount_' => 'numeric|required'
        ]);
        
        $contractor_id = $request->input('borrower_');
        $account_id = $request->input('account_');
        $amount = str_replace(',', '.', $request->input('amount_'));
        
        $contractor = Contractor::find($contractor_id);
        $account = Account::find($account_id);

        if($account->currency_id == $contractor->currency_id)
        {   
            //add money
            $new_balance = $account->balance + abs($amount);
            $account->balance = $new_balance;
            $account->save();

            //substract from borrower's debt
            $new_debt = $contractor->debt - abs($amount);
            $contractor->debt = $new_debt;
            $contractor->save();
            
            return redirect('/loans')->with('success','<strong>'.$account->name.'</strong> balance is now: <strong>'.$account->balance.$account->currency()->first()->sign.'</strong>');
        }
        else
        {
            return redirect('/loans')->with('error','You have to choose borrower with the same currency as account')->withInput();
        }
        
    }
    
}

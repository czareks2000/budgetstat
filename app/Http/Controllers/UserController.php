<?php

namespace App\Http\Controllers;

use App\User;
use Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class UserController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        
        $name = $request->input('name');
        $email = $request->input('email');
        $new_password = $request->input('new_password');
        $password_confirmation = $request->input('password_confirmation');
        $currency_id = $request->input('currency');
        $current_password = $request->input('current_password');

        $hashedPassword = $user->password;
        
        if(Hash::check($current_password , $hashedPassword))
        {   
            $this->validate($request, [
                'name' => 'required',
                'email' => 'required',
                'new_password' => 'same:password_confirmation'
            ]);

            //update password
            if($new_password != "")
            {
                $user->password = Hash::make($new_password);
            }

            //update email
            if($email != $user->email)
            {   
                $this->validate($request, [
                    'email' => 'required|unique:users'
                ]);

                $user->email = $email;
            }

            //update name
            $user->name = $name; 
            //update default currency
            $user->currency_id = $currency_id;
            
            $user->save();
            return redirect('/settings')->with('success','Profile Updated');
        }
        else
        {
            return redirect('/settings')->with('error','Invalid password');
        }

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }

    public function balance($id = null)
    {   
        return response()->json(array('success' => true, 'balance' => Auth::user()->balance($id)));
    }

    public function total_income($id = null)
    {
        return response()->json(array('success' => true, 'total_income' => Auth::user()->total_income($id)));
    }

    public function total_expense($id = null, $month = null, $year = null)
    {
        return response()->json(array('success' => true, 'total_expense' => Auth::user()->total_expense($id, $month, $year)));
    }

    public function total_loan($id = null)
    {
        return response()->json(array('success' => true, 'total_loan' => Auth::user()->total_loan($id)));
    }

    public function expensesByCategories()
    {
        return response()->json(array('success' => true, 'expensesByCategories' => Auth::user()->expensesByCategories(null)));
    }

    public function incomesByCategories()
    {
        return response()->json(array('success' => true, 'incomesByCategories' => Auth::user()->incomesByCategories(null)));
    }

    public function expensesByMonths()
    {
        return response()->json(array('success' => true, 'expensesByMonths' => Auth::user()->expensesByMonths(null)));
    }

    public function incomesByMonths()
    {
        return response()->json(array('success' => true, 'incomesByMonths' => Auth::user()->incomesByMonths(null)));
    }

    public function avg_expensesByCategories()
    {
        return response()->json(array('success' => true, 'avg_expensesByCategories' => Auth::user()->avg_expensesByCategories(null)));
    }

    public function avg_incomesByCategories()
    {
        return response()->json(array('success' => true, 'avg_incomesByCategories' => Auth::user()->avg_incomesByCategories(null)));
    }

}

<?php

namespace App\Http\Controllers;

use App\Contractor;
use Illuminate\Http\Request;

class ContractorController extends Controller
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
            'name' => 'required',
            'currency' => 'required'
        ]);
        

        if(count(Contractor::where('name',$request->input('name'))->where('currency_id', $request->input('currency'))->get()) <= 0)
        {
            //Create Contractor
            $contractor = new Contractor;
            $contractor->user_id = auth()->user()->id;
            $contractor->name = $request->input('name');
            $contractor->currency_id = $request->input('currency');
            $contractor->debt = 0;
            $contractor->save();

            return redirect('/loans')->with('success','Borrower Created');
        }
        else
        {
            return redirect('/loans')->with('error','Borrower alredy exist!');
        }
        
    }
}

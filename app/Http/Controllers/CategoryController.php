<?php

namespace App\Http\Controllers;

use App\Category;
use App\Income;
use App\Expense;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
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
            'type' =>  [
                'required',
                Rule::in(['income', 'expense']),
            ],
            'name' => 'required'
        ]);

        //Create Category
        $category = new Category;
        $category->type = $request->input('type');
        $category->name = $request->input('name');
        $category->user_id = auth()->user()->id;
        $category->save();

        return redirect('/operations')->with('success','Created Category <strong>'.$category->name.'</strong>');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {   

         try 
         {
            $category->delete();

            return redirect('/operations')->with('success','Category <strong>'.$category->name.'</strong> Deleted');

         } 
         catch (\Exception $e) 
         {

            return redirect('/operations')->with('error',"You can't delete this category, it is being used somewhere!");
         }
            
    }
}

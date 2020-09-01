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
     * Display the specified resource.
     *
     * @param  \App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Category  $category
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Category $category)
    {
        //
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

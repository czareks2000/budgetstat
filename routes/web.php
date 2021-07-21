<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/manage', 'PagesController@manage')->middleware('auth');
Route::get('/operations', 'PagesController@operations')->middleware('auth');
Route::get('/stats', 'PagesController@stats')->middleware('auth');
Route::get('/loans', 'PagesController@loans')->middleware('auth');
Route::get('/settings', 'PagesController@settings')->middleware('auth');
Route::get('/profile', 'PagesController@profile')->middleware('auth');

Route::resource('accounts','AccountController')->middleware('auth');
Route::resource('categories','CategoryController')->middleware('auth');
Route::resource('incomes','IncomeController')->middleware('auth');
Route::resource('expenses','ExpenseController')->middleware('auth');
Route::resource('contractors','ContractorController')->middleware('auth');
Route::resource('loan','LoanController')->middleware('auth');

Route::resource('user', 'UserController');
Route::get('/balance/{id}', 'UserController@balance')->middleware('auth');
Route::get('/total_income/{id}', 'UserController@total_income')->middleware('auth');
Route::get('/total_expense/{id}', 'UserController@total_expense')->middleware('auth');
Route::get('/total_loan/{id}', 'UserController@total_loan')->middleware('auth');
Route::get('/expensesByCategories', 'UserController@expensesByCategories')->middleware('auth');
Route::get('/incomesByCategories', 'UserController@incomesByCategories')->middleware('auth');
Route::get('/expensesByMonths', 'UserController@expensesByMonths')->middleware('auth');
Route::get('/incomesByMonths', 'UserController@incomesByMonths')->middleware('auth');
Route::get('/avg_expensesByCategories', 'UserController@avg_expensesByCategories')->middleware('auth');
Route::get('/avg_incomesByCategories', 'UserController@avg_incomesByCategories')->middleware('auth');

Route::post('payoff','LoanController@payoff');

Auth::routes();


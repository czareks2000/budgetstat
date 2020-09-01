<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    public function user(){
        return $this->belongsTo('App\User');
    }

    public function incomes(){
        return $this->hasMany('App\Income');
    }

    public function expenses(){
        return $this->hasMany('App\Expense');
    }

    public function loans(){
        return $this->hasMany('App\Loan');
    }

    public function currency()
    {
        return $this->belongsTo('App\Currency');
    }

    public $timestamps = false;
}

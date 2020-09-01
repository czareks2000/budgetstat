<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contractor extends Model
{
    public function user(){
        return $this->belongsTo('App\User');
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

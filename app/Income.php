<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    public function account()
    {
        return $this->belongsTo('App\Account');
    }

    public function category()
    {
        return $this->belongsTo('App\Category');
    }

    public $timestamps = false;
    
}

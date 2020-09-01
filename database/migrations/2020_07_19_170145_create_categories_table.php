<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('type'); //income/expense
            $table->string('name');
            $table->bigInteger('user_id')->unsigned()->nullable();
        });

        DB::table('categories')->insert([
            ['type' => 'income','name' => 'Work'],
            ['type' => 'income','name' => 'Gift'],
            ['type' => 'income','name' => 'Other'],
            ['type' => 'expense','name' => 'Food'],
            ['type' => 'expense','name' => 'Recreation'],
            ['type' => 'expense','name' => 'Clothing'],
            ['type' => 'expense','name' => 'Utilities'],
            ['type' => 'expense','name' => 'Rent'],
            ['type' => 'expense','name' => 'House'],
            ['type' => 'expense','name' => 'Car'],
            ['type' => 'expense','name' => 'Family'],
            ['type' => 'expense','name' => 'Other']
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categories');
    }
}


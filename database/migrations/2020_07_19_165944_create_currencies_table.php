<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCurrenciesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('currencies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name'); // USD,PLN,GBP,EUR
            $table->string('sign');
        });

        DB::table('currencies')->insert([
            ['name' => 'EUR','sign' => '€'],
            ['name' => 'PLN','sign' => 'zł'],
            ['name' => 'USD','sign' => '$'],
            ['name' => 'GBP','sign' => '£']
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('currencies');
    }
}

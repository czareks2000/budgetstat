<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLoansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger('contractor_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('contractor_id')->references('id')->on('contractors');
            $table->decimal('amount', 12, 2);
            $table->bigInteger('currency_id')->unsigned();
            $table->foreign('currency_id')->references('id')->on('currencies'); //currency of the balance (EUR,PLN,USD,GBP)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('loans');
    }
}

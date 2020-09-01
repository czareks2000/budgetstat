<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExpensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger('account_id')->unsigned();
            $table->bigInteger('category_id')->unsigned();
            $table->foreign('account_id')->references('id')->on('accounts');
            $table->foreign('category_id')->references('id')->on('categories'); //income / expense
            $table->foreign('user_id')->references('id')->on('users');
            $table->decimal('amount', 12, 2);
            $table->date('date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('expenses');
    }
}

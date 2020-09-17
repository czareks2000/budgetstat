@extends('layouts.app')

@section('content')
<div class="container-fluid">
    @if (count($accounts) > 0)
    <script>
      $(document).ready(function(){

        $('#income_currency').change(function(e){
          e.preventDefault();

          var id = Number($('#income_currency').val());

          $.ajax({
              url: 'total_income/'+id,
              type: 'GET',
              dataType: 'json',
              success: function(response){
                
                var sum = response['total_income'].sum;
                var sign = response['total_income'].sign;

                $('#total_income').html('Income this month: <b>'+sum +'</b><span style="color: #0099FF">'+sign+'</span>');
              }
            });

            $('#income_currency').blur();
        });

        $('#expense_currency').change(function(e){
          e.preventDefault();

          var id = Number($('#expense_currency').val());

          $.ajax({
              url: 'total_expense/'+id,
              type: 'GET',
              dataType: 'json',
              success: function(response){
                
                var sum = response['total_expense'].sum;
                var sign = response['total_expense'].sign;

                $('#total_expense').html('Expense this month: <b>'+sum +'</b><span style="color: #0099FF">'+sign+'</span>');
              }
            });

            $('#expense_currency').blur();
        });

        $('#ex_amount').blur(function(){
          $('#ex_amount').val($('#ex_amount').val().replace(",", "."));
        });

        $('#in_amount').blur(function(){
          $('#in_amount').val($('#in_amount').val().replace(",", "."));
        });

        $('.input-group.date input').datepicker({
            format: "dd/mm/yyyy",
            todayBtn: "linked",
            orientation: "bottom left",
            autoclose: true,
            container:'#datepicker1'
        });

        $('#table_incomes').DataTable({
            order: [],
            paging: true,
            searching: true,
            info: false
        });

        $('#table_expenses').DataTable({
            order: [],
            paging: true,
            searching: true,
            info: false
        });

        
        $("#table_expenses_length").appendTo("#table_expenses_wrapper");
        $('#table_expenses_length').css('padding-top',"22px");
        $('#table_expenses_length').css('padding-left',"20px");
        $('#table_expenses_length').addClass('d-none d-md-block');
        $('#table_expenses_paginate').css('padding',"15px 5px");
        $('#table_expenses_filter').css('margin-top','10px');
        $('#table_expenses_filter').css('margin-right','10px');

        $("#table_incomes_length").appendTo("#table_incomes_wrapper");
        $('#table_incomes_length').css('padding-top',"22px");
        $('#table_incomes_length').css('padding-left',"20px");
        $('#table_incomes_length').addClass('d-none d-md-block');
        $('#table_incomes_paginate').css('padding',"15px 5px");
        $('#table_incomes_filter').css('margin-top','10px');
        $('#table_incomes_filter').css('margin-right','10px');

        $("#category_to_delete button").prop('disabled', true);

        $('#category_to_delete select').change(function(e){
          e.preventDefault();
          $('#category_to_delete').attr('action', 'categories/'+$('#category_to_delete select').val());
          $("#category_to_delete button").prop('disabled', false);
        });
      });
    </script>
    <style>

    </style>
    
    <div class="row">
      <div class="col-xl-4">
        <section>
        <h3>NEW EXPENSE</h3>
          <form action="expenses" method="POST" autocomplete="off">
            @csrf
            <div class="form-group">
              <select class="custom-select mr-sm-2 @error('account_') is-invalid @enderror"  name="account_">
                <option disabled selected hidden>Choose account...</option>
                @if (count($accounts) > 0)
                    @foreach ($accounts as $account)
                    <option value="{{$account->id}}" @if(old('account_') == $account->id) selected @endif>{{$account->name}} ({{$account->balance}} {{$account->currency()->first()->sign}})</option> 
                    @endforeach
                @endif
              </select>
              @error('account_')
                  <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                  </span>
              @enderror
            </div>
            <div class="form-group">
              <select class="custom-select mr-sm-2 @error('category_') is-invalid @enderror"  name="category_">
                <option disabled selected hidden>Choose category...</option>
                @if (count($categories_ex) > 0)
                    @foreach ($categories_ex as $category)
                      <option value="{{$category->id}}" @if(old('category_') == $category->id) selected @endif>{{$category->name}}</option> 
                    @endforeach
                @endif
              </select>
              @error('category_')
                  <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                  </span>
              @enderror
            </div>
            <div class="form-group">
              <input id="ex_amount" type="text" class="form-control @error('amount_') is-invalid @enderror" placeholder="Amount" value="{{ old('amount_') }}" name="amount_">
              @error('amount_')
                  <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                  </span>
              @enderror
            </div>
            <div id="datepicker1" class="input-group date">
              <input type="text" class="form-control @error('date_') is-invalid @enderror" placeholder="Date" value="{{ old('date_') }}" name="date_">
              @error('date_')
                  <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                  </span>
              @enderror
            </div>
            <button type="submit" class="btn btn-primary mt-3">ADD</button>
          </form>
        </section>
      </div>
      <div class="col-xl-4">
        <section>
          <h3>NEW INCOME</h3>
          <form action="incomes" method="POST" autocomplete="off">
            @csrf
            <div class="form-group">
              <select class="custom-select mr-sm-2 @error('account') is-invalid @enderror" name="account">
                <option disabled selected hidden>Choose account...</option>
                @if (count($accounts) > 0)
                    @foreach ($accounts as $account)
                    <option value="{{$account->id}}" @if(old('account') == $account->id) selected @endif>{{$account->name}}</option> 
                    @endforeach
                @endif
              </select>
              @error('account')
                  <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                  </span>
              @enderror
            </div>
            <div class="form-group">
              <select class="custom-select mr-sm-2 @error('category') is-invalid @enderror" name="category">
                <option disabled selected hidden>Choose category...</option>
                @if (count($categories_in) > 0)
                    @foreach ($categories_in as $category)
                    <option value="{{$category->id}}" @if(old('category') == $category->id) selected @endif>{{$category->name}}</option> 
                    @endforeach
                @endif
              </select>
              @error('category')
                  <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                  </span>
              @enderror
            </div>
            <div class="form-group">
              <input id="in_amount" type="text" class="form-control @error('amount') is-invalid @enderror" placeholder="Amount" value="{{ old('amount') }}" name="amount">
              @error('amount')
                  <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                  </span>
              @enderror
            </div>
            <div class="input-group date">
              <input type="text" class="form-control @error('date') is-invalid @enderror" placeholder="Date" value="{{ old('date') }}" name="date"><span class="input-group-addon"></span>
              @error('date')
                  <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                  </span>
              @enderror
            </div>
            <button type="submit" class="btn btn-primary mt-3">ADD</button>
          </form>
        </section>
      </div>
      <div class="col-xl-4">
        <section>
          <h3>NEW CATEGORY</h3>
          <form action="categories" method="POST" autocomplete="off">
            @csrf
            <div class="form-group">
              <select class="custom-select mr-sm-2 @error('type') is-invalid @enderror" name="type">
                <option disabled selected hidden>Choose type...</option>
                <option value="income" @if(old('type') == "income") selected @endif>Income</option>
                <option value="expense" @if(old('type') == "expense") selected @endif>Expense</option>
              </select>
              @error('type')
                  <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                  </span>
              @enderror
            </div>
            <div class="form-group mt-1">
              <input type="text" class="form-control @error('name') is-invalid @enderror" placeholder="Category name" value="{{ old('name') }}" name="name">
              @error('name')
                  <span class="invalid-feedback" role="alert">
                      <strong>{{ $message }}</strong>
                  </span>
              @enderror
            </div>
            <button type="submit" class="btn btn-primary" data-toggle="confirmation" data-popout="true">ADD</button>
          </form>
        </section>
        <section>
            <form id="category_to_delete" class="m-0 p-0" action="/categories" method="POST">
              @csrf
              @method('DELETE')
              <div class="input-group mb-3">
                <select class="custom-select">
                  <option disabled selected hidden>Choose category...</option>
                  @if (count($categories) > 0)
                      @foreach ($categories as $category)
                      <option value="{{$category->id}}">{{$category->name}}</option> 
                      @endforeach
                  @else
                    <option disabled>You haven't added any category</option> 
                  @endif
                </select>
                <div class="input-group-append">
                  <button class="btn btn-danger" data-toggle="confirmation" data-popout="true"><i class="fas fa-trash-alt"></i></button>
                </div>
              </div>
            </form>
        </section>
      </div>
    </div>
    <div class="row">
      <div class="col-xl-6">
        <div class="zoom pb-3 d-none d-sm-flex">
          <h2 id="total_expense" class="p-2 border bg-white rounded-left">Expense this month: <b>{{Auth::user()->total_expense()['sum']}}</b><span style="color: #0099FF">{{Auth::user()->total_expense()['sign']}}</span></h2>
          <select id="expense_currency" class="btn-primary p-2 rounded-right" style="height: 52px;">
            @if (count($currencies) > 0)
                @foreach ($currencies as $currency)
                <option value="{{$currency->id}}" @if(auth()->user()->currency_id == $currency->id) selected @endif>{{$currency->name}}</option>
                @endforeach
            @endif
          </select>
        </div>
        <section>
          <h3>EXPENCES</h3>
          <div class="table-responsive">
           <table id="table_expenses" class="border table table-bordered table-striped">
             <thead>
               <tr>
                 <th scope="col">Account</th>
                 <th scope="col">Category</th>
                 <th scope="col">Amount</th>
                 <th scope="col">Date</th>
                 <th scope="col" style="width: 1px; white-space: nowrap">Action</th>
               </tr>
             </thead>
             <tbody>
               @if (count($expenses) > 0)
                   @foreach ($expenses as $expense)
                     <tr>
                       <td>
                         {{$expense->account()->first()->name}}
                       </td>
                       <td>
                         {{$expense->category()->first()->name}}
                       </td>
                       <td style="color: #ed0000;">
                         <?php
                           $currency = App\Currency::find($expense->account()->first()->currency_id);
                         ?>
                         {{$expense->amount}}{{$currency->sign}}
                       </td>
                       <td>
                         {{Carbon\Carbon::parse($expense->date)->format('Y-m-d')}}
                       </td>
                       <td class="d-flex">
                         <form class="m-0 p-0" action="expenses/{{$expense->id}}/edit" method="GET">
                          <button type="submit" class="btn btn-success"><i class="fas fa-pencil-alt"></i></button>
                        </form>
                        <form class="m-0 p-0 ml-3" action="expenses/{{$expense->id}}" method="POST">
                          @csrf
                          @method('DELETE')
                          <button type="submit" class="btn btn-danger" data-toggle="confirmation" data-popout="true"><i class="fas fa-trash-alt"></i></button>
                        </form>
                       </td>
                     </tr>
                   @endforeach    
               @endif
             </tbody>   
           </table>
         </div>   
         </section>
      </div>
      <div class="col-xl-6">
        <div class="zoom pb-3 d-none d-sm-flex">
          <h2 id="total_income" class="p-2 border bg-white rounded-left">Income this month: <b>{{Auth::user()->total_income()['sum']}}</b><span style="color: #0099FF">{{Auth::user()->total_income()['sign']}}</span></h2>
          <select id="income_currency" class="btn-primary p-2 rounded-right" style="height: 52px;">
            @if (count($currencies) > 0)
                @foreach ($currencies as $currency)
                <option value="{{$currency->id}}" @if(auth()->user()->currency_id == $currency->id) selected @endif>{{$currency->name}}</option>
                @endforeach
            @endif
          </select>
        </div>
        <section>
          <h3>INCOMES</h3>
          <div class="table-responsive">
            <table id="table_incomes" class="border table table-bordered table-striped">
              <thead>
                <tr>
                  <th scope="col">Account</th>
                  <th scope="col">Category</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Date</th>
                  <th scope="col" style="width: 1px; white-space: nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                @if (count($incomes) > 0)
                    @foreach ($incomes as $income)
                      <tr>
                        <td>  
                          {{$income->account()->first()->name}}
                        </td>
                        <td>
                          {{$income->category()->first()->name}}
                        </td>
                        <td style="color: #0a9c00;">
                          <?php
                            $currency = App\Currency::find($income->account()->first()->currency_id);
                          ?>
                          {{$income->amount}}{{$currency->sign}}
                        </td>
                        <td>
                          {{Carbon\Carbon::parse($income->date)->format('Y-m-d')}}
                        </td>
                        <td class="d-flex">
                          <form class="m-0 p-0" action="incomes/{{$income->id}}/edit" method="GET">
                           <button type="submit" class="btn btn-success"><i class="fas fa-pencil-alt"></i></button>
                         </form>
                         <form class="m-0 p-0 ml-3" action="incomes/{{$income->id}}" method="POST">
                           @csrf
                           @method('DELETE')
                           <button type="submit" class="btn btn-danger" data-toggle="confirmation" data-popout="true"><i class="fas fa-trash-alt"></i></button>
                         </form>
                        </td>
                      </tr>
                    @endforeach
                @endif
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
    @else
    <div class="alert alert-warning mt-5" role="alert">
      You need to have at least one account! 
      <a class="alert-link" href="/manage">Add account</a>
    </div>
    @endif
 </div>
@endsection

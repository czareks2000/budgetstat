@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="col-xl-6 offset-xl-3 pt-5">
        @include('inc\messeges')
        <section>
            <h3>Edit Expense</h3>
            <form action="/expenses/{{$expense->id}}" method="POST" autocomplete="off">
                @csrf
                @method('PUT')
                <div class="form-group">
                  <select class="custom-select mr-sm-2"  name="account">
                    <option disabled selected hidden>Choose account...</option>
                    @if (count($accounts) > 0)
                        @foreach ($accounts as $account)
                          <option value="{{$account->id}}" @if($expense->account_id == $account->id) selected @endif>{{$account->name}}</option> 
                        @endforeach
                    @endif
                  </select>
                </div>
                <div class="form-group">
                  <select class="custom-select mr-sm-2"  name="category">
                    <option disabled selected hidden>Choose category...</option>
                    @if (count($categories_ex) > 0)
                        @foreach ($categories_ex as $category)
                          <option value="{{$category->id}}" @if($expense->category_id == $category->id) selected @endif>{{$category->name}}</option> 
                        @endforeach
                    @endif
                  </select>
                </div>
                <div class="form-group">
                  <input id="ex_amount" type="text" class="form-control @error('amount') is-invalid @enderror" placeholder="Amount" value="{{ $expense->amount }}" name="amount">
                  @error('amount')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
                </div>
                <div id="datepicker1" class="input-group date">
                  <input type="text" class="form-control @error('date') is-invalid @enderror" placeholder="Date" value="{{Carbon\Carbon::parse($expense->date)->format('d/m/Y')}}" name="date"><span class="input-group-addon"></span>
                  @error('date')
                      <span class="invalid-feedback" role="alert">
                          <strong>{{ $message }}</strong>
                      </span>
                  @enderror
                </div>
                <a href="/operations" id="cancelBtn" class="btn btn-primary mt-3">CANCEL</a>
                <button id="updateBtn" type="submit" class="btn btn-primary mt-3">UPDATE</button>
              </form>
        </section>
        <script>
            $(document).ready(function(){
              $('#ex_amount').blur(function(){
                $('#ex_amount').val($('#ex_amount').val().replace(",", "."));
              }); 

              $('.input-group.date').datepicker({
                format: "dd/mm/yyyy",
                todayBtn: "linked",
                orientation: "bottom auto",
                autoclose: true,
                container:'#datepicker1'
              });  
            });
        </script>
    </div>
</div>
@endsection
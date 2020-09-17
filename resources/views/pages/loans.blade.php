@extends('layouts.app')

@section('content')
<div class="container-fluid">
  @if (count($accounts) > 0)
    <div class="zoom pb-3 d-flex">
      @if(count($contractors) > 0)
      <h2 id="total_loan" class="p-2 border bg-white rounded-left">Total borrowed: <b>{{Auth::user()->total_loan()['sum']}}</b><span style="color: #0099FF">{{Auth::user()->total_loan()['sign']}}</span></h2>
      <select id="loan_currency" class="btn-primary p-2 rounded-right" style="height: 52px;">
        @if (count($currencies) > 0)
            @foreach ($currencies as $currency)
            <option value="{{$currency->id}}" @if(auth()->user()->currency_id == $currency->id) selected @endif>{{$currency->name}}</option>
            @endforeach
        @endif
      </select>
      <script>
        $(document).ready(function(){

          $('#loan_currency').change(function(e){
            e.preventDefault();

            var id = Number($('#loan_currency').val());

            $.ajax({
                url: 'total_loan/'+id,
                type: 'GET',
                dataType: 'json',
                success: function(response){
                  
                  var sum = response['total_loan'].sum;
                  var sign = response['total_loan'].sign;

                  $('#total_loan').html('Total borrowed: <b>'+sum +'</b><span style="color: #0099FF">'+sign+'</span>');
                }
              });

              $('#loan_currency').blur();
          });

          $('#g_amount').blur(function(){
            $('#g_amount').val($('#g_amount').val().replace(",", "."));
          });

          $('#r_amount').blur(function(){
            $('#r_amount').val($('#r_amount').val().replace(",", "."));
          });

        });
      </script>
      @endif
    </div>
    <div class="row">
      <div class="col-xl-6">
        @include('inc.messeges')
        @if(count($contractors) > 0)
        <section>
          <h3>GIVE MONEY</h3>
          <form action="loan" method="POST" autocomplete="off">
            @csrf
            <div class="form-group">
              <select class="custom-select mr-sm-2 @error('account') is-invalid @enderror" name="account">
                <option disabled selected hidden>Choose account...</option>
                @if (count($accounts) > 0)
                    @foreach ($accounts as $account)
                    <option value="{{$account->id}}" @if(old('account') == $account->id) selected @endif>{{$account->name}}({{$account->currency()->first()->name}})</option> 
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
              <select class="custom-select mr-sm-2 @error('borrower') is-invalid @enderror" name="borrower">
                <option disabled selected hidden>Choose borrower...</option>
                @if (count($contractors) > 0)
                    @foreach ($contractors as $contractor)
                      <option value="{{$contractor->id}}" @if(old('borrower') == $contractor->id) selected @endif>{{$contractor->name}}({{$contractor->currency()->first()->name}})</option> 
                    @endforeach
                @endif
              </select>
              @error('borrower')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
              @enderror
            </div>
            <div class="form-group">
              <input id="g_amount" type="text" class="form-control @error('amount') is-invalid @enderror" placeholder="Amount" value="{{ old('amount') }}" name="amount">
              @error('amount')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
              @enderror
            </div>
            <button type="submit" class="btn btn-primary" data-toggle="confirmation" data-popout="true">CONFIRM</button>
          </form>
        </section>
        <section>
          <h3>RECIVE MONEY</h3>
          <form action="payoff" method="POST" autocomplete="off">
            @csrf
            <div class="form-group">
              <select class="custom-select mr-sm-2 @error('account_') is-invalid @enderror" name="account_">
                <option disabled selected hidden>Choose account...</option>
                @if (count($accounts) > 0)
                    @foreach ($accounts as $account)
                    <option value="{{$account->id}}" @if(old('account_') == $account->id) selected @endif>{{$account->name}}({{$account->currency()->first()->name}})</option> 
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
              <select class="custom-select mr-sm-2 @error('borrower_') is-invalid @enderror" name="borrower_">
                <option disabled selected hidden>Choose borrower...</option>
                @if (count($contractors) > 0)
                    @foreach ($contractors as $contractor)
                    <option value="{{$contractor->id}}" @if(old('borrower_') == $contractor->id) selected @endif>{{$contractor->name}}({{$contractor->currency()->first()->name}})</option> 
                    @endforeach
                @endif
              </select>
              @error('borrower_')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
              @enderror
            </div>
            <div class="form-group">
              <input id="r_amount" type="text" class="form-control @error('amount_') is-invalid @enderror" placeholder="Amount" value="{{ old('amount_') }}" name="amount_">
              @error('amount_')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
              @enderror
            </div>
            <button type="submit" class="btn btn-primary" data-toggle="confirmation" data-popout="true">CONFIRM</button>
          </form>
        </section>
        @endif
        <section>
          <h3>NEW BORROWER</h3>
          <form action="contractors" method="POST" autocomplete="off">
            @csrf
            <div class="form-group">
              <input type="text" class="form-control @error('name') is-invalid @enderror" placeholder="Name" value="{{ old('name') }}" name="name">
              @error('name')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
              @enderror
            </div>
            <div class="form-group">
              <select id="currency" class="custom-select mr-sm-2 @error('currency') is-invalid @enderror" name="currency">
                <option disabled selected hidden>Choose currency...</option>
                @if (count($currencies) > 0)
                    @foreach ($currencies as $currency)
                    <option value="{{$currency->id}}" @if(old('currency') == $currency->id) selected @endif>{{$currency->name}}</option> 
                    @endforeach
                @endif
              </select>
              @error('currency')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
              @enderror
            </div>
            <button type="submit" class="btn btn-primary" data-toggle="confirmation" data-popout="true">ADD</button>
          </form>
        </section>
      </div>
      <div class="col-xl-6">
        @if(count($contractors) > 0)
        <section>
          <table class="table table-bordered table-striped">
            <thead>
              <tr>
                <th scope="col">Borrower</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              @if (count($contractors) > 0)
                  @foreach ($contractors as $contractor)
                    <tr>
                      <td>      
                        {{$contractor->name}}
                      </td>
                      <td>
                        {{number_format($contractor->debt, 2, '.', ' ')}} {{$contractor->currency()->first()->name}}
                      </td>
                    </tr>
                  @endforeach
              @endif     
            </tbody>
          </table>
        </section>
        @endif
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

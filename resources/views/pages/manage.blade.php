@extends('layouts.app')

@section('content')

<div class="container-fluid">
  <div class="zoom pb-3 d-flex">
    <h2 id="total_balance" class="p-2 border bg-white rounded-left">Balance: <b>{{Auth::user()->balance()['sum']}}</b><span style="color: #0099FF">{{Auth::user()->balance()['sign']}}</span></h2>
    <select id="balance_currency" class="btn-primary p-2 rounded-right" style="height: 52px;">
      @if (count($currencies) > 0)
          @foreach ($currencies as $currency)
          <option value="{{$currency->id}}" @if(auth()->user()->currency_id == $currency->id) selected @endif>{{$currency->name}}</option>
          @endforeach
      @endif
    </select>
  </div>
  <div class="row">
    <div class="col-xl-6">
      @include('inc.messeges')
      <section>
        <h3>NEW ACCOUNT</h3> 
        <form action="accounts" method="POST" autocomplete="off">
          @csrf
          <div class="form-group">
            <input type="text" name="name" class="form-control @error('name') is-invalid @enderror" value="{{ old('name') }}" placeholder="Account name">
            @error('name')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
          </div>
          <div class="form-group">
            <select class="custom-select mr-sm-2 @error('currency') is-invalid @enderror" name="currency">
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
          <div class="form-group">
            <input id="balance" type="text" name="balance" class="form-control @error('balance') is-invalid @enderror" value="{{ old('balance') }}" placeholder="Balance">
            @error('balance')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
          </div>
          <button type="submit" class="btn btn-primary">ADD</button>
        </form>
        <script>
          $(document).ready(function(){
            $('#balance').blur(function(){
              $('#balance').val($('#balance').val().replace(",", "."));
            });
          });
        </script>
      </section>
      @if (count($accounts) > 0)
      <!-- Choose account to edit-->
      <section id="chooseAccount">
        <h3>EDIT ACCOUNT</h3>
        <form>
          <div class="form-group">
            <select id="account_id" class="custom-select mr-sm-2">
              <option selected>Choose account...</option>
              @if (count($accounts) > 0)
                  @foreach ($accounts as $account)
                  <option value="{{$account->id}}">{{$account->name}}</option> 
                  @endforeach
              @endif
            </select>
          </div>
          <button id="showEditForm" class="btn btn-primary">EDIT</button>
        </form>
      </section>
      <!-- Edit form-->
      <section id="editForm">
        <h3>EDIT ACCOUNT</h3>
        <form action="" method="post" autocomplete="off">
          @csrf
          @method('PUT')
          <div class="form-group">
            <input id="accountName" type="text" name="name_" class="form-control @error('name_') is-invalid @enderror" value="{{ old('name_') }}" placeholder="Account name">
            @error('name_')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
          </div>
          <div id="currencyId" class="form-group">
            <select class="custom-select mr-sm-2"  name="currency_">
              @if (count($currencies) > 0)
                  @foreach ($currencies as $currency)
                  <option value="{{$currency->id}}">{{$currency->name}}</option> 
                  @endforeach
              @endif
            </select>
          </div>
          <button id="cancelBtn" type="button" class="btn btn-primary">CANCEL</button>
          <button id="confirmBtn" type="submit" class="btn btn-primary">CONFIRM</button>
        </form>
      </section>
      <script>
        $('#editForm').hide();
        $(document).ready(function(){
      
          $('#showEditForm').click(function(e){
              e.preventDefault();
      
              var account_id = Number($('#account_id').val());
      
              $.ajax({
                url: 'accounts/'+account_id,
                type: 'GET',
                dataType: 'json',
                success: function(response){
                  $('#chooseAccount').hide();
                  $('#editForm').show();
                  
                  var name = response['account'].name;
                  var currency_id = response['account'].currency_id;
      
                  $('#accountName').val(name);
                  $('#currencyId select').val(currency_id);
      
                  $('#editForm form').attr('action','accounts/'+account_id);
                }
              });
      
          });
      
          $('#cancelBtn').click(function(e){
              e.preventDefault();
      
              $('#chooseAccount').show();
              $('#editForm').hide();
      
          });
      
          $('#balance_currency').change(function(e){
            e.preventDefault();
      
            var id = Number($('#balance_currency').val());
      
            $.ajax({
                url: 'balance/'+id,
                type: 'GET',
                dataType: 'json',
                success: function(response){
                  
                  var sum = response['balance'].sum;
                  var sign = response['balance'].sign;
      
                  $('#total_balance').html('Balance: <b>'+sum +'</b><span style="color: #0099FF">'+sign+'</span>');
                }
              });
      
              $('#balance_currency').blur();
          });
      
        });
      </script>
      @endif
    </div>
    <div class="col-xl-6">
      <section>
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Balance</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>           
            @if (count($accounts) > 0)
                @foreach ($accounts as $account)
                  <tr>
                    <td>{{$account->name}}</td>
                    <td>{{number_format($account->balance, 2, '.', ' ')}} {{$account->currency()->first()->name}}</td>
                    <td style="width: 25px">
                      <form class="m-0 p-0" action="accounts/{{$account->id}}" method="POST">
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
      </section>
    </div>
  </div>
</div>
@endsection

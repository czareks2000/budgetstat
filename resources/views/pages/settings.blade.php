@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="col-xl-6 offset-xl-3 pt-5">
        @include('inc.messeges')
        <section>
            <h3>Profile</h3>
            <form class="text-left" action="/user/{{Auth::user()->id}}" method="POST" autocomplete="off">
                @csrf
                @method('PUT')
                <div class="form-group">
                    <label for="name">Name</label>
                    <input name="name" type="text" class="form-control @error('name') is-invalid @enderror" id="name" placeholder="Profile name" value="{{Auth::user()->name}}">
                    @error('name')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                    @enderror
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input name="email" type="email" class="form-control @error('email') is-invalid @enderror" id="email" placeholder="Enter email" value="{{Auth::user()->email}}">
                    @error('email')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
                </div>
                <div class="form-group">
                    <label for="password1">New Password</label>
                    <input name="new_password" type="password" class="form-control @error('new_password') is-invalid @enderror" id="password1" placeholder="Enter new password">
                    @error('new_password')
                    <span class="invalid-feedback" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
                </div>
                <div id="confirmPassword" class="form-group">
                    <label for="password2">Confirm Password</label>
                    <input name="password_confirmation" type="password" class="form-control @error('password_confirmation') is-invalid @enderror" id="password2" placeholder="Re-enter new password">
                </div>
                <div class="form-group pb-4 border-bottom">
                    <label for="currency">Default Currency</label>
                    <select id="currency" class="custom-select mr-sm-2" name="currency">
                      @if (count($currencies) > 0)
                          @foreach ($currencies as $currency)
                          <option value="{{$currency->id}}" @if(Auth::user()->currency_id == $currency->id) selected @endif>{{$currency->name}}</option> 
                          @endforeach
                      @endif
                    </select>
                </div>
                <div class="form-group d-flex mt-4">
                    <input name="current_password" type="password" class="form-control ml-auto mr-3 @if(session('error')) is-invalid @endif" id="password1" placeholder="Enter current password">
                    <button type="submit" class="btn btn-primary text-nowrap" disable>Update Profile</button>
                </div>  
            </form>
        </section>
        <script>
            $('#confirmPassword').hide();

            $('#password1').blur(function(){
                if($('#password1').val().length === 0)
                {
                    $('#confirmPassword').hide();
                    $('#password2').val("");
                }
                else
                {
                    $('#confirmPassword').show();
                }
            });

            $('#password1').focus(function(){
                $('#confirmPassword').show();
            });
        </script>
    </div>
</div>
@endsection

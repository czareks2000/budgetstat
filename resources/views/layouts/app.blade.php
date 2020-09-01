<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <!-- Custom CSS -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="{{ asset('css/all.css') }}" rel="stylesheet"> <!--load all styles -->
    <!-- jQuery sidebar -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js" integrity="sha512-WNLxfP/8cVYL9sj8Jnp6et0BkubLP31jhTG9vhL/F5uEZmg5wEzKoXp1kJslzPQWwPT1eyMiSxlKCgzHLOTOTQ==" crossorigin="anonymous"></script>
    <!-- DataTable -->
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css">
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.21/js/jquery.dataTables.js"></script>
    <!-- Chart.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.bundle.js" integrity="sha512-G8JE1Xbr0egZE5gNGyUm1fF764iHVfRXshIoUWCTPAbKkkItp/6qal5YAHXrxEu4HNfPTQs6HOu3D5vCGS1j3w==" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.css" integrity="sha512-SUJFImtiT87gVCOXl3aGC00zfDl6ggYAw5+oheJvRJ8KBXZrr/TMISSdVJ5bBarbQDRC2pR5Kto3xTR0kpZInA==" crossorigin="anonymous" />
    <!-- Datapicker -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js" integrity="sha512-T/tUfKSV1bihCnd+MxKD0Hm1uBBroVYBOYSk1knyvQ9VyZJpc/ALb4P0r6ubwVPSGB2GvjeoMAJJImBG12TiaQ==" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css" integrity="sha512-mSYUmp1HYZDFaVKK//63EcZq4iFWFjxSL+Z3T/aCt4IO9Cejm03q3NKKYN6pFQzY0SBOr8h+eCIAZHPXcpZaNw==" crossorigin="anonymous" />

    
    <title>{{ config('app.name', 'BudgetStat') }}</title>

  </head>
  <body>

    <!-- Navbar -->
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light box-shadow fixed-top">
        <a class="navbar-brand ml-0" href="/"><img src="{{url('/img/logo.png')}}" class="d-inline-block align-bottom" width="30" alt="">BudgetStat</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			    <span class="navbar-toggler-icon"></span>
			  </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav d-block d-lg-none ml-auto">
            <!-- Profile link
            <li class="nav-item ml-3">
              <a class="nav-link" href="/profile"><i class="fas fa-user-circle"></i> Profile</a>
            </li>
            -->
            <li class="nav-item ml-3">
              <a class="nav-link" href="/stats"><i class="far fa-chart-bar"></i> Statistics</a>
            </li>
            <li class="nav-item ml-3">
              <a class="nav-link" href="/manage"><i class="far fa-edit"></i> Manage accounts</a>
            </li>
            <li class="nav-item ml-3">
              <a class="nav-link" href="/operations"><i class="fas fa-dollar-sign"></i> Incomes/Expenses</a>
            </li>
            <li class="nav-item ml-3">
              <a class="nav-link" href="/loans"><i class="far fa-clipboard"></i> Loans</a>
            </li>
            <li class="nav-item ml-3">
              <a class="nav-link" href="/settings"><i class="fas fa-cog"></i> Settings</a>
            </li>
            <li class="nav-item ml-3 text-nowrap">
              <a class="nav-link" href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                <i class="fas fa-sign-out-alt"></i> Log out</a>
            </li>
          </ul>
        </div>
          <ul class="navbar-nav d-none d-lg-flex">
            <li class="nav-item">
              <a class="nav-link" href="/manage">{{Auth::user()->balance()['sum']}}{{Auth::user()->balance()['sign']}} <i class="fas fa-wallet"></i></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="{{ route('logout') }}" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                Log out <i class="fas fa-sign-out-alt"></i></a>
            </li>
            <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                @csrf
            </form>
          </ul>
      </nav>
    </header>

    <!-- Side navigation -->
		<nav class="sidenav d-none d-lg-block">
		  <a class="{{ Request::is('stats') ? 'active' : '' }}" href="/stats"><div><i class="far fa-chart-bar"></i></div>Statistics</a>
		  <a class="{{ Request::is('manage') ? 'active' : '' }}" href="/manage"><div><i class="far fa-edit"></i></div>Manage accounts</a>
		  <a class="{{ Request::is('operations') ? 'active' : '' }}" href="/operations"><div><i class="fas fa-dollar-sign"></i></i></div>Incomes/Expenses</a>
		  <a class="{{ Request::is('loans') ? 'active' : '' }}" href="/loans"><div><i class="far fa-clipboard"></i></div>Loans</a>
		  <a class="{{ Request::is('settings') ? 'active' : '' }}" href="/settings"><div><i class="fas fa-cog"></i></div>Settings</a>
    </nav>

		<!-- Page content -->
		<div class="main">
      <main>
        <div class="container-fluid">
            @yield('content')
      </main>
      <div style="height: 80px;"></div>
      <footer class="fixed-bottom">
        <div class="container-fluid">
          All rights reserved &copy; 2020 Cezary Stachurski
        </div>
      </footer>
    </div>

    <!-- Popper.js, Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    <script src="{{ asset('js/bootstrap-confirmation.js') }}"></script>
    <script>
      $('[data-toggle=confirmation]').confirmation({
        rootSelector: '[data-toggle=confirmation]',
      });
    </script>
  </body>
</html>
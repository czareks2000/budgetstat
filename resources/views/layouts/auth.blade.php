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
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>

    <title>{{ config('app.name', 'BudgetStat') }}</title>

  </head>
  <body>

    <!-- Navbar -->
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light box-shadow fixed-top">
        <div class="container">
            <a class="navbar-brand " href="/"><img src="../img/logo.png" class="d-inline-block align-bottom" width="30" alt="">BudgetStat</a>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item ml-3">
                  <a class="nav-link" href="{{ route('login') }}">Login</a>
                </li>
                <li class="nav-item ml-3">
                    <a class="nav-link" href="{{ route('register') }}">Register</a>
                </li>
            </ul>
        </div>
      </nav>
    </header>

    
		<!-- Page content -->
		<div class="main ml-0">
            <main>
                <div class="container-fluid">
                    @yield('content')
            </main>
            <div style="height: 80px;"></div>
            <footer class="fixed-bottom">
                <div class="container-fluid text-center">
                All rights reserved &copy; 2018 Cezary Stachurski
                </div>
            </footer>
        </div>

    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
  </body>
</html>
@extends('layouts.app')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-xl-4 d-block d-xl-none">
            <section class="px-4 py-5 text-center">
                <h2>Your Balance:</h2>
                <p class="display-4"><b>{{Auth::user()->balance()['sum']}}</b><span style="color: #0099FF"> {{Auth::user()->balance()['sign']}}</span></p>
            </section>
        </div>
        <div class="col-xl-4">
            <section class="p-4 mt-4 text-xl-right text-center">
                <h5 class="mt-3"><b>Income this month:</b></h5> 
                <h4>{{Auth::user()->total_income()['sum']}}<span style="color: #0099FF"> {{Auth::user()->total_income()['sign']}}</span></h4>
                <h5><b>Expenses this month:</b></h5> 
                <h4>{{Auth::user()->total_expense()['sum']}}<span style="color: #0099FF"> {{Auth::user()->total_expense()['sign']}}</span></h4>
            </section>
        </div>
        <div class="col-xl-4 d-none d-xl-block">
            <section class="px-4 pt-5 pb-4 text-center">
                <h2>Your Balance:</h2>
                <p class="display-4"><b>{{Auth::user()->balance()['sum']}}</b><span style="color: #0099FF"> {{Auth::user()->balance()['sign']}}</span></p>
                <h5 id="difference"></h5>
            </section>
        </div>
        <div class="col-xl-4">
            <section class="p-4 mt-4 text-xl-left text-center">
                <h5><b>Avg monthly income:</b></h5>
                @if (count($incomes) > 0)
                <h4>{{Auth::user()->avg_income()}}<span style="color: #0099FF"> {{Auth::user()->balance()['sign']}}</span></h4>
                @else
                <h4>0<span style="color: #0099FF"> {{Auth::user()->balance()['sign']}}</span></h4>
                @endif
                <h5 class="mt-3"><b>Avg monthly expenses:</b></h5> 
                @if (count($expenses) > 0)
                <h4>{{Auth::user()->avg_expenses()}}<span style="color: #0099FF"> {{Auth::user()->balance()['sign']}}</span></h4>
                @else
                <h4>0<span style="color: #0099FF"> {{Auth::user()->balance()['sign']}}</span></h4>
                @endif
            </section>
        </div>
    </div>
    @if (count($expenses) > 0 || count($incomes) > 0)
    <div class="row">
        <div class="col-xl-6">
            <section id="chart3">
                <canvas id="lineChart1" width="10" height="5"></canvas>
            </section>
        </div>
        <div class="col-xl-6">
            <section id="chart4">
                <canvas id="lineChart2" width="10" height="5"></canvas>
            </section>
        </div>
    </div>
    <div class="row">
        <div class="col-xl-6">
            <section id="chart1">
                <canvas id="expensesChart" width="10" height="5"></canvas>
            </section>
        </div>
        <div class="col-xl-6">
            <section id="chart2">
                <canvas id="incomesChart" width="10" height="5"></canvas>
            </section>
        </div>
    </div>
    <div class="row">
        <div class="col-xl-6">
            <section id="chart1">
                <canvas id="avgExpensesChart" width="10" height="5"></canvas>
            </section>
        </div>
        <div class="col-xl-6">
            <section id="chart2">
                <canvas id="avgIncomesChart" width="10" height="5"></canvas>
            </section>
        </div>
    </div>
    @else
    <div class="alert alert-warning mt-5" role="alert">
        There are no statistics to show yet.
        <a class="alert-link" href="/operations">Add new income or expense first</a>
      </div>
    @endif
    
</div>
<script>
    $(document).ready(function(){

        const dateObj = new Date()
        const monthName = dateObj.toLocaleString("default", { month: "long" })
        var sign = "{{Auth::user()->total_expense()['sign']}}";
        var difference = parseFloat("{{Auth::user()->total_income()['sum']}}".replace(' ', ''));
        difference -= parseFloat("{{Auth::user()->total_expense()['sum']}}".replace(' ', ''));

        if(difference >= 0)
        {
            $('#difference').html('<span style="color: #0a9c00;">+'+difference.toFixed(2)+'</span> '+sign);
        }
        else
        {
            $('#difference').html('<span style="color: #ed0000;">'+difference.toFixed(2)+'</span> '+sign);
        }
        
        Chart.defaults.global.defaultFontColor = "#000";
        Chart.defaults.global.defaultFontFamily = 'Poppins';
        Chart.defaults.global.defaultFontSize = 14;

        var Months_ex = new Array();;
        var Expenses_ex = new Array();;
        $.ajax({
            url: 'expensesByMonths',
            type: 'GET',
            dataType: 'json',
            success: function(response){
                
                for (const [key, value] of Object.entries(response['expensesByMonths'])) {
                    Months_ex.push(key);
                    Expenses_ex.push(Math.round(value * 100) / 100);
                }
                
                var ctx = $('#lineChart1');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: Months_ex,
                        datasets: [{
                            label: 'Expenses',
                            data: Expenses_ex,
                            backgroundColor: 'rgba(0, 153, 255, 0.2)',
                            borderColor: 'rgba(0, 153, 255, 1)',
                            borderWidth: 1,
                            pointBackgroundColor: 'rgba(0, 153, 255, 1)',
                            lineTension: 0
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values) {
                                        return value + " " +sign;
                                    }
                                }
                            }]
                        },
                        title:{
                            display: true,
                            fontSize: 18,
                            text: "Expenses"
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            callbacks: {
                                label: (item) => `${item.yLabel} `+sign
                            }
                        }
                    }
                });
            }
        });

        var Months_in = new Array();;
        var Expenses_in = new Array();;
        $.ajax({
            url: 'incomesByMonths',
            type: 'GET',
            dataType: 'json',
            success: function(response){
                
                for (const [key, value] of Object.entries(response['incomesByMonths'])) {
                    Months_in.push(key);
                    Expenses_in.push(Math.round(value * 100) / 100);
                }
                
                var ctx = $('#lineChart2');
                var myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: Months_in,
                        datasets: [{
                            label: 'Incomes',
                            data: Expenses_in,
                            backgroundColor: 'rgba(0, 153, 255, 0.2)',
                            borderColor: 'rgba(0, 153, 255, 1)',
                            borderWidth: 1,
                            pointBackgroundColor: 'rgba(0, 153, 255, 1)',
                            lineTension: 0
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values) {
                                        return value + " " +sign;
                                    }
                                }
                            }]
                        },
                        title:{
                            display: true,
                            fontSize: 18,
                            text: "Incomes"
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            callbacks: {
                                label: (item) => `${item.yLabel} `+sign
                            }
                        }
                    }
                });
            }
        });

        var Categories_ex = new Array();;
        var Data_ex = new Array();;
        $.ajax({
            url: 'expensesByCategories',
            type: 'GET',
            dataType: 'json',
            success: function(response){
                
                for (const [key, value] of Object.entries(response['expensesByCategories'])) {
                    Categories_ex.push(key);
                    Data_ex.push(Math.round(value * 100) / 100);
                }
                
                var ctx = $('#expensesChart');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: Categories_ex,
                        datasets: [{
                            label: 'Expenses',
                            data: Data_ex,
                            backgroundColor: 'rgba(0, 153, 255, 0.2)',
                            borderColor: 'rgba(0, 153, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values) {
                                        return value + " " +sign;
                                    }
                                }
                            }]
                        },
                        title:{
                            display: true,
                            fontSize: 18,
                            text: "Expenses in " + monthName
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            callbacks: {
                                label: (item) => `${item.yLabel} `+sign
                            }
                        }
                    }
                });
            }
        });
            
        var Categories_in = new Array();;
        var Data_in = new Array();;
        $.ajax({
            url: 'incomesByCategories',
            type: 'GET',
            dataType: 'json',
            success: function(response){
                
                for (const [key, value] of Object.entries(response['incomesByCategories'])) {
                    Categories_in.push(key);
                    Data_in.push(Math.round(value * 100) / 100);
                }
                
                var ctx = $('#incomesChart');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: Categories_in,
                        datasets: [{
                            label: 'Incomes',
                            data: Data_in,
                            backgroundColor: 'rgba(0, 153, 255, 0.2)',
                            borderColor: 'rgba(0, 153, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values) {
                                        return value + " " +sign;
                                    }
                                }
                            }]
                        },
                        title:{
                            display: true,
                            fontSize: 18,
                            text: "Incomes in " + monthName
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            callbacks: {
                                label: (item) => `${item.yLabel} `+sign
                            }
                        }
                    }
                });
            }
        });

        var Avg_Categories_ex = new Array();;
        var Avg_Data_ex = new Array();;
        $.ajax({
            url: 'avg_expensesByCategories',
            type: 'GET',
            dataType: 'json',
            success: function(response){
                
                for (const [key, value] of Object.entries(response['avg_expensesByCategories'])) {
                    Avg_Categories_ex.push(key);
                    Avg_Data_ex.push(Math.round(value * 100) / 100);
                }
                
                var ctx = $('#avgExpensesChart');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: Avg_Categories_ex,
                        datasets: [{
                            label: 'Expenses',
                            data: Avg_Data_ex,
                            backgroundColor: 'rgba(0, 153, 255, 0.2)',
                            borderColor: 'rgba(0, 153, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values) {
                                        return value + " " +sign;
                                    }
                                }
                            }]
                        },
                        title:{
                            display: true,
                            fontSize: 18,
                            text: "Avg Monthly Expenses"
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            callbacks: {
                                label: (item) => `${item.yLabel} `+sign
                            }
                        }
                    }
                });
            }
        });

        var Avg_Categories_in = new Array();;
        var Avg_Data_in = new Array();;
        $.ajax({
            url: 'avg_incomesByCategories',
            type: 'GET',
            dataType: 'json',
            success: function(response){
                
                for (const [key, value] of Object.entries(response['avg_incomesByCategories'])) {
                    Avg_Categories_in.push(key);
                    Avg_Data_in.push(Math.round(value * 100) / 100);
                }
                
                var ctx = $('#avgIncomesChart');
                var myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: Avg_Categories_in,
                        datasets: [{
                            label: 'Incomes',
                            data: Avg_Data_in,
                            backgroundColor: 'rgba(0, 153, 255, 0.2)',
                            borderColor: 'rgba(0, 153, 255, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function(value, index, values) {
                                        return value + " " +sign;
                                    }
                                }
                            }]
                        },
                        title:{
                            display: true,
                            fontSize: 18,
                            text: "Avg Monthly Incomes"
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            callbacks: {
                                label: (item) => `${item.yLabel} `+sign
                            }
                        }
                    }
                });
            }
        });

    });    

    
</script>
@endsection
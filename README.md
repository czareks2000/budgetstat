# Aplikacja internetowa wspierająca zarządzanie budżetem

## Cel i założenia projektu

Celem pracy jest stworzenie aplikacji, która umożliwiałaby kontrolowanie wydatków i przychodów. Użytkownik mógłby wprowadzać do niej wszystkie swoje wydatki i przychody razem z kategoriami i datą. Aplikacja udostępniałaby statystyki, które będą wyświetlane na wykresach lub drukowane do pliku (porównanie do poprzednich miesięcy, średnie wydatki, ilość posiadanego kapitału na różnych kontach itp.). Oprócz prowadzenia statystyk byłaby opcja wyznaczania budżetu (ile chcemy przeznaczyć na daną kategorię w danym okresie). Dodatkowo aplikacja wspierałaby wielowalutowość.

## Wymagania funkcjonalne

- Wprowadzanie wydatków / przychodów
- Dodawanie kont, na których przechowywane są środki
- Generowanie statystyk:
  - Średnie
  - Sumy
  - Porównania
  - Filtrowanie według dat i kategorii
- Historia wydatków / przychodów
- Sekcja pożyczek
  - Dodawanie / usuwanie podmiotów
  - Pożyczki / zwroty kapitału
  - Historia pożyczek według podmiotów
- Zarządzanie kategoriami
- Wyznaczenie budżetu na daną kategorię
- Możliwość wybrania w jakiej walucie wyświetlane są kwoty

## Użyte technologie

### Backend
- .NET 8.0
- EntityFramework

### Frontend
- React
- MaterialUI

### Baza danych
- PostgreSQL

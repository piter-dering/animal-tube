ANIMALTUBE NA VERCELU

Struktura: public/ (strona), api/ (serwer Node: auth, data, doc), baza Redis (Upstash).

WDROZENIE
1. Wrzuc ten folder na GitHub (nowe repozytorium).
2. vercel.com -> Add New -> Project -> wybierz repozytorium (Framework: Other). Deploy.
3. W projekcie: zakladka Storage -> Create Database -> Upstash Redis (plan Free) -> Connect to Project.
   Vercel sam doda zmienne srodowiskowe, nic nie kopiujesz.
4. Deployments -> Redeploy (zeby funkcje zobaczyly baze).
5. Domena: ./set-domain.sh twoj-projekt.vercel.app (albo wlasna), potem push na GitHub.

JAK DZIALA LOGOWANIE (bez hasla)
- Wpisujesz sama nazwe. Serwer rezerwuje ja i daje klucz, ktory zapisuje sie w localStorage tej przegladarki.
- Ta sama nazwa na innym urzadzeniu jest "zajeta". Wyczyszczenie danych przegladarki = utrata konta.
- Kazdy moze zalozyc dowolna wolna nazwe, brak weryfikacji e-mail ani limitu rejestracji.

OGRANICZENIA
- Wideo: link https do pliku mp4/webm (Vercel nie przyjmuje duzych plikow).
- Strona sprawdza zmiany co 20 s (tylko gdy karta jest aktywna), zeby nie zuzywac limitu Upstash Free.
- Adresy filmow to #watch-ID, wiec Google indeksuje glownie strone glowna.

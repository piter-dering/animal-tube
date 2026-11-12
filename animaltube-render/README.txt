ANIMALTUBE: GITHUB + RENDER

Jeden serwer Node (server.js) serwuje strone (public/) i API (api/). Na Renderze dziala jako Web Service.

1. GITHUB
   github.com -> New repository (np. animaltube) -> "uploading an existing file" -> przeciagnij CALA zawartosc tego folderu -> Commit.
2. RENDER
   render.com -> New -> Web Service -> polacz GitHub i wybierz repozytorium.
   Build Command: npm install   Start Command: npm start   Instance type: Free   -> Create.
   (Albo New -> Blueprint, plik render.yaml ustawi to sam.)
3. Po wdrozeniu dostajesz adres https://animaltube.onrender.com . Wpisz go: ./set-domain.sh animaltube.onrender.com
   (albo znajdz i zamien TWOJA-DOMENA.pl w public/index.html, robots.txt, sitemap.xml), potem wgraj zmiany na GitHub.

TRWALOSC DANYCH (wazne)
- Bez dodatkowej konfiguracji dane leza w pliku data.json. Na darmowym Renderze dysk jest tymczasowy:
  po uspieniu (ok. 15 min bez ruchu), restarcie lub nowym wdrozeniu konta, filmy i komentarze znikaja.
- Zeby dane byly trwale i dalej za darmo: upstash.com -> Create Database (Redis, Free) -> skopiuj
  UPSTASH_REDIS_REST_URL i UPSTASH_REDIS_REST_TOKEN -> Render -> Environment -> dodaj obie zmienne. Serwer sam z nich skorzysta.

LOGOWANIE (bez hasla)
- Wpisujesz sama nazwe. Serwer rezerwuje ja i daje klucz zapisany w localStorage przegladarki.
- Ta sama nazwa na innym urzadzeniu jest zajeta. Wyczyszczenie danych przegladarki = utrata konta.

TEST LOKALNY: npm install, npm start, otworz http://localhost:3000

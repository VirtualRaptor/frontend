import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { FaChartBar, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
// Motywacyjne cytaty (przykładowe)
const quotes = {
  low: "Świetnie sobie radzisz – trzymaj tak dalej!",
  medium: "Masz pewne symptomy wypalenia, ale da się to opanować!",
  high: "Czas na zdecydowane zmiany – zdrowie jest najważniejsze!",
};

// Dynamiczny kolor tła w zależności od wyniku
function getResultColor(score, maxScore) {
  const percentage = (score / maxScore) * 100;
  if (percentage < 30) return "#d4edda";   // zielony
  if (percentage < 60) return "#fff3cd";   // żółty
  return "#f8d7da";                       // czerwony
}
const getResultAnalysis = (score) => {
  if (score <= 30) {
    // NISKI POZIOM WYPALENIA
    return `
      <h3>📊 Szczegółowa analiza wyników</h3>
      <h4>Niski poziom wypalenia zawodowego (0-30% maksymalnej liczby punktów)</h4>
      <p>
        Twój wynik wskazuje na brak poważnych objawów wypalenia zawodowego. 
        Oznacza to, że w obecnej chwili potrafisz utrzymać równowagę między życiem zawodowym a prywatnym, 
        a codzienne obowiązki nie wywołują u Ciebie chronicznego zmęczenia. 
        Praca prawdopodobnie daje Ci satysfakcję, a Twoja motywacja utrzymuje się na stabilnym poziomie. 
        Potrafisz czerpać przyjemność z zadań, które wykonujesz, a ewentualne trudności traktujesz jak wyzwania lub okazje do dalszego rozwoju.
      </p>
      <p>
        Świadczy to także o tym, że wypracowałeś/aś metody skutecznego radzenia sobie ze stresem. 
        Być może potrafisz planować swój dzień tak, aby nie dopuścić do przeładowania zadaniami, 
        a w przerwach regenerujesz się na tyle efektywnie, że do kolejnych działań podchodzisz z energią. 
        Relacje ze współpracownikami czy przełożonymi również nie sprawiają Ci większych problemów, 
        co pozwala na utrzymanie pozytywnej atmosfery i dobrej komunikacji w zespole.
      </p>
      <p>
        Dobra kondycja psychiczna przekłada się zazwyczaj na otwartość na nowe projekty, 
        skłonność do nauki i podnoszenia kwalifikacji. 
        Pamiętaj jednak, że nawet przy niskim poziomie wypalenia warto dbać o profilaktykę: 
        regularne przerwy, aktywność fizyczną, zdrowy sen i czas wolny poświęcony pasjom. 
        Dzięki temu możesz dłużej utrzymać obecną dobrą formę i w porę wychwycić wszelkie oznaki przeciążenia.
      </p>
      <p>
        Istotne jest także budowanie wspierających relacji w miejscu pracy. 
        Docenianie współpracowników, konstruktywne rozwiązywanie konfliktów i dzielenie się sukcesami 
        wzmacniają poczucie sensu wykonywanych obowiązków. 
        Jeśli masz poczucie, że coś jeszcze można poprawić, rozważ krótkie rozmowy z przełożonym 
        na temat dalszego rozwoju czy nowych wyzwań. 
        W ten sposób nie tylko unikniesz zastoju, lecz także wzmocnisz swoje zadowolenie z pracy.
      </p>
      <p>
        Nawet jeżeli teraz czujesz się komfortowo i nie masz wyraźnych oznak wypalenia, 
        nie rezygnuj z dbałości o równowagę psychofizyczną. 
        Warto pamiętać, że sytuacja w firmie czy w życiu osobistym może się zmienić, 
        a im lepiej przygotowany/a jesteś do reagowania na stres, tym łatwiej zachowasz spokój i efektywność. 
        Utrzymywanie zdrowych nawyków będzie procentowało na dłuższą metę, pozwalając Ci dalej czerpać radość z pracy.
      </p>
      <ul>
        <li><strong>Zmęczenie emocjonalne:</strong> Niski poziom – zwykle czujesz się wypoczęty/a i masz stabilny poziom energii.</li>
        <li><strong>Cynizm i dystans emocjonalny:</strong> Praca wydaje Ci się istotna, masz zdrowe relacje z zespołem.</li>
        <li><strong>Poczucie braku efektywności:</strong> Wierzysz, że Twoje wysiłki przynoszą zauważalne efekty.</li>
      </ul>
    `;
  } else if (score <= 60) {
    // UMIARKOWANY POZIOM WYPALENIA
    return `
      <h3>📊 Szczegółowa analiza wyników</h3>
      <h4>Umiarkowany poziom wypalenia zawodowego (31-60% maksymalnej liczby punktów)</h4>
      <p>
        Twój wynik sugeruje, że zaczynasz odczuwać pewne symptomy wypalenia. 
        Może to być okresowe znużenie czy brak motywacji, który pojawia się po kilku intensywnych tygodniach pracy, 
        a niekiedy przenosi się również na weekendy. 
        Bywa, że zadania, które wcześniej sprawiały Ci satysfakcję, teraz budzą większy opór, 
        a myśl o nowych wyzwaniach nie zawsze wywołuje entuzjazm.
      </p>
      <p>
        Możliwe, że trudniej Ci się skupić i częściej miewasz poczucie, że Twoje wysiłki nie są w pełni doceniane. 
        Zauważasz większą drażliwość albo chęć izolacji od współpracowników w sytuacjach stresowych. 
        Może brakować Ci jasnej wizji rozwoju w obecnej roli, co potęguje wahania nastroju i wątpliwości 
        co do dalszej ścieżki zawodowej. Nasilające się poczucie przeciążenia może sprawić, że coraz częściej 
        odliczasz dni do urlopu albo popołudnia do końca dniówki.
      </p>
      <p>
        Na szczęście umiarkowany poziom wypalenia daje się stosunkowo szybko opanować, 
        jeśli podejmiesz działania zapobiegawcze. Warto zastanowić się, czy istnieje sposób na przeorganizowanie pracy, 
        wyznaczenie czytelniejszych priorytetów, a także wprowadzenie krótkich, ale regularnych przerw regeneracyjnych. 
        Pomóc może też rozmowa z przełożonym o możliwościach rozwoju albo zaufanym kolegą/koleżanką z zespołu 
        o tym, co można usprawnić w bieżącej współpracy. 
        Jeśli masz taką możliwość, rozważ krótkie szkolenia rozwijające Twoje kompetencje, 
        co nierzadko dodaje nowej energii i poczucia sensu.
      </p>
      <p>
        Nie zapominaj też o regeneracji poza pracą. Nawet drobne formy aktywności fizycznej czy hobby 
        potrafią znacznie poprawić nastrój i odporność na stres. 
        Istotna bywa także umiejętność jasnego komunikowania własnych granic – 
        jeśli czujesz, że bierzesz na siebie zbyt wiele obowiązków, spróbuj ustalić z przełożonym 
        bardziej realne zakresy działań. 
        Pamiętaj, że wczesne reagowanie na objawy wypalenia zazwyczaj zapobiega ich rozwojowi do poziomu wysokiego.
      </p>
      <p>
        Przy umiarkowanym poziomie wypalenia ważne jest, by nie bagatelizować swoich odczuć. 
        Mimo że nie czujesz jeszcze pełnego wypalenia, takie symptomy często są ostrzeżeniem, 
        że potrzebujesz bardziej zbilansowanego podejścia do pracy. 
        Zmniejszenie obciążenia, lepsza organizacja, wsparcie w zespole i dodatkowe przerwy 
        mogą pomóc Ci odzyskać dawny poziom zaangażowania i cieszyć się stabilną satysfakcją z wykonywanego zawodu.
      </p>
      <ul>
        <li><strong>Zmęczenie emocjonalne:</strong> Czasowe spadki energii, zwłaszcza przy dużej liczbie zadań.</li>
        <li><strong>Cynizm i dystans emocjonalny:</strong> Narastająca obojętność lub zniechęcenie w niektórych okresach.</li>
        <li><strong>Poczucie braku efektywności:</strong> Pojawiają się wątpliwości co do sensu i skuteczności Twoich działań.</li>
      </ul>
    `;
  } else {
    // WYSOKI POZIOM WYPALENIA
    return `
      <h3>📊 Szczegółowa analiza wyników</h3>
      <h4>Wysoki poziom wypalenia zawodowego (61-100% maksymalnej liczby punktów)</h4>
      <p>
        Twój wynik wskazuje na znaczne obciążenie związane z pracą, które może przejawiać się w chronicznym zmęczeniu, 
        utrzymującym się nawet po dłuższym odpoczynku. Wiele osób dotkniętych wysokim wypaleniem 
        doświadcza silnego spadku motywacji i trudności z wykonywaniem codziennych obowiązków, 
        co nierzadko wiąże się z poczuciem bezsensu i frustracji. 
        Niekiedy pojawiają się także fizyczne objawy przeciążenia, takie jak bóle głowy czy osłabienie.
      </p>
      <p>
        Możesz zauważać, że Twoje podejście do pracy stało się cyniczne, a dystans emocjonalny wobec zadań i współpracowników 
        narasta. Zdarza się, że proste sprawy wywołują nieproporcjonalnie silną reakcję irytacji lub zniechęcenia. 
        Trudniej też utrzymać koncentrację, co powoduje dodatkowe opóźnienia i potęguje presję. 
        W skrajnych przypadkach wysoki poziom wypalenia może prowadzić do epizodów depresyjnych 
        lub całkowitej utraty chęci do kontynuowania aktywności zawodowej.
      </p>
      <p>
        W takiej sytuacji kluczowe jest podjęcie zdecydowanych kroków w kierunku zmiany. 
        Jeśli to możliwe, porozmawiaj z przełożonym o realnej redukcji obciążenia lub zorganizowaniu pomocy w projektach. 
        Rozważ kontakt z psychologiem, terapeutą lub coachem, którzy pomogą Ci spojrzeć na obecną sytuację z innej perspektywy 
        i zaplanować strategię poprawy. Niekiedy niezbędne okazuje się wzięcie dłuższego urlopu zdrowotnego 
        lub zmiana miejsca pracy – szczególnie gdy warunki w firmie nie rokują poprawy. 
      </p>
      <p>
        Pamiętaj, że wypalenie zawodowe to nie tylko kwestia braku motywacji, ale poważne obciążenie 
        mogące negatywnie wpłynąć na Twoje zdrowie psychiczne i fizyczne. 
        Działając odpowiednio wcześnie, masz szansę na odzyskanie równowagi i wypracowanie zdrowszych granic 
        między życiem prywatnym a zawodowym. Zidentyfikowanie źródeł stresu oraz regularna refleksja nad własnymi potrzebami 
        i priorytetami to dobre punkty wyjścia do poprawy sytuacji.
      </p>
      <p>
        Jeśli czujesz, że nie radzisz sobie samodzielnie, nie wahaj się prosić o pomoc. 
        Rozmowy z bliskimi, kolegami z pracy czy specjalistami mogą przynieść wsparcie i wskazać możliwe ścieżki wyjścia. 
        Pamiętaj, że wysoki poziom wypalenia nie jest sytuacją bez wyjścia – przy odpowiednim wsparciu i wprowadzaniu zmian 
        (czasem nawet radykalnych) możesz stopniowo odbudować swoją energię, wiarę we własne możliwości oraz satysfakcję z życia.
      </p>
      <ul>
        <li><strong>Zmęczenie emocjonalne:</strong> Utrzymujące się wyczerpanie, nieustępujące po przerwach i weekendach.</li>
        <li><strong>Cynizm i dystans emocjonalny:</strong> Rosnące uczucie obojętności czy zniechęcenia wobec współpracowników i obowiązków.</li>
        <li><strong>Poczucie braku efektywności:</strong> Silne wrażenie, że wysiłki nie przekładają się na realne efekty, co rodzi frustrację.</li>
      </ul>
    `;
  }
};
// Rejestracja komponentów Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const jobAdvice = {
    "lekarz": {
      "powody_wypalenia": [
        "Wysoka odpowiedzialność za życie i zdrowie pacjentów.",
        "Długie godziny pracy i brak równowagi między życiem zawodowym a prywatnym.",
        "Częsty kontakt z cierpieniem i śmiercią, co może prowadzić do traumy.",
        "Presja ze strony pacjentów i ich rodzin, często roszczeniowe podejście.",
        "Problemy z biurokracją i niedofinansowaniem służby zdrowia.",
        "Niedocenianie ich pracy zarówno finansowo, jak i społecznie."
      ],
      "porady": [
        "Zadbaj o regularne przerwy i czas dla siebie.",
        "Korzystaj ze wsparcia psychologicznego i grup wsparcia dla lekarzy.",
        "Ustal granice w pracy, aby uniknąć nadmiernego obciążenia.",
        "Regularnie uprawiaj sport lub medytację, aby zredukować stres.",
        "Rozważ konsultacje z doradcą zawodowym, jeśli czujesz, że wypalenie się nasila.",
        "Buduj relacje z kolegami po fachu, by wymieniać się doświadczeniami i wsparciem."
      ]
    },
    "pielęgniarka": {
      "powody_wypalenia": [
        "Intensywny kontakt z pacjentami i ich cierpieniem.",
        "Niskie wynagrodzenie w stosunku do ilości pracy.",
        "Nocne dyżury i duże obciążenie fizyczne.",
        "Brak wystarczającego wsparcia w zespole medycznym.",
        "Presja związana z odpowiedzialnością za podawanie leków.",
        "Częste braki kadrowe skutkujące nadmiernym obciążeniem."
      ],
      "porady": [
        "Dbaj o zdrowy sen i regenerację organizmu.",
        "Znajdź czas na hobby i aktywności relaksujące po pracy.",
        "Buduj relacje w miejscu pracy, aby mieć wsparcie od kolegów i koleżanek.",
        "Nie bój się prosić o pomoc, gdy czujesz się przeciążony/a.",
        "Korzystaj z programów pomocy psychologicznej dostępnych w środowisku medycznym.",
        "Regularnie praktykuj ćwiczenia fizyczne, aby przeciwdziałać zmęczeniu fizycznemu."
      ]
    },
    "ratownik": {
      "powody_wypalenia": [
        "Praca w ekstremalnych warunkach, pod ciągłą presją czasu.",
        "Częsta styczność z traumatycznymi sytuacjami i ludzkim cierpieniem.",
        "Brak wystarczającego czasu na odpoczynek między zmianami.",
        "Narażenie na agresję ze strony pacjentów i osób postronnych.",
        "Niskie wynagrodzenie w porównaniu do ryzyka zawodowego.",
        "Trudności z równowagą między życiem prywatnym a pracą."
      ],
      "porady": [
        "Korzystaj z pomocy psychologicznej, jeśli odczuwasz skutki stresu pourazowego.",
        "Dbaj o odpowiednią ilość snu i zdrową dietę.",
        "Ćwicz techniki relaksacyjne, np. głębokie oddychanie lub medytację.",
        "Unikaj nadmiernego obciążenia, planując odpowiednio swoje dyżury.",
        "Buduj wsparcie wśród współpracowników, dzieląc się doświadczeniami.",
        "Znajdź czas na aktywność fizyczną, aby utrzymać dobre samopoczucie psychiczne i fizyczne."
      ]
    },
    "fizjoterapeuta": {
      "powody_wypalenia": [
        "Fizyczne zmęczenie wynikające z pracy z pacjentami.",
        "Wysokie oczekiwania pacjentów dotyczące efektów terapii.",
        "Brak natychmiastowych rezultatów pracy może prowadzić do frustracji.",
        "Praca często niedoceniana finansowo w porównaniu do wysiłku.",
        "Długie godziny w jednej pozycji mogą prowadzić do własnych problemów zdrowotnych.",
        "Brak motywacji pacjentów do stosowania zaleceń terapeutycznych."
      ],
      "porady": [
        "Dbaj o ergonomię własnej pracy i unikaj przeciążeń mięśniowych.",
        "Regularne ćwiczenia i dbanie o kondycję fizyczną zapobiegają urazom.",
        "Ustal realistyczne oczekiwania wobec pacjentów i jasno komunikuj proces terapii.",
        "Znajdź czas na odpoczynek i regenerację organizmu.",
        "Organizuj czas pracy, aby unikać przeciążenia jednym typem pacjentów.",
        "Korzystaj z grup wsparcia zawodowego lub uczestnictwa w szkoleniach."
      ]
    },
    "psycholog": {
      "powody_wypalenia": [
        "Stała konieczność słuchania problemów pacjentów prowadzi do obciążenia emocjonalnego.",
        "Brak możliwości natychmiastowego rozwiązania problemów pacjentów może być frustrujący.",
        "Wysoka liczba pacjentów i presja na osiąganie wyników mogą powodować stres.",
        "Konfrontowanie się z trudnymi historiami życiowymi pacjentów może wpływać na psychikę.",
        "Brak wyraźnych granic między pracą a życiem osobistym prowadzi do przeciążenia.",
        "Konieczność stałego dokształcania się i śledzenia nowych metod terapeutycznych."
      ],
      "porady": [
        "Korzystaj z superwizji i regularnych konsultacji z innymi specjalistami.",
        "Dbaj o własne zdrowie psychiczne poprzez równoważenie pracy i odpoczynku.",
        "Stosuj techniki relaksacyjne, aby rozładować stres po trudnych sesjach.",
        "Unikaj brania na siebie zbyt dużej liczby pacjentów w krótkim czasie.",
        "Ogranicz kontakt z pacjentami poza godzinami pracy, aby zachować zdrowe granice.",
        "Znajdź czas na rozwój osobisty i pasje niezwiązane z psychologią."
      ]
    },
    "farmaceuta": {
      "powody_wypalenia": [
        "Ciągła presja związana z odpowiedzialnością za prawidłowe wydawanie leków.",
        "Monotonia pracy w aptece może prowadzić do spadku motywacji.",
        "Kontakt z trudnymi klientami i presja sprzedaży leków bez recepty.",
        "Niskie wynagrodzenie w porównaniu do poziomu wymaganej wiedzy.",
        "Praca na stojąco przez długie godziny powoduje obciążenie fizyczne.",
        "Brak możliwości rozwoju zawodowego w niektórych miejscach pracy."
      ],
      "porady": [
        "Dbaj o ergonomię pracy, stosując odpowiednie obuwie i techniki odciążające stawy.",
        "Znajdź sposoby na urozmaicenie codziennej rutyny, np. rozwijając wiedzę o nowych lekach.",
        "Buduj dobre relacje z zespołem, aby zredukować napięcie w pracy.",
        "Korzystaj z przerw na odpoczynek i regenerację w trakcie dnia.",
        "Rozważ możliwość pracy w innym sektorze farmaceutycznym, np. w badaniach klinicznych.",
        "Uczestnicz w szkoleniach i konferencjach, aby poszerzać swoje kompetencje."
      ]
    },
    "dentysta": {
      "powody_wypalenia": [
        "Długotrwała praca w niewygodnej pozycji prowadzi do problemów zdrowotnych.",
        "Wysokie oczekiwania pacjentów i stres związany z precyzyjnymi zabiegami.",
        "Ciągłe zarządzanie gabinetem, personelem i finansami może być obciążające.",
        "Wysokie ryzyko infekcji i konieczność zachowania rygorystycznych standardów higieny.",
        "Monotonia związana z powtarzalnymi procedurami stomatologicznymi.",
        "Rosnąca konkurencja na rynku wymusza ciągłe inwestowanie w sprzęt i technologie."
      ],
      "porady": [
        "Zadbaj o ergonomię pracy i regularne przerwy na rozciąganie kręgosłupa.",
        "Buduj dobre relacje z pacjentami, aby zmniejszyć ich stres i poprawić atmosferę.",
        "Stosuj strategie zarządzania czasem, aby unikać przeładowanego grafiku.",
        "Inwestuj w nowoczesne technologie, które ułatwiają pracę i redukują obciążenie.",
        "Znajdź czas na hobby i aktywność fizyczną, aby zachować zdrową równowagę.",
        "Rozważ delegowanie obowiązków administracyjnych, aby skupić się na leczeniu."
      ]
    },
    "nauczyciel": {
    "powody_wypalenia": [
      "Wysoka odpowiedzialność za edukację i rozwój uczniów.",
      "Ciągła konieczność dostosowywania się do zmian w systemie edukacji.",
      "Brak wystarczających środków dydaktycznych i wsparcia administracyjnego.",
      "Przeciążenie pracą biurokratyczną, testami i ocenianiem.",
      "Problemy z dyscypliną w klasie i trudne interakcje z uczniami.",
      "Niskie wynagrodzenie w stosunku do ilości obowiązków."
    ],
    "porady": [
      "Stosuj metody aktywnego nauczania, aby urozmaicić lekcje i podnieść motywację uczniów.",
      "Ustal realistyczne granice między pracą a życiem osobistym.",
      "Dbaj o przerwy i czas na regenerację po trudnych dniach.",
      "Znajdź grupy wsparcia dla nauczycieli, aby dzielić się doświadczeniami.",
      "Inwestuj w rozwój zawodowy, uczestnicząc w kursach i warsztatach.",
      "Pamiętaj, że nie masz pełnej kontroli nad postępami uczniów – ucz się odpuszczać."
    ]
    },
    "wykładowca": {
    "powody_wypalenia": [
      "Presja na publikowanie artykułów naukowych i zdobywanie grantów.",
      "Duża ilość obowiązków administracyjnych i dydaktycznych.",
      "Brak stabilności zatrudnienia na początku kariery akademickiej.",
      "Ograniczone możliwości rozwoju zawodowego na uczelniach publicznych.",
      "Trudności w motywowaniu studentów do aktywnego uczestnictwa w zajęciach.",
      "Konieczność dostosowywania się do zmian w programach nauczania."
    ],
    "porady": [
      "Ustal realistyczne cele publikacyjne i nie bierz na siebie zbyt wielu zobowiązań.",
      "Stosuj techniki zarządzania czasem, aby uniknąć przeciążenia obowiązkami.",
      "Znajdź wsparcie wśród innych wykładowców i dziel się doświadczeniami.",
      "Regularnie odpoczywaj i dbaj o równowagę między pracą a życiem prywatnym.",
      "Poszukaj dodatkowych źródeł finansowania, np. współpracy z sektorem prywatnym.",
      "Angażuj studentów w projekty badawcze, aby zwiększyć ich zainteresowanie nauką."
    ]
  },
  "przedszkolanka": {
    "powody_wypalenia": [
      "Wysoka odpowiedzialność za bezpieczeństwo małych dzieci.",
      "Praca w głośnym i dynamicznym środowisku powoduje zmęczenie.",
      "Częsty kontakt z wymagającymi rodzicami.",
      "Niskie wynagrodzenie w stosunku do wysiłku i odpowiedzialności.",
      "Monotonia powtarzających się zajęć dydaktycznych.",
      "Brak wystarczających zasobów edukacyjnych i wsparcia w placówkach."
    ],
    "porady": [
      "Znajdź sposoby na urozmaicanie zajęć, aby uniknąć rutyny.",
      "Dbaj o przerwy i regenerację, aby uniknąć zmęczenia psychicznego.",
      "Buduj dobre relacje z rodzicami, aby zmniejszyć napięcia.",
      "Rozwijaj swoje umiejętności poprzez kursy pedagogiczne i szkolenia.",
      "Stosuj techniki zarządzania stresem, np. techniki oddechowe.",
      "Dbaj o aktywność fizyczną, aby poprawić kondycję po długim dniu pracy."
    ]
  },
  "doradca": {
    "powody_wypalenia": [
      "Praca z uczniami o różnych problemach edukacyjnych i emocjonalnych.",
      "Niedocenianie roli doradcy w systemie edukacji.",
      "Brak wystarczających narzędzi i zasobów do wsparcia uczniów.",
      "Kontakt z trudnymi przypadkami, np. przemocą domową i depresją uczniów.",
      "Duża ilość dokumentacji i raportowania do administracji szkolnej.",
      "Ograniczone możliwości awansu zawodowego."
    ],
    "porady": [
      "Dbaj o swoje zdrowie psychiczne poprzez superwizję i wsparcie specjalistów.",
      "Wyznaczaj granice zawodowe, aby nie angażować się emocjonalnie w każdy przypadek.",
      "Znajdź metody na organizację pracy, aby ograniczyć biurokrację.",
      "Angażuj się w szkolenia, aby rozwijać swoje kompetencje zawodowe.",
      "Rozwijaj umiejętności komunikacyjne, aby skuteczniej rozmawiać z uczniami.",
      "Dbaj o balans między życiem zawodowym a prywatnym."
    ]
  },
  "programista": {
    "powody_wypalenia": [
      "Długie godziny pracy przy komputerze bez odpowiednich przerw.",
      "Presja na szybkie dostarczanie kodu i częste zmiany wymagań projektowych.",
      "Niezrozumienie ze strony klientów i menedżerów dotyczące złożoności pracy.",
      "Brak bezpośredniego wpływu na decyzje produktowe, co prowadzi do frustracji.",
      "Izolacja społeczna, zwłaszcza w pracy zdalnej.",
      "Ciągła konieczność uczenia się nowych technologii i narzędzi."
    ],
    "porady": [
      "Dbaj o ergonomię pracy i regularne przerwy od ekranu.",
      "Ustal realistyczne terminy projektowe i komunikuj je zespołowi.",
      "Stosuj metodologie Agile, aby lepiej zarządzać zadaniami.",
      "Regularnie angażuj się w rozmowy z zespołem, aby uniknąć izolacji.",
      "Inwestuj w rozwój umiejętności miękkich, które poprawią współpracę z innymi działami.",
      "Znajdź czas na hobby niezwiązane z technologią, aby zminimalizować przeciążenie umysłowe."
    ]
  },
  "tester": {
    "powody_wypalenia": [
      "Monotonia powtarzających się testów i skryptów.",
      "Presja na szybkie znalezienie błędów w oprogramowaniu.",
      "Brak docenienia pracy przez inne zespoły IT.",
      "Konieczność ciągłego dostosowywania się do nowych technologii testowania.",
      "Praca pod presją terminów i wydawania wersji produktu.",
      "Ograniczona kreatywność w porównaniu do innych ról w IT."
    ],
    "porady": [
      "Automatyzuj testy, aby ograniczyć monotonię pracy.",
      "Komunikuj się z zespołem deweloperskim, aby lepiej zrozumieć aplikację.",
      "Znajdź sposoby na rozwój, np. certyfikaty ISTQB lub inne kursy.",
      "Pracuj nad umiejętnościami analitycznymi, aby szybciej znajdować błędy.",
      "Dbaj o ergonomię pracy i przerwy na odpoczynek.",
      "Wprowadzaj elementy kreatywności, np. eksploracyjne testowanie nowych funkcji."
    ]
  },
  "admin": {
    "powody_wypalenia": [
      "Ciągła presja związana z utrzymywaniem systemów w działaniu.",
      "Praca w trybie 24/7, często z nagłymi wezwaniami do awarii.",
      "Brak docenienia roli administratora w organizacji.",
      "Skomplikowane systemy wymagające nieustannej aktualizacji wiedzy.",
      "Niskie budżety na infrastrukturę IT powodujące ograniczenia w pracy.",
      "Częste sytuacje stresowe związane z cyberbezpieczeństwem i awariami."
    ],
    "porady": [
      "Automatyzuj powtarzalne zadania, aby zmniejszyć obciążenie.",
      "Stosuj rotacyjne dyżury, aby uniknąć nadmiernego przeciążenia.",
      "Zadbaj o rozwój w zakresie cyberbezpieczeństwa, aby zwiększyć swoją wartość na rynku.",
      "Komunikuj swoje potrzeby w firmie, aby poprawić budżet i narzędzia do pracy.",
      "Dbaj o równowagę między pracą a odpoczynkiem.",
      "Znajdź czas na rozwijanie pasji poza pracą, aby unikać wypalenia zawodowego."
    ]
  },
  "data_scientist": {
    "powody_wypalenia": [
      "Praca z dużą ilością danych, która wymaga precyzji i cierpliwości.",
      "Presja na dostarczanie wartościowych analiz biznesowych.",
      "Ciągła nauka nowych narzędzi i języków programowania.",
      "Frustracja związana z błędnymi danymi lub niekompletnymi zbiorami.",
      "Oczekiwanie natychmiastowych wyników od zespołu zarządzającego.",
      "Izolacja społeczna w pracy z danymi zamiast z ludźmi."
    ],
    "porady": [
      "Planuj czas na naukę i rozwój, aby uniknąć przytłoczenia nowymi technologiami.",
      "Automatyzuj procesy analityczne, aby zwiększyć efektywność.",
      "Buduj sieć kontaktów w branży, aby wymieniać się doświadczeniami.",
      "Stosuj metody zarządzania danymi, aby unikać chaosu w projektach.",
      "Pracuj w zespołach interdyscyplinarnych, aby zwiększyć interakcję społeczną.",
      "Znajdź czas na odpoczynek i aktywność fizyczną, aby odciążyć umysł."
    ]
  },
  "pracownik_korporacji": {
    "powody_wypalenia": [
      "Wysoka presja na osiąganie wyników i realizowanie celów sprzedażowych.",
      "Długie godziny pracy i oczekiwanie ciągłej dyspozycyjności.",
      "Monotonia i brak kreatywności w wykonywanych zadaniach.",
      "Stres związany z hierarchią i polityką korporacyjną.",
      "Niedocenianie wkładu pracownika przez przełożonych.",
      "Brak równowagi między życiem zawodowym a prywatnym."
    ],
    "porady": [
      "Ustalaj jasne granice między pracą a życiem osobistym.",
      "Dbaj o regularne przerwy i regenerację w ciągu dnia.",
      "Zadbaj o rozwój kompetencji, aby zwiększyć satysfakcję z pracy.",
      "Znajdź czas na aktywność fizyczną, aby zmniejszyć poziom stresu.",
      "Unikaj angażowania się w korporacyjne konflikty i plotki.",
      "Zastanów się nad zmianą stanowiska lub firmy, jeśli praca przestaje sprawiać satysfakcję."
    ]
  },
  "menedżer": {
    "powody_wypalenia": [
      "Wysoka odpowiedzialność za wyniki zespołu i realizację celów biznesowych.",
      "Ciągła presja na podejmowanie trudnych decyzji.",
      "Brak wsparcia ze strony zarządu i przełożonych.",
      "Problemy z motywowaniem i zarządzaniem zespołem.",
      "Nadmiar obowiązków administracyjnych i operacyjnych.",
      "Brak czasu na odpoczynek i regenerację."
    ],
    "porady": [
      "Deleguj zadania i nie bierz na siebie wszystkiego.",
      "Dbaj o transparentną komunikację i budowanie relacji w zespole.",
      "Stosuj techniki zarządzania stresem i regularnie odpoczywaj.",
      "Korzystaj z mentoringu i szkoleń menedżerskich.",
      "Zadbaj o zdrowe nawyki, takie jak aktywność fizyczna i zdrowa dieta.",
      "Unikaj pracy po godzinach, jeśli nie jest to absolutnie konieczne."
    ]
  },
  "sekretarka": {
    "powody_wypalenia": [
      "Praca pod presją czasu i ciągłe oczekiwanie dostępności.",
      "Wykonywanie wielu zadań jednocześnie bez możliwości odpoczynku.",
      "Brak uznania za wykonywaną pracę.",
      "Powtarzalność obowiązków prowadząca do monotonii.",
      "Częsty kontakt z trudnymi klientami i przełożonymi.",
      "Presja na perfekcyjne wykonywanie zadań administracyjnych."
    ],
    "porady": [
      "Organizuj swój czas pracy i priorytetyzuj zadania.",
      "Stosuj techniki zarządzania stresem, np. głębokie oddychanie.",
      "Dbaj o ergonomię pracy przy biurku i regularne przerwy.",
      "Buduj relacje ze współpracownikami, aby mieć wsparcie w trudnych sytuacjach.",
      "Korzystaj z kursów i szkoleń, aby rozwijać swoje umiejętności zawodowe.",
      "Nie bierz na siebie nadmiernej ilości obowiązków – ustalaj granice."
    ]
  },
  "hr": {
    "powody_wypalenia": [
      "Konflikty między pracownikami i konieczność ich rozwiązywania.",
      "Presja na rekrutowanie odpowiednich kandydatów.",
      "Obciążenie administracyjne i formalności związane z zatrudnianiem.",
      "Oczekiwania zarządu dotyczące szybkich wyników HR.",
      "Trudności w budowaniu pozytywnej kultury organizacyjnej.",
      "Wypalenie wynikające z pracy z ludźmi i ich problemami."
    ],
    "porady": [
      "Stosuj zdrowe granice i nie angażuj się emocjonalnie w konflikty.",
      "Organizuj swoją pracę, aby nie przeciążać się zadaniami administracyjnymi.",
      "Regularnie uczestnicz w szkoleniach i konferencjach HR.",
      "Dbaj o odpoczynek i równowagę między życiem zawodowym a prywatnym.",
      "Buduj sieć wsparcia wśród innych specjalistów HR.",
      "Stosuj nowoczesne narzędzia do automatyzacji procesów rekrutacyjnych."
    ]
  },
  "księgowy": {
    "powody_wypalenia": [
      "Monotonia pracy z liczbami i dokumentami.",
      "Presja na terminowe rozliczenia i dokładność w obliczeniach.",
      "Duża ilość formalności i zmieniające się przepisy podatkowe.",
      "Praca pod presją klientów i przełożonych.",
      "Długie godziny pracy w okresach rozliczeniowych.",
      "Mała interakcja z ludźmi w porównaniu do innych zawodów."
    ],
    "porady": [
      "Planuj pracę z wyprzedzeniem, aby uniknąć stresujących sytuacji.",
      "Dbaj o krótkie przerwy w pracy, aby nie przeciążać umysłu.",
      "Znajdź sposoby na rozwój zawodowy, np. kursy rachunkowości.",
      "Stosuj narzędzia automatyzacji, aby zmniejszyć ilość ręcznej pracy.",
      "Zadbaj o zdrowie psychiczne i unikaj nadgodzin.",
      "Angażuj się w aktywności społeczne, aby przełamać monotonię."
    ]
  },
  "analityk": {
    "powody_wypalenia": [
      "Ciągła praca z danymi, co może prowadzić do izolacji społecznej.",
      "Presja na dostarczanie dokładnych analiz w krótkim czasie.",
      "Zmieniające się wymagania biznesowe i konieczność dostosowywania analiz.",
      "Wysoka odpowiedzialność za podejmowanie decyzji opartych na danych.",
      "Długie godziny pracy i konieczność analizowania dużej ilości informacji.",
      "Frustracja wynikająca z niekompletnych lub błędnych danych."
    ],
    "porady": [
      "Regularnie rób przerwy i ćwicz oczy, aby unikać zmęczenia.",
      "Korzystaj z narzędzi analitycznych, które ułatwią Twoją pracę.",
      "Buduj relacje z innymi działami firmy, aby lepiej rozumieć ich potrzeby.",
      "Dbaj o work-life balance i unikaj pracy po godzinach.",
      "Znajdź sposoby na kreatywne podejście do analizy danych.",
      "Angażuj się w projekty interdyscyplinarne, aby poszerzyć horyzonty."
    ]
  },
  "prawnik": {
    "powody_wypalenia": [
      "Długie godziny pracy i napięte terminy składania dokumentów.",
      "Presja ze strony klientów oraz konieczność wygrywania spraw.",
      "Skomplikowane i zmieniające się przepisy prawne wymagające ciągłego dokształcania się.",
      "Praca w stresujących warunkach, zwłaszcza w sprawach karnych i biznesowych.",
      "Konflikty etyczne związane z obroną klientów lub decyzjami korporacyjnymi.",
      "Wysoka odpowiedzialność za konsekwencje błędnych interpretacji prawa."
    ],
    "porady": [
      "Planuj swoją pracę i priorytetyzuj zadania, aby uniknąć przeciążenia.",
      "Korzystaj z nowoczesnych narzędzi do zarządzania dokumentami i sprawami prawnymi.",
      "Ustal granice między pracą a życiem prywatnym, unikając nadmiernych nadgodzin.",
      "Dbaj o zdrowie psychiczne, korzystając ze wsparcia mentorów i kolegów po fachu.",
      "Regularnie uprawiaj sport i techniki relaksacyjne, aby redukować stres.",
      "Znajdź czas na rozwój osobisty i odpoczynek poza kancelarią."
    ]
  },
  "sędzia": {
    "powody_wypalenia": [
      "Stała presja podejmowania sprawiedliwych i obiektywnych decyzji.",
      "Duża liczba spraw do rozpatrzenia i napięte terminy.",
      "Konfrontacja z trudnymi sprawami, w tym dotyczącymi przestępstw i tragedii rodzinnych.",
      "Izolacja społeczna wynikająca z konieczności zachowania obiektywizmu.",
      "Stres wynikający z możliwości podważenia wydanych wyroków.",
      "Ograniczone możliwości odpoczynku, zwłaszcza w przypadku nagłych spraw."
    ],
    "porady": [
      "Znajdź sposoby na radzenie sobie ze stresem, np. poprzez medytację lub aktywność fizyczną.",
      "Unikaj przeciążenia pracą poprzez efektywne zarządzanie sprawami.",
      "Buduj sieć wsparcia wśród innych sędziów i prawników.",
      "Pamiętaj o równowadze między życiem zawodowym a prywatnym.",
      "Korzystaj z urlopu i odpoczynku, aby uniknąć psychicznego zmęczenia.",
      "Dbaj o zdrowie emocjonalne, konsultując się ze specjalistami w razie potrzeby."
    ]
  },
  "prokurator": {
    "powody_wypalenia": [
      "Wysoka presja związana z prowadzeniem postępowań karnych.",
      "Konfrontacja z przestępcami i ofiarami, co może prowadzić do obciążenia psychicznego.",
      "Długie godziny pracy i presja na szybkie rozwiązywanie spraw.",
      "Konieczność zachowania obiektywizmu, nawet w trudnych moralnie przypadkach.",
      "Ryzyko zawodowe związane z prowadzeniem spraw o dużej skali.",
      "Częsty kontakt z mediami i opinią publiczną, co może prowadzić do dodatkowego stresu."
    ],
    "porady": [
      "Regularnie korzystaj ze wsparcia psychologicznego, jeśli czujesz nadmierne obciążenie.",
      "Ustal jasne granice między życiem prywatnym a zawodowym.",
      "Znajdź czas na regenerację i aktywność fizyczną.",
      "Korzystaj z technik zarządzania stresem, aby zachować równowagę emocjonalną.",
      "Dbaj o wsparcie wśród kolegów po fachu, aby nie czuć się osamotnionym w decyzjach.",
      "Rozwijaj umiejętności negocjacyjne i komunikacyjne, aby skuteczniej prowadzić sprawy."
    ]
  },
  "notariusz": {
    "powody_wypalenia": [
      "Monotonia pracy polegającej na weryfikacji i przygotowywaniu dokumentów.",
      "Presja na zachowanie absolutnej dokładności w dokumentacji.",
      "Kontakt z klientami o różnych wymaganiach i oczekiwaniach.",
      "Małe możliwości awansu i ograniczona elastyczność pracy.",
      "Konieczność śledzenia zmian w przepisach prawnych.",
      "Wysoka odpowiedzialność za prawidłowość podpisywanych aktów."
    ],
    "porady": [
      "Organizuj swoją pracę w sposób systematyczny, aby uniknąć przeciążenia.",
      "Znajdź sposoby na urozmaicenie codziennych obowiązków.",
      "Dbaj o przerwy i odpoczynek w trakcie dnia pracy.",
      "Utrzymuj dobre relacje z klientami, aby poprawić atmosferę pracy.",
      "Rozwijaj kompetencje poprzez kursy specjalistyczne i szkolenia.",
      "Wykorzystuj nowoczesne technologie do automatyzacji powtarzalnych czynności."
    ]
  },
  "radca_prawny": {
    "powody_wypalenia": [
      "Wysoka odpowiedzialność za skuteczność porad prawnych.",
      "Duża liczba klientów i napięte terminy.",
      "Konieczność rozwiązywania konfliktów i negocjowania trudnych spraw.",
      "Presja na osiąganie dobrych wyników finansowych dla kancelarii.",
      "Zmieniające się przepisy prawne wymagające ciągłej nauki.",
      "Częsta praca poza standardowymi godzinami."
    ],
    "porady": [
      "Stosuj techniki zarządzania czasem, aby efektywnie obsługiwać klientów.",
      "Nie bierz na siebie zbyt dużej liczby spraw jednocześnie.",
      "Zadbaj o równowagę między pracą a odpoczynkiem.",
      "Korzystaj z narzędzi do organizacji dokumentów i spraw prawnych.",
      "Rozwijaj umiejętności interpersonalne, aby skuteczniej pracować z klientami.",
      "Znajdź czas na odpoczynek i aktywność fizyczną, aby unikać przeciążenia."
    ]
  },
  "adwokat": {
    "powody_wypalenia": [
      "Stała presja na skuteczne reprezentowanie klientów w sądzie.",
      "Długie godziny pracy i konieczność przygotowywania dokumentacji prawnej.",
      "Konflikty etyczne w niektórych sprawach obrony klientów.",
      "Presja ze strony klientów, którzy oczekują szybkich i skutecznych rozwiązań.",
      "Obciążenie psychiczne związane z trudnymi sprawami sądowymi.",
      "Napięcie wynikające z niepewności wyniku sprawy."
    ],
    "porady": [
      "Zarządzaj swoją pracą, aby unikać przeciążenia obowiązkami.",
      "Dbaj o regularne przerwy i relaks po intensywnych rozprawach.",
      "Nie angażuj się emocjonalnie w każdą sprawę, aby chronić swoją psychikę.",
      "Korzystaj z mentoringu i wsparcia innych adwokatów.",
      "Uprawiaj sport i rozwijaj hobby, aby odciążyć umysł.",
      "Ustal granice czasowe dla klientów, aby nie pracować po godzinach."
    ]
  },
  "marynarz": {
    "powody_wypalenia": [
      "Długie okresy rozłąki z rodziną i izolacja społeczna.",
      "Praca w trudnych warunkach pogodowych na morzu.",
      "Brak regularnego harmonogramu snu i zmiany stref czasowych.",
      "Wysokie ryzyko zawodowe związane z awariami i wypadkami.",
      "Monotonia wynikająca z długich rejsów i ograniczonej przestrzeni.",
      "Presja na utrzymanie sprawności fizycznej i psychicznej."
    ],
    "porady": [
      "Utrzymuj regularny kontakt z rodziną poprzez internet i rozmowy telefoniczne.",
      "Dbaj o kondycję fizyczną poprzez regularne ćwiczenia na statku.",
      "Angażuj się w aktywności rekreacyjne, takie jak czytanie, gry planszowe czy nauka języków.",
      "Zadbaj o zdrową dietę i higienę snu, nawet w nieregularnym trybie pracy.",
      "Buduj dobre relacje z załogą, aby ograniczyć poczucie izolacji.",
      "Planuj przyszłość i rozwój kariery, aby mieć perspektywy po zakończeniu pracy na morzu."
    ]
  },
  "kapitan": {
    "powody_wypalenia": [
      "Ogromna odpowiedzialność za bezpieczeństwo załogi i ładunku.",
      "Presja związana z przestrzeganiem międzynarodowych przepisów żeglugowych.",
      "Konflikty wśród załogi, wymagające umiejętnego zarządzania ludźmi.",
      "Długie godziny pracy i brak regularnych przerw.",
      "Izolacja od rodziny i życie w zamkniętym środowisku przez długi czas.",
      "Konieczność podejmowania szybkich i często trudnych decyzji w sytuacjach awaryjnych."
    ],
    "porady": [
      "Pracuj nad rozwojem umiejętności zarządzania stresem i kryzysowego myślenia.",
      "Dziel obowiązki wśród oficerów, aby nie brać na siebie zbyt wiele.",
      "Buduj pozytywną atmosferę na pokładzie, aby zmniejszyć napięcia wśród załogi.",
      "Znajdź czas na relaks i aktywności poza obowiązkami kapitańskimi.",
      "Dbaj o zdrowie psychiczne poprzez rozmowy z bliskimi i aktywność fizyczną.",
      "Korzystaj z szkoleń i programów wsparcia dla kapitanów, aby rozwijać kompetencje przywódcze."
    ]
  },
  "mechanik_morski": {
    "powody_wypalenia": [
      "Praca w hałasie i trudnych warunkach środowiskowych.",
      "Duża odpowiedzialność za sprawność techniczną statku.",
      "Ciągłe narażenie na smary, oleje i toksyczne substancje.",
      "Brak dostępu do świeżego powietrza i naturalnego światła w trakcie pracy.",
      "Długie godziny napraw i konserwacji bez możliwości odpoczynku.",
      "Presja na szybkie rozwiązywanie usterek w sytuacjach awaryjnych."
    ],
    "porady": [
      "Dbaj o ochronę zdrowia poprzez stosowanie środków BHP.",
      "Planuj regularne przerwy, aby uniknąć przeciążenia fizycznego.",
      "Korzystaj z narzędzi ergonomicznych, aby zmniejszyć ryzyko kontuzji.",
      "Znajdź czas na regenerację i odpoczynek po intensywnych dniach pracy.",
      "Rozwijaj swoje umiejętności techniczne, aby ułatwić sobie przyszłą karierę.",
      "Zachowuj równowagę psychiczną, angażując się w aktywności niezwiązane z pracą."
    ]
  },
  "elektronik_morski": {
    "powody_wypalenia": [
      "Wysoka odpowiedzialność za systemy komunikacyjne i nawigacyjne statku.",
      "Presja na szybkie naprawy w razie awarii urządzeń.",
      "Długie godziny pracy w warunkach izolacji od świata zewnętrznego.",
      "Kontakt z promieniowaniem elektromagnetycznym i innymi zagrożeniami technicznymi.",
      "Brak regularnego dostępu do lekarza i opieki zdrowotnej na morzu.",
      "Ograniczone możliwości relaksu i interakcji społecznych."
    ],
    "porady": [
      "Zadbaj o regularny odpoczynek, aby unikać zmęczenia psychicznego.",
      "Utrzymuj dobre relacje z załogą, aby nie czuć się odizolowanym.",
      "Korzystaj z dostępnych materiałów edukacyjnych, aby rozwijać swoje kompetencje.",
      "Planuj pracę tak, aby unikać nadmiernego obciążenia w krótkim czasie.",
      "Dbaj o zdrową dietę i regularne ćwiczenia, aby zachować sprawność.",
      "Znajdź pasje i zajęcia, które pomogą Ci utrzymać równowagę psychiczną w pracy."
    ]
  },
  "oficer_pokładowy": {
    "powody_wypalenia": [
      "Ciągłe zmiany harmonogramu pracy, w tym nocne wachty.",
      "Presja związana z odpowiedzialnością za bezpieczeństwo statku.",
      "Długie okresy z dala od rodziny i bliskich.",
      "Narażenie na ekstremalne warunki pogodowe na morzu.",
      "Konflikty z załogą i konieczność egzekwowania dyscypliny.",
      "Napięcie związane z przestrzeganiem rygorystycznych przepisów żeglugowych."
    ],
    "porady": [
      "Dbaj o właściwe zarządzanie czasem i odpowiednią ilość odpoczynku.",
      "Angażuj się w rozwój zawodowy, aby zwiększać swoje kwalifikacje.",
      "Buduj pozytywne relacje z załogą, aby ułatwić współpracę.",
      "Korzystaj z dostępnych zasobów psychologicznych dla marynarzy.",
      "Utrzymuj zdrowy styl życia, aby zapobiegać skutkom stresu i zmęczenia.",
      "Ustal cele kariery, aby mieć motywację do dalszego rozwoju."
    ]
  },
  "budowlaniec": {
    "powody_wypalenia": [
      "Praca w trudnych warunkach atmosferycznych.",
      "Wysokie ryzyko urazów i kontuzji.",
      "Fizyczne wyczerpanie spowodowane ciężką pracą.",
      "Niestabilność zatrudnienia i okresowe przestoje w branży.",
      "Presja na szybkie tempo pracy i dotrzymywanie terminów.",
      "Brak odpowiedniego sprzętu i środków ochrony w niektórych miejscach pracy."
    ],
    "porady": [
      "Dbaj o regularne przerwy i nawodnienie organizmu.",
      "Korzystaj z odpowiednich środków ochrony osobistej, aby unikać urazów.",
      "Regularnie wzmacniaj swoje mięśnie poprzez ćwiczenia rozciągające i siłowe.",
      "Planuj finanse, aby przygotować się na okresy bez pracy.",
      "Rozwijaj swoje umiejętności, aby zwiększyć swoje szanse na lepiej płatne projekty.",
      "Znajdź czas na odpoczynek i relaks, aby unikać chronicznego zmęczenia."
    ]
  },
  "inne": {
    "powody_wypalenia": [
      "Monotonia pracy i brak możliwości rozwoju.",
      "Niejasne wymagania i brak precyzyjnych celów zawodowych.",
      "Brak balansu między życiem zawodowym a prywatnym.",
      "Nieodpowiednie warunki pracy, w tym stresujące środowisko.",
      "Brak uznania i docenienia ze strony przełożonych.",
      "Niska satysfakcja z wykonywanych obowiązków."
    ],
    "porady": [
      "Zidentyfikuj, co dokładnie powoduje Twoje wypalenie i poszukaj rozwiązań.",
      "Zadbaj o czas dla siebie, rozwijając pasje i aktywności poza pracą.",
      "Znajdź wsparcie wśród współpracowników lub specjalistów ds. kariery.",
      "Rozważ zmianę miejsca pracy lub rozwój umiejętności w nowym kierunku.",
      "Stosuj techniki zarządzania stresem, takie jak medytacja czy sport.",
      "Pamiętaj, że praca to tylko część życia – dbaj o równowagę i dobre samopoczucie."
    ]
  }
};
const jobNames = {
  lekarz: "Lekarz",
  pielęgniarka: "Pielęgniarka",
  ratownik: "Ratownik medyczny",
  fizjoterapeuta: "Fizjoterapeuta",
  psycholog: "Psycholog",
  farmaceuta: "Farmaceuta",
  dentysta: "Dentysta",
  nauczyciel: "Nauczyciel",
  wykładowca: "Wykładowca akademicki",
  przedszkolanka: "Nauczyciel przedszkolny",
  doradca: "Pedagog szkolny/Doradca",
  programista: "Programista",
  tester: "Tester oprogramowania",
  admin: "Administrator systemów",
  data_scientist: "Data Scientist",
  pracownik_korporacji: "Pracownik korporacji",
  menedżer: "Menedżer",
  sekretarka: "Sekretarka",
  hr: "Specjalista HR",
  księgowy: "Księgowy",
  analityk: "Analityk danych",
  prawnik: "Prawnik",
  sędzia: "Sędzia",
  prokurator: "Prokurator",
  notariusz: "Notariusz",
  radca_prawny: "Radca prawny",
  adwokat: "Adwokat",
  marynarz: "Marynarz",
  kapitan: "Kapitan statku",
  mechanik_morski: "Mechanik morski",
  elektronik_morski: "Elektronik morski",
  oficer_pokładowy: "Oficer pokładowy",
  budowlaniec: "Pracownik budowlany",
  inne: "Inny zawód"
};


function Results() {
  const location = useLocation();
  const formData = location.state || {};
  const answers = formData.answers || {};

  // Obliczanie wyników
  const exhaustionScore = [0,1,2,3,4,5].reduce((acc, i) => acc + (answers[i] || 0), 0);
  const cynicismScore = [6,7,8,9,10].reduce((acc, i) => acc + (answers[i] || 0), 0);
  const inefficacyScore = [11,12,13,14,15].reduce((acc, i) => acc + (answers[i] || 0), 0);
  const totalScore = exhaustionScore + cynicismScore + inefficacyScore;
  const maxScore = 4 * Object.keys(answers).length;
  const percentage = ((totalScore / maxScore) * 100).toFixed(1);

  let resultText = "";
  let extraMessage = "";
  if (percentage < 30) {
    resultText = "✅ Niski poziom wypalenia zawodowego.";
    extraMessage = "Utrzymuj zdrowe nawyki i dbaj o profilaktykę!";
  } else if (percentage < 60) {
    resultText = "⚠️ Umiarkowane oznaki wypalenia.";
    extraMessage = "Warto pomyśleć o regeneracji i zmianie niektórych nawyków.";
  } else {
    resultText = "🚨 Wysoki poziom wypalenia!";
    extraMessage = "Czas na zdecydowane kroki – zdrowie jest najważniejsze!";
  }

  // Analiza + porady
  const resultAnalysis = getResultAnalysis(totalScore);
  const job = formData.job || "inne";
  const jobFullName = jobNames[job] || "Inny zawód";
  const jobDetails = jobAdvice[job] || jobAdvice["inne"];

  // Dane do wykresu
  const chartData = {
    labels: ["Zmęczenie", "Cynizm", "Brak efektywności"],
    datasets: [
      {
        label: "Twój wynik",
        data: [exhaustionScore, cynicismScore, inefficacyScore],
        backgroundColor: ["#ff5e57", "#3498db", "#9b59b6"],
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    animation: { duration: 1500, easing: "easeInOutQuad" },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Twój poziom wypalenia zawodowego" }
    },
  };

  const backgroundColor = getResultColor(totalScore, maxScore);

  // Zapis do Firestore
  useEffect(() => {
    const saveResultToFirestore = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("Brak zalogowanego użytkownika – nie zapisuję wyniku");
          return;
        }

        // Możesz dodać logiczne zabezpieczenie, by nie zapisywać wielokrotnie w tej samej sesji
        // localStorage.removeItem("savedResult"); // lub set
        // if (localStorage.getItem("savedResult") === "true") return;

        const resultData = {
          userId: user.uid,
          email: user.email,
          name: formData.name || "",
          age: parseInt(formData.age || 0, 10),
          occupation: formData.job || "",
          workHours: parseInt(formData.workHours || 0, 10),
          answers,
          exhaustionScore,
          cynicismScore,
          inefficacyScore,
          totalScore,
          createdAt: Timestamp.now()
        };

        await addDoc(collection(db, "results"), resultData);
        console.log("Wynik zapisany w Firestore:", resultData);

        // localStorage.setItem("savedResult", "true");
      } catch (err) {
        console.error("Błąd zapisu do Firestore:", err);
      }
    };

    saveResultToFirestore();
  }, [answers, cynicismScore, exhaustionScore, formData, inefficacyScore, totalScore]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: "100vh",
        background: "url('/images/burnout-bg.png') no-repeat center center fixed",
        backgroundSize: "cover",
        backgroundColor,
        padding: 0,
        transition: "background-color 0.5s ease"
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
          padding: "30px"
        }}
      >
        <h1 className="fw-bold text-center">
          <FaChartBar /> Twoje wyniki
        </h1>

        <div className="chart-container my-4">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="mt-4 p-4 rounded shadow-sm" style={{ backgroundColor: "#eef5ff" }}>
          <h3 className="text-primary">
            <FaExclamationTriangle /> Co wynika z Twojego testu?
          </h3>
          <p className="lead">
            Wynik: {totalScore} / {maxScore} punktów ({percentage}%).
            <br />
            {resultText}
          </p>
          <p>{extraMessage}</p>
        </div>

        <div className="mt-4 p-4 rounded shadow-sm" style={{ backgroundColor: "#f8f9fa" }}>
          <h4 className="text-secondary">
            <FaInfoCircle /> Szczegółowa analiza wyników
          </h4>
          <div dangerouslySetInnerHTML={{ __html: resultAnalysis }} />
        </div>

        <div className="mt-4 p-4 rounded shadow-sm" style={{ backgroundColor: "#fff3cd" }}>
          <h4 className="text-warning">
            <FaInfoCircle /> Wypalenie w Twoim zawodzie: {jobFullName}
          </h4>
          <ul>
            {jobDetails.powody_wypalenia.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
          <h5>💡 Jak sobie radzić?</h5>
          <ul>
            {jobDetails.porady.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>

        <button
          className="btn btn-primary mt-4 w-100"
          onClick={() => (window.location.href = "/")}
        >
          🔄 Wróć do testu
        </button>
      </div>
    </motion.div>
  );
}

export default Results;
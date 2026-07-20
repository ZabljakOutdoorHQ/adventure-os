# Multiday — Poslovni pravilnik

> **Čemu služi.** Da zapiše kako naš Multiday posao stvarno funkcioniše — jezikom
> koji koristimo svaki dan — tako da to znanje preživi i kad Excel zamijeni Adventure
> OS (ili WeTravel). Ovo je **pravilnik za ljude u firmi**, ne tehnički model.
>
> **Princip 1 — jednostavnost ispred teorijske tačnosti** ([ADR-0004](../decisions/0004-simplicity-and-business-language.md),
> Ustav §3.15). Ako dva modela jednako dobro opisuju isti posao, biramo jednostavniji.
> Koristimo naš jezik; engleski naziv (u zagradi) stoji samo kao buduće ime u softveru.
>
> **Ovo ne mijenja §4 ni kanonski model.** Nacrt za pregled. Nije Faza 2.
>
> **Privatnost.** Bez imena klijenata/gostiju/vodiča, bez brojeva faktura i stvarnih
> stanja. Imena naših firmi (Durmitor Adventure = DA, Sampas, Other Trails = OT) i
> parametri politike (naknada po osobi, procenti podjele) su poslovna logika, ne lični
> podaci.
>
> **v3 (2026-07):** prevedeno na poslovni jezik + revizija složenosti. Ranije verzije
> (engleski, detaljnije) su u git istoriji.
>
> **Dva sloja jezika** ([ADR-0005](../decisions/0005-two-language-layers.md), Ustav
> §3.16). Ovaj dokument je **poslovni sloj** — naš jezik. Kanonski (softverski) nazivi
> žive u [`UBIQUITOUS_LANGUAGE.md`](../UBIQUITOUS_LANGUAGE.md), koji spaja svaki naš
> pojam sa nazivom u modelu/kodu. Engleski u zagradama ovdje je samo pokazivač na taj
> most.

---

## 1. Kako naš posao funkcioniše (u tri rečenice)

**Imamo prihode. Imamo troškove. Ono što ostane — dijelimo.**

Sve ostalo u ovom dokumentu samo preciznije opisuje te tri stvari. Ne uvodimo nove
slojeve ako ne rješavaju konkretan problem.

Put jedne grupe: **upit → procjena troškova → ponuda → prihvaćena ponuda + depozit →
izvođenje ture → naplata → potvrda troškova → podjela → zatvaranje.** (Nije prava
šina — ima i grananja: odbijen upit, otkazano prije/poslije depozita, djelimična
uplata, povraćaj, tura odrađena ali nije obračunata…)

---

## 2. Pojmovnik (jedan pojam — jedno značenje)

Naziv koji koristimo je masno; engleski naziv u zagradi je samo buduće ime u softveru.

### Ljudi i firme (ko je ko)

- **Osoba** (Person) — čovjek: gost, vodič, kontakt.
- **Firma** (Organisation) — pravno lice: naša firma, hotel, agencija, dobavljač.
- **Naše firme** — DA, Sampas, Other Trails.
- **Brend** (Brand) — javno ime (npr. „Durmitor Adventure" kao brend), nije isto što i firma.

### Uloge (šta neko radi u konkretnom poslu — nije novi objekat)

- **Kupac** (Customer) — svako ko kupuje. Agencija je kupac-posrednik; direktni gost je
  kupac bez posrednika. (Ne pravimo posebne pojmove „corporate/direct" — to su samo vrste kupca.)
- **Agencija** (Agency) — posrednik: tour operator / DMC.
- **Dobavljač** (Supplier) — firma koja nam pruža plaćenu uslugu: hotel, prevoznik,
  aktivnost, prodavac bicikala. Uloga firme, ne poseban entitet.
- **Vodič** — uvijek **Osoba** (ne dobavljač); plaća se preko troška/dnevnice.
- Firma u poslu može i: **naplaćivati**, **plaćati troškove**, **voditi turu**, **držati novac** — sve su to uloge.

### Ponuda i cijena

- **Cjenovnik** (PriceList) — cijene dobavljača (hotel, transfer) po periodu/sezoni.
- **Procjena troškova** (CostEstimate) — koliko procjenjujemo da grupa košta (multiday calc excel).
- **Ponuda** (Offer) — cijena koju šaljemo klijentu; može imati verzije.
- **Prihvaćena ponuda** (AcceptedOfferSnapshot) — ono što je klijent prihvatio; **ne
  mijenja se** ako kasnije mijenjamo kalkulator.
- **Plan plaćanja** (PaymentSchedule) — depozit + ostatak.
- **Naknada za organizaciju** („company fee", Operating Fee) — dio cijene (~€300/os.)
  kojim plaćamo naš rad na organizaciji. **Nije marža.**
- **Marža** (Operating Margin) — **ono što ostane**: prihodi − troškovi − izdvajanja.

### Novac: gdje stoji / čemu služi / šta dugujemo (tri različite stvari)

- **Račun** (Financial Account) — stvarno mjesto gdje novac stoji: banka, Wise, POS, keš.
- **Namjenski fond** (Earmarked Fund) — dio novca za određenu svrhu; može biti raspoređen
  preko više računa. Primjeri: bike kasa, fond za investicije, porezna rezerva.
- **Dug / kredit / obaveza** (Financing Obligation) — ono što dugujemo: kredit (IRF),
  dug dobavljaču, lizing.

### Bicikli

- **Renta bicikla** — dio cijene za korišćenje bicikla.
- **Izdvajanje za bicikle** (Fleet contribution) — dio rente koji ide u bike kasu.
- **Bike kasa** (Bike Fund) — namjenski fond za bicikle, stoji kod DA; iz nje se plaćaju:
  **troškovi bicikala** (servis, dijelovi, mehaničar), **otplata kredita**, **ulaganje u nove bicikle**.

### Podjela i obračun

- **Podjela** — ono što ostane dijelimo, trenutno na **4 jednaka dijela (25/25/25/25)**:
  DA, Sampas, Other Trails, i **4. zajednički dio**.
- **Zajednički dio (4. dio)** — 25% čiji korisnik još nije određen (DA ekipa / saradnici
  u Kolašinu / investicije). Novac stoji kod DA — ali **kod koga stoji nije isto što i čije je.**
- **Dogovor o podjeli** (profit-sharing policy) — pravilo o podjeli sa **periodom
  važenja, učesnicima i procentima**; može se mijenjati po sezoni / partneru / grupi.
- **Obračun / poravnanje** (Settlement) — koliko svako treba da **primi ili plati**:
  koliko mu pripada − koliko je već zadržao.
- **Prenos između firmi** (Intercompany transfer) — kad jedna firma preda novac drugoj
  da se poravnaju. **Nije trošak grupe.**

---

## 3. Pravila (šta je trajno, šta se mijenja)

Tip: **Pravilo** (trajno) · **Politika** (mijenja se, ima period važenja) · **Podešavanje**
(cjenovnik/parametri) · **Konvencija** (kako sad radimo) · **Istorijska odluka** ·
**Privremeno** (ukloniti) · **Excel-artefakt** (nestaje sa fajlom).

### Cijena i ponuda

| Pravilo | Tip |
|---|---|
| Turu naplaćujemo **po osobi**, po tipu sobe i po tome je li biker ili ne. | Pravilo |
| **Ne-bikeri ne plaćaju dio za bicikl.** | Pravilo |
| Cijena = raspoređeni troškovi + doplata za sobu + naknada za organizaciju + dio za bicikl. | Podešavanje/kalkulator |
| **Prihvaćena ponuda se ne mijenja** kad kasnije diramo kalkulator. | Pravilo |
| Naknada ~€300/os., renta bicikla ~€55/dan, taksa/osiguranje ~€1.5/os./dan, cjenovnici, pax bandovi (≤15/>15). | Podešavanje |
| Poslata cijena je poslovna odluka (može ručno da odstupi od izračuna). | Konvencija |

### Naš rad, naknada i marža

| Pravilo | Tip |
|---|---|
| DA radi **zajedničku organizaciju**, koja se plaća **naknadom za organizaciju** po osobi. DA je firma sa ulogama — ne poseban „sloj". | Pravilo |
| **Marža = prihodi − troškovi − izdvajanja.** Nije naknada, i **nije „naknada + renta bicikla".** | Pravilo |

### Bicikli

| Pravilo | Tip |
|---|---|
| Bicikli su **imovina** koja se finansira, troši i mijenja vremenom. | Pravilo |
| **Renta bicikla** i **izdvajanje za bicikle** su dvije stvari; procenat izdvajanja je politika. | Pravilo / Politika |
| Izdvajanja se skupljaju u **bike kasi**, iz koje idu troškovi bicikala, otplata kredita i ulaganja. | Pravilo |
| Flota nabavljena kroz **IRF kredit + ugovor s dobavljačem + uvoz/carina**. | Istorijska odluka |
| Raspored bicikala gostima vodi **Adventure Hub**, ne Notion (ADR-0002). | Istorijska odluka |

### Više firmi i obračun

| Pravilo | Tip |
|---|---|
| Radimo kao **više firmi koje dijele jednu operaciju**. | Pravilo |
| Po turi: jedna firma **naplaćuje**, po trošku jedna **plaća** — to su uloge, ne jedinice. | Pravilo |
| **Ono što ostane dijelimo** (podjela je pravilo; procenti nisu). | Pravilo |
| Trenutna podjela **25/25/25/25** kroz **Dogovor o podjeli**. | Politika |
| **Obračun = koliko pripada − koliko je zadržao → prenos.** | Pravilo |
| **Prenos između firmi nije trošak grupe.** | Pravilo |
| **4. dio**: korisnik neodređen; **DA drži novac, ali nije automatski vlasnik.** | Politika |
| Obračun je zasad **na keš** („koliko je kod koga"), djelom fizički keš. | Konvencija |
| „Odobreni prihod" vs „zbir redova" + korekcija koja mora na nulu. | Privremeno |

### Troškovi: procjena vs stvarno

| Pravilo | Tip |
|---|---|
| **Procjena troškova** (na ponudi) i **stvarni trošak** su dvije stvari; kasnije ih poredimo (planirano vs potrošeno). | Pravilo |
| **Poslata → prihvaćena → naplaćena** cijena su tri različite vrijednosti. | Pravilo |
| Uplate imaju **način** (keš / banka / Wise / Hub link). | Pravilo |
| **Dobavljači su firme u ulozi dobavljača**; cijene im čuvamo u **cjenovniku po periodu** (da vidimo rast i opravdamo naše povećanje). | Pravilo |

### Vodiči i tura

| Pravilo | Tip |
|---|---|
| **Vodič se raspoređuje po danu/etapi** (mijenja se unutar iste ture). | Pravilo |
| **Način plaćanja vodiča (dnevnica)** je politika — mijenja se po vodiču/ugovoru/sezoni. | Politika |
| Tura je **skup stanja i prelaza** (ima grananja), ne jedna obavezna šina. | Pravilo |
| **Zatvaranje** je stanje kad su prihodi naplaćeni, troškovi potvrđeni i obračun urađen. | Pravilo |

---

## 4. Revizija složenosti

Za svaki pojam koji sam ranije uveo pitao sam: **treba li? može li prostije? može li se
spojiti? koristi li ga stvaran čovjek?** Rezultat:

| Pojam | Koji problem rješava | Odluka |
|---|---|---|
| Operating Unit | Nijedan — ista firma radi razne stvari, to su uloge. | **Izbačen.** |
| Operating Agency / Operating Function / Layer | Nijedan — DA je firma sa ulogama. | **Izbačen.** |
| Allocation Bucket | Isto što i „podjela ima 4 dijela". | **Spojeno** u „podjela / 4. dio". |
| Custodian (kao pojam) | Objašnjava se rečenicom „kod koga stoji ≠ čije je". | **Izbačen kao pojam** (ostaje objašnjenje). |
| Corporate Client / Direct Customer | To su vrste kupca. | **Spojeno** u „Kupac". |
| Asset Usage Charge | Kod nas nije poseban charge gostu; to je izdvajanje. | **Zamijenjeno**: „Izdvajanje za bicikle". |
| RateCard / PriceList | Imamo riječ. | **Zamijenjeno**: „Cjenovnik". |
| Supplier / Financial Account / Earmarked Fund / CostEstimate | Imamo riječi. | **Prevedeno**: Dobavljač / Račun / Namjenski fond / Procjena troškova. |
| Namjenski fond (zadržan) | Bike kasa **nije isto** što i običan račun. | **Zadržan** — rješava stvaran problem. |
| Dogovor o podjeli (zadržan) | Procenti se mijenjaju po sezoni/partneru. | **Zadržan.** |
| Procjena vs stvarni trošak (zadržano) | Da poredimo planirano i potrošeno. | **Zadržano.** |
| Prihvaćena ponuda (zadržana) | Ne smije se mijenjati kad diramo kalkulator. | **Zadržana.** |
| Obračun / Prenos između firmi (zadržano) | Više firmi dijeli novac. | **Zadržano.** |

---

## 5. Šta NE uvodimo (dok ne zatreba)

Ovi pojmovi zvuče „stručno" ali kod nas ne rješavaju konkretan problem — pa ih ne
uvodimo: *Contribution Margin, Allocated Entitlement, Settlement Obligation, Settlement
Pool, Operating Function, Operating Layer, Operating Agency, Operating Unit, Asset Usage
Charge.* Ako se jednog dana pojavi stvaran problem koji traži neki od njih — dodaćemo ga
tada, ne unaprijed.

---

## 6. Gdje šta ide (kratko)

- **U model (Adventure OS):** osoba, firma i njene uloge (kupac, agencija, dobavljač,
  ko naplaćuje/plaća/drži novac), brend, tura, ponuda (procjena → ponuda → prihvaćena),
  plan plaćanja, uplata, trošak (i veza „stvarni poredi procjenu"), obračun i prenos
  između firmi, podjela + dogovor o podjeli, račun / namjenski fond / dug (odvojeno),
  bike kasa i izdvajanje za bicikle, cjenovnik dobavljača po periodu.
- **U kalkulator (kasnije):** izračun cijene, obračun podjele, amortizacija bicikala,
  poređenje procjene i stvarnog.
- **U podešavanja (cjenovnici/parametri):** cijene dobavljača, naknada/renta/procenti,
  kategorije troškova, uslovi kredita, spisak bicikala.
- **Nestaje sa Excelom:** izgled tabova, greške u formulama, kopiranje cjenovnika po
  godinama, ručne korekcije.

---

## 7. Sljedeći korak

Pregledaj ovaj pravilnik na **našem jeziku**. Kad ga potvrdiš, tek onda usklađujemo
**§4** — i dalje **nije Faza 2**, i ne diramo Notion, produkciju ni Drive.

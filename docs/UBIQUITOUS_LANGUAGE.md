# Business ↔ Canonical Vocabulary (Poslovni rječnik)

> **Purpose.** This file maps the language used by the team to the stable names used by the canonical model and software. It is a translation bridge, not a second domain model and not a business rulebook.
>
> **Authority.** Full canonical definitions belong in [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md). Business rules belong in their domain rulebooks. This file contains only the minimum wording needed to prevent translation drift.
>
> **Status:** ✓ = already present in the canonical model · ◇ = proposed name, not adopted until the canonical model is explicitly updated.

## Identity and roles

| Poslovni naziv | Kanonski naziv | Status | Kratko značenje |
|---|---|---|---|
| Osoba | `Person` | ✓ | Jedan čovjek, bez obzira na ulogu. |
| Firma / organizacija | `Organisation` | ✓ | Pravno ili operativno tijelo. |
| Brend | `Brand` | ✓ | Javni identitet, odvojen od pravnog lica. |
| Kupac | `Customer` role | ✓ | Osoba ili firma koja kupuje. |
| Agencija | `Agency` role | ✓ | Posrednik, tour operator ili DMC. |
| Dobavljač | `Supplier` role | ◇ | Firma koja pruža robu ili uslugu. |
| Vodič na dan/etapu | `GuideAssignment` | ✓ | Veza osobe-vodiča sa dijelom ture. |
| Kod koga stoji novac | `Custodian` role | ◇ | Ko drži novac; ne određuje vlasništvo. |

## Tura, ponuda and cijena

| Poslovni naziv | Kanonski naziv | Status | Kratko značenje |
|---|---|---|---|
| Tura / grupa | `TripGroup` | ✓ | Višednevna grupa kao operativna cjelina. |
| Dan ture / etapa | `ItineraryDay` | ◇ | Jedan dan ili segment itinerera. |
| Upit | `Inquiry` | ✓ | Zahtjev prije ponude ili rezervacije. |
| Cjenovnik | `PriceList` | ◇ | Cijene koje važe u određenom periodu. |
| Stavka cjenovnika | `PriceListItem` | ◇ | Jedna cijena sa uslovima važenja. |
| Procjena troškova | `CostEstimate` | ◇ | Planirani troškovi prije prihvatanja ponude. |
| Ponuda | `Offer` | ✓ | Komercijalni predlog klijentu. |
| Verzija ponude | `OfferVersion` | ◇ | Jedna sačuvana verzija ponude. |
| Prihvaćena ponuda | `AcceptedOffer` | ◇ | Prihvaćeni uslovi koji se više ne mijenjaju. |
| Plan plaćanja | `PaymentSchedule` | ◇ | Dogovoreni depozit, rate i ostatak. |

## Novac and obračun

| Poslovni naziv | Kanonski naziv | Status | Kratko značenje |
|---|---|---|---|
| Uplata | `Payment` | ✓ | Primljeni ili očekivani novac. |
| Trošak | `Expense` | ✓ | Stvarni nastali ili dugovani trošak. |
| Naknada za organizaciju | `OperatingFee` | ◇ | Dio cijene za rad na organizaciji. |
| Marža / ono što ostane | `OperatingMargin` | ◇ | Izvedeni rezultat nakon troškova i izdvajanja. |
| Račun / mjesto gdje je novac | `FinancialAccount` | ◇ | Banka, Wise, POS ili keš. |
| Namjenski fond | `EarmarkedFund` | ◇ | Novac rezervisan za određenu svrhu. |
| Bike kasa | `BikeFund` | ◇ | Namjenski fond za flotu bicikala. |
| Dug / kredit / obaveza | `FinancingObligation` | ◇ | Finansijska obaveza koju treba izmiriti. |
| Renta bicikla | `BikeRentalRevenue` | ◇ | Prihod od korišćenja bicikla. |
| Izdvajanje za bicikle | `FleetContribution` | ◇ | Dio prihoda namijenjen bike kasi. |
| Dogovor o podjeli | `ProfitSharingPolicy` | ◇ | Pravilo podjele sa periodom, učesnicima i procentima. |
| Zajednički dio / 4. dio | `SharedAllocation` | ◇ | Dio podjele čiji krajnji korisnik nije unaprijed fiksiran. |
| Obračun / poravnanje | `Settlement` | ✓ | Koliko kome pripada u odnosu na novac koji već drži. |
| Prenos između firmi | `IntercompanyTransfer` | ◇ | Prenos radi poravnanja; nije trošak ture. |

## Imovina and ugovori

| Poslovni naziv | Kanonski naziv | Status | Kratko značenje |
|---|---|---|---|
| Bicikl | `Bike` / `Asset` | ✓ | Pojedinačno praćena imovina flote. |
| Dobavljački ugovor | `SupplierAgreement` | ◇ | Ugovor sa dobavljačem. |
| PDV po aktivnosti | `VATEntry` | ◇ | PDV zapis vezan za određenu aktivnost. |

## Maintenance rule

Dodaj red samo kada poslovni i kanonski naziv zaista treba povezati ili kada postoji realna opasnost od različitog tumačenja. Ne kopiraj puna pravila, formule, lifecycle ili detaljne definicije iz drugih dokumenata.

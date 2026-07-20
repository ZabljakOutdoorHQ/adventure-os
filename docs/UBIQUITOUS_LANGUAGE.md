# Ubiquitous Language — Business ↔ Canonical (Poslovni rječnik)

> **Purpose / Svrha.** One bridge between two views of the same reality: the **business
> language** the team speaks (Boris, Anđa, guides, accountant) and the **canonical
> language** the software uses (`DOMAIN_MODEL.md`, ADRs, API, code, agents, MCP). This is
> a **translation, not a duplication** — see [ADR-0005](decisions/0005-two-language-layers.md)
> and Constitution §3.16.
>
> **How to use it.** Business docs (rulebooks, procedures, onboarding) use the **left**
> column. The model, API and code use the **right** column. When they differ, that is by
> design — both must point at the same meaning.
>
> **Status:** ✓ = name already in the canonical model · ◇ = proposed canonical name,
> **draft** pending the §4 / model-update step (do not treat ◇ as adopted).

## Ljudi i firme / People & organisations

| Poslovni naziv | Kanonski naziv | | Definicija | Primjer |
|---|---|---|---|---|
| Osoba | `Person` | ✓ | Čovjek u bilo kojoj ulozi | Gost, vodič |
| Firma | `Organisation` | ✓ | Pravno/operativno tijelo | Hotel Soa, DA |
| Naša firma | `Organisation` (own / legal entity) | ✓ | Naša registrovana firma | Durmitor Adventure |
| Brend | `Brand` | ✓ | Javni identitet, nije nužno pravno lice | „Durmitor Adventure" kao brend |

## Uloge / Roles (a role is not a new object)

| Poslovni naziv | Kanonski naziv | | Definicija | Primjer |
|---|---|---|---|---|
| Kupac | `Customer` (role) | ✓ | Svako ko kupuje | Agencija ili direktni gost |
| Agencija | `Agency` (role) | ✓ | Posrednik / tour operator / DMC | Partnerska agencija |
| Dobavljač | `Supplier` (role) | ◇ | Firma koja pruža robu/uslugu | Hotel Soa |
| Vodič (na dan/etapu) | `Person` + `GuideAssignment` | ✓ | Osoba raspoređena na segment ture | Vodič na Komovima |
| Kod koga stoji novac | `Custodian` | ◇ | Firma koja drži zajednički/tuđi novac (drži ≠ posjeduje) | DA drži 4. dio |

## Tura / Tour

| Poslovni naziv | Kanonski naziv | | Definicija | Primjer |
|---|---|---|---|---|
| Tura / grupa | `TripGroup` | ✓ | Višednevna grupa kao cjelina | Grupa 25.06–02.07 |
| Dan ture / etapa | `ItineraryDay` | ◇ | Jedan dan/etapa ture | Dan 3: Komovi |
| Bicikl | `Asset` (`Bike`) | ✓ | Imovina flote | e-bike #12 |

## Ponuda i cijena / Offer & price

| Poslovni naziv | Kanonski naziv | | Definicija | Primjer |
|---|---|---|---|---|
| Cjenovnik | `PriceList` | ◇ | Skup cijena koji važi u periodu | Hotel Soa 2027 |
| Stavka cjenovnika | `PriceListItem` | ◇ | Jedna cijena u cjenovniku | Double HB 01.05–30.06 |
| Procjena troškova | `CostEstimate` | ◇ | Planirani trošak prije realizacije | Kalkulacija ponude |
| Ponuda | `Offer` / `OfferVersion` | ✓/◇ | Cijena poslata klijentu (može imati verzije) | Poslata ponuda |
| Prihvaćena ponuda | `AcceptedOffer` | ◇ | Ono što je klijent prihvatio; ne mijenja se | Potvrđeno uz depozit |
| Plan plaćanja | `PaymentSchedule` | ◇ | Depozit + ostatak | 30% + 70% |
| Upit | `Inquiry` | ✓ | Zahtjev prije ponude | Upit agencije za jun |

## Novac / Money

| Poslovni naziv | Kanonski naziv | | Definicija | Primjer |
|---|---|---|---|---|
| Uplata | `Payment` | ✓ | Primljeni novac | Depozit |
| Trošak | `Expense` | ✓ | Stvarni nastali trošak | Plaćen hotel |
| Naknada za organizaciju | `OperatingFee` | ◇ | Dio cijene za naš rad na organizaciji | ~€300/os. |
| Marža | `OperatingMargin` | ◇ | Ono što ostane = prihodi − troškovi − izdvajanja | Kraj sezone |
| Renta bicikla | `BikeRentalRevenue` | ◇ | Dio cijene za korišćenje bicikla | ~€55/dan |
| Izdvajanje za bicikle | `FleetContribution` | ◇ | Dio rente koji ide u bike kasu | Pola rente |

## Gdje novac stoji / čemu služi / šta se duguje

| Poslovni naziv | Kanonski naziv | | Definicija | Primjer |
|---|---|---|---|---|
| Račun (finansijski) | `FinancialAccount` | ◇ | Stvarno mjesto gdje novac stoji | Banka, Wise, keš |
| Namjenski fond | `EarmarkedFund` | ◇ | Novac izdvojen za određenu svrhu | Bike kasa |
| Bike kasa | `BikeFund` | ◇ | Namjenski fond za održavanje i razvoj flote | Servis, kredit, novi bicikli |
| Dug / kredit / obaveza | `FinancingObligation` | ◇ | Ono što dugujemo | IRF kredit |

## Podjela i obračun / Allocation & settlement

| Poslovni naziv | Kanonski naziv | | Definicija | Primjer |
|---|---|---|---|---|
| Podjela | (profit distribution) | ◇ | Ono što ostane dijelimo | 25/25/25/25 |
| Dogovor o podjeli | `ProfitSharingPolicy` | ◇ | Pravilo podjele s periodom, učesnicima, procentima | Politika 2026 |
| Zajednički dio (4. dio) | `SharedAllocation` | ◇ | Dio čiji korisnik još nije određen | 4. dio kod DA |
| Obračun / poravnanje | `Settlement` | ✓ | Koliko ko prima/plaća = pripada − zadržao | Kraj sezone |
| Prenos između firmi | `IntercompanyTransfer` | ◇ | Novac između naših firmi (nije trošak grupe) | Sampas → DA |
| Dobavljački ugovor | `SupplierAgreement` | ◇ | Ugovor s dobavljačem | Ugovor s hotelom |
| PDV po aktivnosti | `VATEntry` | ◇ | PDV vezan za aktivnost | (kasnije, ADR-0002) |

---

**Napomena.** Poslovni dokument nikad nije obavezan da koristi kanonsku riječ — dovoljno
je da govori o istoj stvari. Kanonski model nikad se ne prevodi na srpski niti se
pojednostavljuje radi čitljivosti; njegov posao je preciznost i stabilnost. Ovaj rječnik
ih spaja.

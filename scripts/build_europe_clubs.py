# -*- coding: utf-8 -*-
"""Genera las entradas de clubes europeos y las anexa a content/clubs.json.

reputation es una heurística de balance de juego (no un dato investigado),
mismo criterio que Sudamérica: baseline por tier + boost manual a clubes de
peso regional/internacional. Ver CLAUDE.md, sección "Fase 3b".
"""
import io, json, re, unicodedata, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON = os.path.join(ROOT, "src", "content", "clubs.json")

def slug(name):
    n = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    n = n.lower().replace("&", " ").replace(".", " ")
    n = re.sub(r"[^a-z0-9]+", "-", n).strip("-")
    return n

# (nombre, reputacion). tier y country se pasan por bloque.
# Los 5 clubes que ya existían en clubs.json (real-madrid, barcelona,
# atletico-madrid, sevilla, manchester-city) se filtran por dedup de id.
LEAGUES = [
    ("Inglaterra", 1, [
        ("Manchester City", 95), ("Liverpool", 94), ("Arsenal", 92), ("Manchester United", 90),
        ("Chelsea", 90), ("Tottenham Hotspur", 86), ("Newcastle United", 82), ("Aston Villa", 78),
        ("West Ham United", 74), ("Brighton & Hove Albion", 72), ("Everton", 72), ("Crystal Palace", 68),
        ("Fulham", 66), ("Brentford", 66), ("Nottingham Forest", 66), ("Wolverhampton Wanderers", 66),
        ("Leeds United", 64), ("Bournemouth", 62), ("Sunderland", 60), ("Burnley", 58),
    ]),
    ("Inglaterra", 2, [
        ("Leicester City", 70), ("Southampton", 60), ("Ipswich Town", 56), ("West Bromwich Albion", 52),
        ("Sheffield United", 52), ("Norwich City", 52), ("Watford", 52), ("Middlesbrough", 50),
        ("Sheffield Wednesday", 50), ("Stoke City", 48), ("Derby County", 48), ("Swansea City", 46),
        ("Blackburn Rovers", 46), ("Coventry City", 45), ("Hull City", 44), ("Birmingham City", 44),
        ("Queens Park Rangers", 42), ("Bristol City", 42), ("Portsmouth", 42), ("Millwall", 40),
        ("Preston North End", 40), ("Wrexham", 40), ("Charlton Athletic", 40), ("Oxford United", 36),
    ]),
    ("España", 1, [
        ("Real Madrid", 97), ("Barcelona", 96), ("Atlético Madrid", 85), ("Athletic Bilbao", 78),
        ("Villarreal", 76), ("Real Sociedad", 74), ("Real Betis", 74), ("Valencia", 74),
        ("Sevilla", 72), ("Girona", 64), ("Celta Vigo", 62), ("Espanyol", 60),
        ("Osasuna", 58), ("Getafe", 58), ("Rayo Vallecano", 58), ("Mallorca", 56),
        ("Alavés", 54), ("Levante", 52), ("Elche", 50), ("Real Oviedo", 50),
    ]),
    ("España", 2, [
        ("Deportivo de La Coruña", 50), ("Real Zaragoza", 48), ("Real Valladolid", 46), ("Sporting de Gijón", 46),
        ("Málaga CF", 46), ("Granada CF", 46), ("Racing de Santander", 44), ("UD Las Palmas", 44),
        ("Cádiz CF", 44), ("UD Almería", 44), ("SD Eibar", 42), ("CD Leganés", 40),
        ("SD Huesca", 36), ("Córdoba CF", 34), ("Albacete Balompié", 34), ("Burgos CF", 32),
        ("CD Castellón", 32), ("CD Mirandés", 30), ("FC Andorra", 30), ("Cultural y Deportiva Leonesa", 30),
        ("AD Ceuta FC", 28), ("Real Sociedad B", 30),
    ]),
    ("Italia", 1, [
        ("Inter Milan", 90), ("AC Milan", 90), ("Juventus", 90), ("Napoli", 86),
        ("Roma", 82), ("Lazio", 80), ("Atalanta", 80), ("Fiorentina", 74),
        ("Bologna", 70), ("Torino", 66), ("Genoa", 62), ("Udinese", 62),
        ("Como", 60), ("Sassuolo", 56), ("Parma", 56), ("Hellas Verona", 56),
        ("Cagliari", 56), ("Lecce", 54), ("Pisa", 50), ("Cremonese", 50),
    ]),
    ("Italia", 2, [
        ("Sampdoria", 52), ("Monza", 52), ("Palermo", 50), ("Empoli", 50),
        ("Venezia", 46), ("Spezia", 44), ("Bari", 44), ("Frosinone", 44),
        ("Pescara", 40), ("Cesena", 40), ("Modena", 38), ("Catanzaro", 36),
        ("Reggiana", 36), ("Padova", 34), ("Avellino", 34), ("Südtirol", 32),
        ("Mantova", 30), ("Juve Stabia", 30), ("Carrarese", 30), ("Virtus Entella", 28),
    ]),
    ("Alemania", 1, [
        ("FC Bayern Munich", 94), ("Borussia Dortmund", 86), ("Bayer 04 Leverkusen", 84), ("RB Leipzig", 80),
        ("Eintracht Frankfurt", 74), ("VfB Stuttgart", 72), ("SC Freiburg", 68), ("VfL Wolfsburg", 66),
        ("Borussia Mönchengladbach", 66), ("Werder Bremen", 64), ("1. FC Köln", 62), ("Hamburger SV", 62),
        ("1. FC Union Berlin", 62), ("TSG 1899 Hoffenheim", 62), ("1. FSV Mainz 05", 60), ("FC Augsburg", 58),
        ("FC St. Pauli", 54), ("1. FC Heidenheim", 52),
    ]),
    ("Francia", 1, [
        ("Paris Saint-Germain", 92), ("Marseille", 80), ("Monaco", 78), ("Lyon", 74),
        ("Lille", 72), ("Nice", 70), ("Lens", 68), ("Rennes", 68),
        ("Strasbourg", 60), ("Nantes", 60), ("Brest", 58), ("Toulouse", 58),
        ("Auxerre", 54), ("Paris FC", 52), ("Le Havre", 52), ("Angers", 50),
        ("Metz", 50), ("Lorient", 50),
    ]),
    ("Portugal", 1, [
        ("Benfica", 84), ("Porto", 84), ("Sporting CP", 82), ("Braga", 72),
        ("Vitória de Guimarães", 62), ("Famalicão", 54), ("Moreirense", 50), ("Gil Vicente", 50),
        ("Rio Ave", 50), ("Arouca", 48), ("Santa Clara", 48), ("Estoril Praia", 48),
        ("Nacional", 46), ("Estrela da Amadora", 46), ("Casa Pia", 46), ("Tondela", 44),
        ("Alverca", 42), ("AVS", 42),
    ]),
    ("Países Bajos", 1, [
        ("AFC Ajax", 82), ("PSV Eindhoven", 80), ("Feyenoord", 80), ("AZ Alkmaar", 70),
        ("FC Twente", 66), ("FC Utrecht", 62), ("Go Ahead Eagles", 54), ("SC Heerenveen", 54),
        ("NEC Nijmegen", 54), ("FC Groningen", 54), ("Sparta Rotterdam", 52), ("Fortuna Sittard", 50),
        ("Heracles Almelo", 50), ("NAC Breda", 50), ("PEC Zwolle", 50), ("Excelsior Rotterdam", 48),
        ("FC Volendam", 46), ("SC Telstar", 42),
    ]),
]

SUFFIX = {
    "Inglaterra": "eng", "España": "es", "Italia": "it", "Alemania": "de",
    "Francia": "fr", "Portugal": "pt", "Países Bajos": "nl",
}

with io.open(JSON, encoding="utf-8") as f:
    clubs = json.load(f)

existing_ids = {c["id"] for c in clubs}
added = 0
for country, tier, teams in LEAGUES:
    for name, rep in teams:
        cid = slug(name)
        if cid in existing_ids:
            # ya existe (los 5 europeos originales) -> no duplicar
            if any(c["id"] == cid and c["country"] == country for c in clubs):
                continue
            # colisión con un club de otro país (ej. nacional PT vs UY) -> sufijo
            cid = cid + "-" + SUFFIX[country]
            if cid in existing_ids:
                continue
        clubs.append({"id": cid, "name": name, "country": country, "tier": tier, "reputation": rep})
        existing_ids.add(cid)
        added += 1

with io.open(JSON, "w", encoding="utf-8") as f:
    json.dump(clubs, f, ensure_ascii=False, indent=2)
    f.write("\n")

print("añadidos", added, "-> total", len(clubs))

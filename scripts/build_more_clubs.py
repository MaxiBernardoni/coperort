# -*- coding: utf-8 -*-
"""Segundas divisiones europeas restantes (Alemania/Francia/Portugal/Países Bajos)
+ Liga MX (México) y MLS (Estados Unidos), como única cobertura de CONCACAF por
ahora (CAF/AFC/OFC quedan afuera, ver CLAUDE.md Fase 3b). Mismo método y
heurística de reputation que build_europe_clubs.py.
"""
import io, json, re, unicodedata, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON = os.path.join(ROOT, "src", "content", "clubs.json")

def slug(name):
    n = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    n = n.lower().replace("&", " ").replace(".", " ")
    n = re.sub(r"[^a-z0-9]+", "-", n).strip("-")
    return n

LEAGUES = [
    ("Alemania", 2, [
        ("FC Schalke 04", 68), ("Hertha BSC", 62), ("Hannover 96", 54), ("1. FC Nurnberg", 52),
        ("1. FC Kaiserslautern", 52), ("VfL Bochum", 46), ("Fortuna Dusseldorf", 46), ("Karlsruher SC", 42),
        ("1. FC Magdeburg", 40), ("Dynamo Dresden", 42), ("SpVgg Greuther Furth", 38), ("SV Darmstadt 98", 40),
        ("Holstein Kiel", 44), ("SC Paderborn", 40), ("Arminia Bielefeld", 38), ("Eintracht Braunschweig", 36),
        ("SV Elversberg", 32), ("SC Preussen Munster", 32),
    ]),
    ("Francia", 2, [
        ("Saint-Etienne", 62), ("Montpellier", 56), ("Reims", 44), ("Troyes", 42),
        ("Bastia", 40), ("Guingamp", 40), ("Clermont", 38), ("Nancy", 38),
        ("Red Star", 34), ("Grenoble", 34), ("Amiens", 32), ("Pau", 30),
        ("Laval", 32), ("Rodez", 30), ("Annecy", 30), ("Dunkerque", 30),
        ("Le Mans", 28), ("Boulogne", 26),
    ]),
    ("Portugal", 2, [
        ("Maritimo", 46), ("Portimonense", 38), ("Pacos de Ferreira", 40), ("Chaves", 36),
        ("Vizela", 34), ("Farense", 36), ("Feirense", 32), ("Academico de Viseu", 32),
        ("Benfica B", 30), ("Porto B", 30), ("Sporting CP B", 30), ("Leixoes", 30),
        ("Penafiel", 30), ("Uniao de Leiria", 30), ("Torreense", 28), ("Oliveirense", 26),
        ("Felgueiras", 24), ("Lusitania Lourosa", 22),
    ]),
    ("Países Bajos", 2, [
        ("SBV Vitesse", 42), ("SC Cambuur", 36), ("Roda JC Kerkrade", 34), ("FC Emmen", 34),
        ("RKC Waalwijk", 36), ("Willem II", 34), ("De Graafschap", 34), ("ADO Den Haag", 34),
        ("VVV-Venlo", 30), ("Almere City", 32), ("FC Eindhoven", 28), ("FC Den Bosch", 28),
        ("MVV Maastricht", 26), ("FC Dordrecht", 26), ("Helmond Sport", 24), ("TOP Oss", 22),
        ("Jong Ajax", 20), ("Jong AZ", 20), ("Jong PSV", 20), ("Jong FC Utrecht", 20),
    ]),
    ("México", 1, [
        ("America", 86), ("Tigres UANL", 78), ("Guadalajara", 78), ("Cruz Azul", 76),
        ("Monterrey", 76), ("Pumas UNAM", 66), ("Toluca", 64), ("Leon", 62),
        ("Pachuca", 60), ("Santos Laguna", 58), ("Atlas", 54), ("Tijuana", 52),
        ("Atletico San Luis", 44), ("Necaxa", 48), ("Juarez", 42), ("Puebla", 46),
        ("Queretaro", 42), ("Mazatlan", 40),
    ]),
    ("Estados Unidos", 1, [
        ("Inter Miami CF", 72), ("LA Galaxy", 66), ("Seattle Sounders FC", 64), ("Los Angeles FC", 64),
        ("Atlanta United FC", 60), ("Columbus Crew", 58), ("Philadelphia Union", 56), ("FC Cincinnati", 56),
        ("New York City FC", 54), ("New York Red Bulls", 54), ("Sporting Kansas City", 52), ("Portland Timbers", 52),
        ("Nashville SC", 50), ("Orlando City SC", 50), ("Real Salt Lake", 48), ("Minnesota United FC", 48),
        ("San Diego FC", 46), ("Charlotte FC", 46), ("FC Dallas", 46), ("Houston Dynamo FC", 46),
        ("Chicago Fire FC", 46), ("Toronto FC", 44), ("D.C. United", 44), ("Colorado Rapids", 44),
        ("Vancouver Whitecaps FC", 44), ("New England Revolution", 42), ("San Jose Earthquakes", 42), ("Austin FC", 42),
        ("St. Louis City SC", 42), ("CF Montreal", 42),
    ]),
]

SUFFIX = {
    "Alemania": "de", "Francia": "fr", "Portugal": "pt", "Países Bajos": "nl",
    "México": "mx", "Estados Unidos": "us",
}

with io.open(JSON, encoding="utf-8") as f:
    clubs = json.load(f)

existing_ids = {c["id"] for c in clubs}
added = 0
for country, tier, teams in LEAGUES:
    for name, rep in teams:
        cid = slug(name)
        if cid in existing_ids:
            if any(c["id"] == cid and c["country"] == country for c in clubs):
                continue
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

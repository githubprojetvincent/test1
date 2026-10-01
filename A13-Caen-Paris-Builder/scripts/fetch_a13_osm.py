import argparse,json,urllib.parse,urllib.request
from pathlib import Path
Q='''[out:json][timeout:180];(way["highway"="motorway"]["ref"~"(^|;)A13(;|$)"];way["highway"="motorway_link"]["ref"~"(^|;)A13(;|$)"];);out tags geom;'''
p=argparse.ArgumentParser();p.add_argument("--output",default="output/a13_osm.json");p.add_argument("--endpoint",default="https://overpass-api.de/api/interpreter");a=p.parse_args()
u=a.endpoint+"?"+urllib.parse.urlencode({"data":Q})
r=urllib.request.Request(u,headers={"User-Agent":"A13-Caen-Paris-Builder/1.0"})
with urllib.request.urlopen(r,timeout=240) as f:d=json.load(f)
Path(a.output).parent.mkdir(parents=True,exist_ok=True);Path(a.output).write_text(json.dumps(d),encoding="utf-8")
print("ways:",len(d.get("elements",[])))

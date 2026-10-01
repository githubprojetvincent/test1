import argparse,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument("input");p.add_argument("--output",default="output/a13_corridor.geojson");a=p.parse_args()
d=json.loads(Path(a.input).read_text(encoding="utf-8"));fs=[]
for e in d.get("elements",[]):
 g=e.get("geometry",[])
 if len(g)>1:fs.append({"type":"Feature","properties":e.get("tags",{}),"geometry":{"type":"LineString","coordinates":[[x["lon"],x["lat"]] for x in g]}})
o={"type":"FeatureCollection","features":fs};Path(a.output).parent.mkdir(parents=True,exist_ok=True);Path(a.output).write_text(json.dumps(o),encoding="utf-8");print("features:",len(fs))

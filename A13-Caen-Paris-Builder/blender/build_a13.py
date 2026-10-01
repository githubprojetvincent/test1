import bpy,json,math,sys
from pathlib import Path
def clear():
 bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
def xy(lon,lat,lon0,lat0):
 R=6378137.;return (math.radians(lon-lon0)*R*math.cos(math.radians(lat0)),math.radians(lat-lat0)*R)
def road(name,pts,width):
 v=[];f=[]
 for i,(x,y) in enumerate(pts):
  if i==0: dx,dy=pts[1][0]-x,pts[1][1]-y
  elif i==len(pts)-1: dx,dy=x-pts[i-1][0],y-pts[i-1][1]
  else: dx,dy=pts[i+1][0]-pts[i-1][0],pts[i+1][1]-pts[i-1][1]
  L=max(1e-6,math.hypot(dx,dy));nx,ny=-dy/L,dx/L
  v += [(x+nx*width/2,y+ny*width/2,0),(x-nx*width/2,y-ny*width/2,0)]
 for i in range(len(pts)-1):f.append((2*i,2*i+1,2*i+3,2*i+2))
 m=bpy.data.meshes.new(name);m.from_pydata(v,[],f);m.update();o=bpy.data.objects.new(name,m);bpy.context.collection.objects.link(o);return o
def main(src):
 clear();d=json.loads(Path(src).read_text(encoding="utf-8"));cs=[c for x in d["features"] for c in x["geometry"]["coordinates"]];lon0=sum(x[0] for x in cs)/len(cs);lat0=sum(x[1] for x in cs)/len(cs)
 mat=bpy.data.materials.new("A13_Asphalt");mat.diffuse_color=(.04,.045,.05,1)
 for i,x in enumerate(d["features"]):
  c=x["geometry"]["coordinates"]
  if len(c)>1:road(f"A13_{i:05d}",[xy(q[0],q[1],lon0,lat0) for q in c],15).data.materials.append(mat)
 out=Path(src).with_suffix(".blend");bpy.ops.wm.save_as_mainfile(filepath=str(out));print("saved",out)
a=sys.argv[sys.argv.index("--")+1] if "--" in sys.argv and len(sys.argv)>sys.argv.index("--")+1 else "output/a13_corridor.geojson";main(a)

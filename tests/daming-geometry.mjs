// Run: NODE_PATH is not used by ESM. Supply the directory containing pinned packages.
// node tests/daming-geometry.mjs /path/to/node_modules
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const modules=process.argv[2]||'node_modules';
const THREE=await import(pathToFileURL(path.resolve(modules,'three/build/three.module.js')));
const {mergeGeometries}=await import(pathToFileURL(path.resolve(modules,'three/examples/jsm/utils/BufferGeometryUtils.js')));
const {MeshBVH,SAH}=await import(pathToFileURL(path.resolve(modules,'three-mesh-bvh/build/index.module.js')));
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const between=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const art=between('    function geoMesh(','    function nameBoard(');
const precinct=between('    // Daming precinct,','    // Yanchun:');
const collision=between('    function resolveCapsule(','    function translateFollowCamera(');
const execute=new Function('THREE','mergeGeometries','MeshBVH','SAH',`
  const structures=new THREE.Group(),decorMeshes=[],collisionParts=[],boxes=[],recordLabels=[];
  const material=(color)=>new THREE.MeshStandardMaterial({color});
  const cache=new Map();function artMat(color,kind='',opacity=1){const key=color+kind+opacity;if(!cache.has(key))cache.set(key,new THREE.MeshStandardMaterial({color,opacity}));return cache.get(key);}
  function patch(){}function label(...args){recordLabels.push(args);}
  ${art}\n${precinct}
  structures.updateMatrixWorld(true);
  const inputs=collisionParts.map(m=>{const g=m.geometry.clone();g.applyMatrix4(m.matrixWorld);g.deleteAttribute('normal');g.deleteAttribute('uv');return g.index?g.toNonIndexed():g;});
  const collisionGeometry=mergeGeometries(inputs,false);collisionGeometry.boundsTree=new MeshBVH(collisionGeometry,{strategy:SAH,maxLeafTris:8});
  const RADIUS=.35,HEIGHT=1.75,MAX_ALTITUDE=3000;
  const segment=new THREE.Line3(),capsuleBounds=new THREE.Box3(),triPoint=new THREE.Vector3(),segPoint=new THREE.Vector3(),normal=new THREE.Vector3(),before=new THREE.Vector3();
  const playerPos=new THREE.Vector3(),player=new THREE.Group();let groundContact=false,ceilingContact=false;
  ${collision}
  return {DAMING,damingParts,structures,collisionParts,recordLabels,playerPos,movePlayer,resolveCapsule};
`);
const m=execute(THREE,mergeGeometries,MeshBVH,SAH);
const {damingParts:p,DAMING:c}=m;
assert.equal(p.frontColumns.length,12,'11 bays require 12 column axes');
assert.ok(Math.abs(p.frontColumns.at(-1)-p.frontColumns[0]-62)<1e-8);
assert.ok(Math.abs(p.corridor.length-74.4)<1e-8);
assert.ok(Math.abs(p.corridor.width-13.64)<1e-8);
assert.equal(p.corridorColumns.length,16,'7 longitudinal bays, 8 posts on each side');
assert.ok(Math.abs(p.corridor.south-(-665-18.6))<1e-8);
assert.ok(Math.abs(p.corridor.north-(p.corridor.rearZ+10))<1e-8);
assert.equal(p.roofs.filter(r=>r.name.startsWith('大明殿上重檐')||r.name==='大明殿下重檐').length,2);
for(const gate of ['大明門','日精門','月華門','鳳儀門','麟瑞門','嘉慶門','景福門','延春門'])assert.ok(p.gates.some(g=>g.name===gate),gate);
const wen=m.recordLabels.find(a=>a[0].startsWith('文樓'));
const wu=m.recordLabels.find(a=>a[0].startsWith('武樓'));
assert.ok(wen[1]>0&&wu[1]<0&&wen[3]>-700&&wu[3]>-700,'towers south of side gates, east/west correct');
// Central gate passage must be open for a human-sized capsule at ground level.
for(const z of [-519,-525,-530,-536,-541]){const v=new THREE.Vector3(0,0,z);m.resolveCapsule(v,v.clone());assert.ok(v.distanceTo(new THREE.Vector3(0,0,z))<.002,'Daming gate blocked at '+z);}
// A player can walk up the front stairs and through the open centre into the gallery.
m.playerPos.set(0,0,-617);
for(let i=0;i<1680;i++)m.movePlayer(new THREE.Vector3(0,-.015,-.075));
assert.ok(m.playerPos.z<-735,'stairs or hall blocked: '+m.playerPos.toArray());
assert.ok(Math.abs(m.playerPos.y-3.1)<.02,'gallery floor must support the player');
// Pillars remain solid despite merged decorative geometry.
m.playerPos.set(p.frontColumns[3]-2,3.1,-665+18.6);
for(let i=0;i<40;i++)m.movePlayer(new THREE.Vector3(.08,0,0));
assert.ok(m.playerPos.x<p.frontColumns[3]-.65,'character crossed a column');
const upper=m.structures.children.filter(o=>o.name.startsWith('大明殿上重檐廡殿頂'));
const upperBounds=new THREE.Box3();for(const o of upper)upperBounds.union(new THREE.Box3().setFromObject(o));
assert.ok(Math.abs(upperBounds.max.y-27.9)<.001,'documented display height includes terrace and ridge decoration');
let vertices=0;
m.structures.traverse(o=>{if(o.isMesh){const a=o.geometry.attributes.position;vertices+=a.count;for(let i=0;i<a.array.length;i++)assert.ok(Number.isFinite(a.array[i]),o.name+' has nonfinite geometry');}});
console.log(JSON.stringify({passed:true,bays:11,corridorBays:7,gatePassage:'clear',stairsAndGallery:'walkable',columnCollision:'solid',meshes:m.structures.children.length,vertices},null,2));

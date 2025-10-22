'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import { useCart } from '@/contexts/cart-context';

// =========================
//  Hat & Bill & Mesh Presets
//  [crown, bill]           => mesh uses crown
//  [crown, bill, mesh]     => explicit mesh
// =========================
const HAT_AND_BILL_COLORS = [
  ["#74a8ca", "#74a8ca"],
  ["#7b2023", "#7b2023"],
  ["#111526", "#111526"],
  ["#131313", "#131313"],
  ["#c82e02", "#c82e02"],
  ["#47276c", "#47276c"],
  ["#e5e5e5", "#e5e5e5"],
  ["#ad1f21", "#ad1f21"],
  ["#111111", "#111111"],
  ["#15407e", "#15407e"],
  ["#130d15", "#130d15", "#e5c86f"],
  ["#121214", "#121214", "#e5d099"],
  ["#111111", "#111111", "#f2f2f2"],
  ["#4c4949", "#4c4949", "#c1e3fa"],
  ["#4c4949", "#4c4949", "#181c2c"],
  ["#4c4949", "#4c4949", "#2d5d2d"],
  ["#4c4949", "#4c4949", "#1d80a4"],
  ["#4c4949", "#4c4949", "#56a143"],
  ["#4c4949", "#4c4949", "#5d6851"],
  ["#4c4949", "#4c4949", "#e884eb"],
  ["#4c4949", "#4c4949", "#bed941"],
  ["#4c4949", "#4c4949", "#1b4778"],
  ["#4c4949", "#4c4949", "#a42122"],
  ["#4c4949", "#4c4949", "#c13f11"],
  ["#4c4949", "#4c4949", "#ebebeb"],
  ["#701f1c", "#701f1c", "#281122"],
  ["#701f1c", "#701f1c", "#ece8eb"],
  ["#74add4", "#74add4", "#c7cdce"],
  ["#0174af", "#0174af", "#deecec"],
  ["#153831", "#153831", "#deecec"],
];

// =========================
//  Emblems
// =========================
const EMBLEM_COLORS = ['#D2A679', '#C56B36', '#8B4513', '#333333'];
const EMBLEM_SHAPES = [
  '/emblems/hexagon.png',
  '/emblems/sun.png',
  '/emblems/flat-hexagon.png',
  '/emblems/diamond.png',
  '/emblems/circle.png',
  '/emblems/oval.png'
];

// =========================
//  Small UI: split swatch (left=crown, right=bill)
// =========================
function ColorPairSwatch({ front, bill, selected, onClick, label }) {
  return (
    <button
      aria-label={label ?? `${front} / ${bill}`}
      title={label ?? `${front} / ${bill}`}
      onClick={onClick}
      className={`w-10 h-10 rounded-full border-2 focus:outline-none ${
        selected ? 'ring-2 ring-offset-2 ring-indigo-400' : 'border-gray-300'
      }`}
      style={{ background: `linear-gradient(90deg, ${front} 0 50%, ${bill} 50% 100%)` }}
    />
  );
}

// =========================
//  Emblem bits
// =========================
function Emblem({ texturePath, color, position = [0, 2, 3.8], rotation = [-0.3, 0, 0], scale = [3,3,3] }) {
  const texture = useTexture(texturePath);
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} color={color} transparent />
    </mesh>
  );
}

function EmblemSwatch({ texturePath, selected, onClick, label }) {
  return (
    <button
      aria-label={label ?? texturePath}
      title={label ?? texturePath}
      onClick={() => onClick(texturePath)}
      className={`w-12 h-12 rounded border-2 flex items-center justify-center focus:outline-none ${
        selected ? 'ring-2 ring-offset-2 ring-indigo-400' : 'border-gray-300'
      }`}
    >
      <img src={texturePath} alt={label ?? 'emblem'} className="max-w-full max-h-full" />
    </button>
  );
}

// =========================
//  ColorableHat
//  - Detects bill + back/mesh anywhere in hierarchy
//  - Clones those materials so they’re independently colorable
//  - Colors everything else as crown
// =========================
function ColorableHat({ crownColor, billColor, meshColor, emblemShape, emblemColor, onLoaded }) {
  const gltf = useGLTF('/models/baseball_cap_5.glb');
  const { scene } = gltf;

  const billMeshesRef = useRef([]);
  const backMeshesRef = useRef([]);
  const crownMeshesRef = useRef([]);

  useEffect(() => {
    if (!scene) return;

    billMeshesRef.current = [];
    backMeshesRef.current = [];
    crownMeshesRef.current = [];

    // Helpers (tune to your names if needed)
    const isBill = (mesh) => {
      const n = (mesh.name || '').toLowerCase();
      const m = (mesh.material?.name || '').toLowerCase();
      return /(bill|brim|visor|peak)/.test(n) || /(bill|brim|visor|peak)/.test(m);
    };
    const isBack = (mesh) => {
      const n = (mesh.name || '').toLowerCase();
      const m = (mesh.material?.name || '').toLowerCase();
      // Prefer names you actually used in Blender (e.g., backMesh)
      // "mesh" alone is generic, so require "back" or a combined term
      return /(backmesh|back_mesh|back-panel|backpanel|back)/.test(n) ||
             /(backmesh|back_mesh|back-panel|backpanel|back)/.test(m);
    };

    scene.traverse((child) => {
      if (!child.isMesh) return;

      if (isBill(child)) {
        child.material = child.material?.clone?.() || child.material;
        if (child.material) child.material.needsUpdate = true;
        billMeshesRef.current.push(child);
      } else if (isBack(child)) {
        child.material = child.material?.clone?.() || child.material;
        if (child.material) child.material.needsUpdate = true;
        backMeshesRef.current.push(child);
      } else {
        crownMeshesRef.current.push(child);
      }
    });

    onLoaded && onLoaded();
  }, [scene, onLoaded]);

  // Apply crown
  useEffect(() => {
    crownMeshesRef.current.forEach((m) => {
      if (m?.material?.color) {
        m.material.color.set(crownColor);
        m.material.needsUpdate = true;
      }
    });
  }, [crownColor]);

  // Apply bill
  useEffect(() => {
    billMeshesRef.current.forEach((m) => {
      if (m?.material?.color) {
        m.material.color.set(billColor);
        m.material.needsUpdate = true;
      }
    });
  }, [billColor]);

  // Apply back/mesh
  useEffect(() => {
    backMeshesRef.current.forEach((m) => {
      if (m?.material?.color) {
        m.material.color.set(meshColor);
        m.material.needsUpdate = true;
      }
    });
  }, [meshColor]);

  // // Debug helper: list meshes/materials to console
  // useEffect(() => {
  //   if (!scene) return;
  //   console.group('GLB nodes');
  //   scene.traverse((c) => c.isMesh && console.log('mesh:', c.name, '| mat:', c.material?.name));
  //   console.groupEnd();
  // }, [scene]);

  return (
    <group>
      <primitive object={scene} />
      <Emblem
        texturePath={emblemShape}
        color={emblemColor}
        position={[0, 65, 63.8]}
        rotation={[-0.5, 0, 0]}
        scale={[70,70,70]}
      />
    </group>
  );
}
useGLTF.preload('/models/baseball_cap_5.glb');

// =========================
//  Helper: map a preset into colors
//  [a,b]   -> { crown:a, bill:b, mesh:a }
//  [a,b,c] -> { crown:a, bill:b, mesh:c }
// =========================
function mapPreset(preset) {
  const a = preset[0];
  const b = preset[1] ?? a;   // bill defaults to crown if missing (defensive)
  const c = preset[2] ?? a;   // mesh = crown when only two values
  return { crown: a, bill: b, mesh: c };
}

// =========================
//  Main Customizer
// =========================
export default function Customizer() {
  const [presetIndex, setPresetIndex] = useState(0);
  const {dispatch} = useCart();

  // Defaults from first preset
  const defaults = useMemo(() => mapPreset(HAT_AND_BILL_COLORS[0]), []);
  const [crownColor, setCrownColor] = useState(defaults.crown);
  const [billColor,  setBillColor]  = useState(defaults.bill);
  const [meshColor,  setMeshColor]  = useState(defaults.mesh);

  const [emblemShape, setEmblemShape] = useState(EMBLEM_SHAPES[0]);
  const [emblemColor, setEmblemColor] = useState(EMBLEM_COLORS[0]);
  const [loading, setLoading] = useState(true);

  // When preset changes, derive colors based on your rule
  useEffect(() => {
    const { crown, bill, mesh } = mapPreset(HAT_AND_BILL_COLORS[presetIndex]);
    setCrownColor(crown);
    setBillColor(bill);
    setMeshColor(mesh);
  }, [presetIndex]);

    // Use your real Shopify ProductVariant GID or bare numeric variant id
  // (your checkout API already accepts either and resolves correctly)
  const BASE_VARIANT_ID = 'gid://shopify/ProductVariant/51434432725314'; // << replace with real variant
  const UNIT_PRICE = 35.00; // match your currency convention (you currently sum price * qty)

  // Build a composite id so each unique customization is its own cart line
  function makeCompositeId(variantId, props) {
    const sorted = Object.entries(props).sort(([a], [b]) => a.localeCompare(b));
    const encoded = sorted.map(([k,v]) => `${k}=${String(v)}`).join('|');
    return `${variantId}::${encoded}`;
  }

  function addToCart() {
    // keep values human-readable for checkout attributes
    const properties = {
      'Crown Color': crownColor,
      'Bill Color': billColor,
      'Mesh Color': meshColor,
      'Emblem Shape': emblemShape.split('/').pop() || emblemShape,
      'Emblem Color': emblemColor,
    };
    const id = makeCompositeId(BASE_VARIANT_ID, properties);

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id,                       // composite id so different combos don't merge
        variantId: BASE_VARIANT_ID, // your checkout API resolves this to merchandiseId
        title: 'Custom Leather Baseball Cap',
        image: '/images/custom-hat.png', // set an appropriate image path
        price: UNIT_PRICE,
        properties,               // will be forwarded to Shopify as line attributes
      },
    });
    dispatch({ type: 'OPEN_CART' });
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col lg:flex-row items-center justify-center p-6 gap-8">
      {/* 3D Canvas */}
      <section className="w-full lg:w-1/2 h-[70vh] bg-white rounded-xl shadow-lg overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 text-gray-700 font-medium">
            Loading 3D model...
          </div>
        )}
        <Canvas camera={{ position: [0, 2, 508], fov: 50 }}>
          <ambientLight intensity={2} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <OrbitControls
            target={[0, -1, 0]}
            // enableDamping
            // dampingFactor={0.1}
            // minPolarAngle={Math.PI / 2.2}
            // maxPolarAngle={Math.PI / 1.8}
            // minAzimuthAngle={-Math.PI / 6}
            // maxAzimuthAngle={Math.PI / 6}
          />
          <ColorableHat
            crownColor={crownColor}
            billColor={billColor}
            meshColor={meshColor}
            emblemShape={emblemShape}
            emblemColor={emblemColor}
            onLoaded={() => setLoading(false)}
          />
        </Canvas>
      </section>

      {/* Controls */}
      <section className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Custom Leather Baseball Cap</h1>
        <p className="text-xl font-semibold text-indigo-600">$49.00</p>
        <p className="text-gray-600">Pick a crown/bill preset (mesh auto-follows crown unless specified).</p>

        {/* Preset picker */}
        <div>
          <label className="block font-medium mb-1">Hat Presets</label>
          <div className="flex gap-2 overflow-x-auto py-1">
            {HAT_AND_BILL_COLORS.slice(0, 12).map((arr, i) => {
              const a = arr[0];
              const b = arr[1] ?? arr[0];
              return (
                <ColorPairSwatch
                  key={`${a}-${b}-${i}`}
                  front={a}
                  bill={b}
                  selected={presetIndex === i}
                  onClick={() => setPresetIndex(i)}
                  label={`Preset ${i+1}: ${a} / ${b}`}
                />
              );
            })}
          </div>
          {HAT_AND_BILL_COLORS.length > 12 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-indigo-600">Show more presets</summary>
              <div className="mt-2 flex gap-2 flex-wrap">
                {HAT_AND_BILL_COLORS.slice(12).map((arr, idx) => {
                  const i = idx + 12;
                  const a = arr[0];
                  const b = arr[1] ?? arr[0];
                  return (
                    <ColorPairSwatch
                      key={`${a}-${b}-${i}`}
                      front={a}
                      bill={b}
                      selected={presetIndex === i}
                      onClick={() => setPresetIndex(i)}
                      label={`Preset ${i+1}: ${a} / ${b}`}
                    />
                  );
                })}
              </div>
            </details>
          )}
        </div>

        {/* Emblem Shape */}
        <div>
          <label className="block font-medium mb-1">Emblem Shape</label>
          <select
            value={emblemShape}
            onChange={(e) => setEmblemShape(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {EMBLEM_SHAPES.map((shape, i) => (
              <option key={i} value={shape}>{shape.split('/').pop()}</option>
            ))}
          </select>
        </div>

        {/* Emblem Swatches */}
        <div>
          <label className="block font-medium mb-1">Emblem Shape</label>
          <div className="flex gap-2 flex-wrap">
            {EMBLEM_SHAPES.map((shape) => (
              <EmblemSwatch
                key={shape}
                texturePath={shape}
                selected={emblemShape === shape}
                onClick={setEmblemShape}
                label={shape.split('/').pop()}
              />
            ))}
          </div>
        </div>

        {/* Emblem Color */}
        <div>
          <label className="block font-medium mb-1">Emblem Color</label>
          <div className="flex gap-2">
            {EMBLEM_COLORS.map((color, i) => (
              <button
                key={`emblem-${color}`}
                aria-label={`Emblem ${i + 1}`}
                title={`Emblem ${i + 1}`}
                onClick={() => setEmblemColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  emblemColor === color ? 'ring-2 ring-offset-2 ring-indigo-400' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* <button className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition">
          Add to Cart
        </button> */}
                <button
          onClick={addToCart}
          className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Add to Cart
        </button>
      </section>
    </main>
  );
}

# Brand introduction

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Replace the 3D logo

The scene loads the named objects from `public/assets/brand-logo.obj` with the
materials in `public/assets/brand-logo.mtl`. Replace both files together and
keep the OBJ object names `Gold`, `Navy_Big`, `Navy_Small`, and `Green`; these
names let the scroll animation move the actual parts independently. Keep any
referenced textures beside the MTL file and use relative texture paths in it.
The model is centered and uniformly fitted for display; its mesh geometry and
material assignments are not rebuilt or replaced.

The initial separation paths are in `src/components/Logo3D.jsx`. The scroll
timings, assembly, reveal, card, and navbar travel are in
`src/components/ScrollController.jsx`.

## Change the background and company copy

Edit `src/data/brand.js` to update the company name, tagline, introduction,
offering, vision, contact email, hero line, and model paths. The animated
procedural background lives in `src/components/ui/ShaderBackground.jsx`; its
palette and motion values are in the `COLORS` and `SETTINGS` constants.

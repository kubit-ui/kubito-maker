# Kubito Gallery

This folder contains predefined Kubito designs that can be loaded into the editor.

## Structure

Each design should be in its own subfolder with:

- `name.kubito` - The design file in JSON format
- `name.png` - A preview thumbnail image of the design

## Manifest

The `gallery-manifest.json` file contains the list of all designs available in the gallery.

### Manifest format:

```json
[
  {
    "id": "unique-name",
    "name": "Display Name",
    "description": "Design description",
    "folder": "folder-name",
    "thumbnail": "thumbnail-name.png",
    "kubito": "file-name.kubito"
  }
]
```

## Adding a new design

1. Create a subfolder with the design name
2. Export your design as .kubito
3. Create a PNG thumbnail (recommended: 400x300px)
4. Update the `gallery-manifest.json` with the new entry

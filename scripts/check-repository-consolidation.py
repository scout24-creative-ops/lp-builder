#!/usr/bin/env python3
from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'repository-consolidation.json').read_text())
def blob(path):
 data=path.read_bytes()
 return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
for entry in manifest['preservedRuntime']:
 assert blob(root/entry['path'])==entry['sha'],entry['path']
for entry in manifest['imports']:
 assert blob(root/entry['path'])==entry['targetBlob'],entry['path']
print(f"Verified {len(manifest['imports'])} imported files and {len(manifest['preservedRuntime'])} unchanged public runtime assets.")

#!/usr/bin/env python3
"""Verify preserved LP sources, recoverable Git histories and runtime boundaries."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def sha(path):
    with path.open('rb') as handle:
        return hashlib.file_digest(handle, 'sha256').hexdigest()


def git(repo, *args):
    return subprocess.check_output(['git', '-c', 'core.hooksPath=/dev/null', '-C', str(repo), *args], stderr=subprocess.PIPE)


def restore(base, snapshot=False):
    inv = json.loads((base / 'inventory.json').read_text())
    for line in (base / 'SHA256SUMS').read_text().splitlines():
        digest, path = line.split('  ', 1)
        assert sha(base / path) == digest, path
    with tempfile.TemporaryDirectory(prefix='lp-restore-') as tmp:
        bundle = Path(tmp) / 'history.bundle'
        with bundle.open('wb') as output:
            for entry in inv['bundle']['parts']:
                part = base / entry['path']
                assert part.stat().st_size == entry['bytes'] and sha(part) == entry['sha256']
                with part.open('rb') as source:
                    shutil.copyfileobj(source, output)
        assert bundle.stat().st_size == inv['bundle']['bytes'] and sha(bundle) == inv['bundle']['sha256']
        restored = Path(tmp) / 'restored.git'
        subprocess.run(['git', '-c', 'core.hooksPath=/dev/null', 'clone', '--mirror', str(bundle), str(restored)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
        git(restored, 'fsck', '--full')
        refs = dict(line.split(' ', 1)[::-1] for line in git(restored, 'show-ref').decode().splitlines())
        assert refs == inv['refs'], inv['repository']
        assert int(git(restored, 'rev-list', '--all', '--count')) == inv['commit_count']
        tree = {}
        for row in git(restored, 'ls-tree', '-rz', inv['main']).split(b'\0'):
            if row:
                meta, path = row.split(b'\t', 1)
                mode, kind, oid = meta.decode().split()
                tree[path.decode()] = (mode, kind, oid)
        expected = {e['path']: (e['git_mode'], 'blob', e['git_blob']) for e in inv['files']}
        assert tree == expected
        for entry in inv['files']:
            original = git(restored, 'cat-file', 'blob', entry['git_blob'])
            assert len(original) == entry['bytes'] and hashlib.sha256(original).hexdigest() == entry['sha256']
            if snapshot:
                target = base / 'files' / entry['path']
                assert sha(target) == entry['sha256'], target
                assert bool(target.stat().st_mode & 0o111) == (entry['git_mode'] == '100755'), target
    print(f'{inv["repository"]}: {len(inv["files"])} originals, all {len(refs)} refs and {inv["commit_count"]} commits restored.')
    return inv


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--public-dir', type=Path, help='Optional checkout of the public runtime distribution')
    parser.add_argument('--archive-dir', type=Path, help='Optional projects/lp-builder folder in project-archive')
    args = parser.parse_args()
    recovery = ROOT / 'recovery/2026-11-15-contentful-consolidation'
    inv = restore(recovery)
    targets = json.loads((recovery / 'target-files.json').read_text())
    assert len(targets) == len(inv['files']) == 455
    originals = {e['path']: e for e in inv['files']}
    for entry in targets:
        target = ROOT / entry['path']
        assert target.is_file() and not target.is_symlink(), target
        assert sha(target) == entry['sha256'], target
        if entry['sha256'] != originals[entry['path']]['sha256']:
            assert entry.get('change_reason'), target
        if entry['path'].startswith(('gpt-package/', 'recovery/', 'assets/', 'references/')):
            assert entry['sha256'] == originals[entry['path']]['sha256'], target
    for name in ('lpbuilder-bridge.css', 'lpbuilder-runtime.js'):
        assert (ROOT / 'runtime/contentful' / name).read_bytes() == (ROOT / 'recovery/2026-11-14-css-js-veroeffentlichung' / name).read_bytes()
    baseline = json.loads((ROOT / 'runtime/published-baseline.json').read_text())
    assert len(baseline['files']) == 12
    if args.public_dir:
        for entry in baseline['files']:
            target = args.public_dir / entry['path']
            assert sha(target) == entry['sha256'], target
            assert bool(target.stat().st_mode & 0o111) == (entry['git_mode'] == '100755'), target
        print('All 12 public runtime assets unchanged.')
    if args.archive_dir:
        for name in ('aem', 'agent-prototype'):
            restore(args.archive_dir / name, snapshot=True)
    print('PASS: 455 source files retained; GPT package and original recovery unchanged; private runtime remains the preserved unpublished state.')


if __name__ == '__main__':
    main()

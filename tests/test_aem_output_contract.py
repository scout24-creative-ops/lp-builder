#!/usr/bin/env python3
"""Regression checks for the LP Builder's two output contracts."""

from pathlib import Path
import unittest


SYSTEM_PROMPT = Path(__file__).resolve().parents[1] / "agent" / "systemprompt.md"


class AemOutputContractTest(unittest.TestCase):
    def setUp(self) -> None:
        self.prompt = SYSTEM_PROMPT.read_text(encoding="utf-8")

    def test_aem_fragment_is_the_default_and_forbids_document_wrappers(self) -> None:
        self.assertIn("**AEM fragment (default):**", self.prompt)
        self.assertIn("**no** `<!doctype>`, `<html>`, `<head>`, or `<body>` tags", self.prompt)
        self.assertIn("top-level fragment nodes before the modules", self.prompt)

    def test_standalone_preview_is_explicit_and_keeps_document_wrapper(self) -> None:
        self.assertIn("**Standalone preview:**", self.prompt)
        self.assertIn("`OUTPUT:PREVIEW`", self.prompt)
        self.assertIn("complete document with `<!doctype html>`, `<html lang=\"de\">`, `<head>`, and `<body>`", self.prompt)


if __name__ == "__main__":
    unittest.main()

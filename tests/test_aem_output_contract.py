#!/usr/bin/env python3
"""Regression checks for the LP Builder's Canvas AEM output contract."""

from pathlib import Path
import unittest


SYSTEM_PROMPT = Path(__file__).resolve().parents[1] / "agent" / "systemprompt.md"


class AemOutputContractTest(unittest.TestCase):
    def setUp(self) -> None:
        self.prompt = SYSTEM_PROMPT.read_text(encoding="utf-8")

    def test_canvas_artifact_is_required_for_aem_fragment(self) -> None:
        self.assertIn("create a Canvas code artifact", self.prompt)
        self.assertIn("be named `landingpage.html`", self.prompt)
        self.assertIn("Do not output the landing-page HTML in normal chat.", self.prompt)

    def test_aem_fragment_forbids_document_wrappers(self) -> None:
        self.assertIn("AEM-ready HTML fragment", self.prompt)
        self.assertIn("Do not include `<!doctype html>`, `<html>`, `<head>`, or `<body>` tags.", self.prompt)
        self.assertIn("Place the complete ASSETS block first", self.prompt)


if __name__ == "__main__":
    unittest.main()

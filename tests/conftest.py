"""Test setup.

Two ways to run the tests:
- Light: only aiohttp/aioresponses installed. The package __init__ imports
  Home Assistant, so a stub package is registered and only the HA-free
  modules (api.py, playlist.py) are tested; HA tests skip themselves.
- Full: pytest-homeassistant-custom-component installed. Everything runs.
"""

import sys
import types
from pathlib import Path

import pytest

try:
    import homeassistant  # noqa: F401

    HAS_HA = True
except ImportError:
    HAS_HA = False

if HAS_HA:
    pytest_plugins = ["pytest_homeassistant_custom_component"]

    @pytest.fixture(autouse=True)
    def auto_enable_custom_integrations(enable_custom_integrations):
        """Let Home Assistant load the integration from custom_components/."""
        yield

    @pytest.fixture(autouse=True)
    def mock_ai_provider(request):
        """AudioMuse-AI reports an AI provider unless a test says otherwise.

        Not applied to the HTTP client tests, which exercise the real method.
        """
        from unittest.mock import AsyncMock, patch

        if request.node.path.name == "test_api.py":
            yield None
            return
        with patch(
            "custom_components.audiomuse.api.AudioMuseClient.get_ai_provider",
            AsyncMock(return_value="OPENAI"),
        ) as mock:
            yield mock

else:
    PKG_DIR = Path(__file__).resolve().parents[1] / "custom_components" / "audiomuse"
    for name, path in (("custom_components", PKG_DIR.parent), ("custom_components.audiomuse", PKG_DIR)):
        if name not in sys.modules:
            module = types.ModuleType(name)
            module.__path__ = [str(path)]
            sys.modules[name] = module

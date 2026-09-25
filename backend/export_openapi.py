import json

from app.main import create_app

spec = create_app().openapi()
with open("openapi.json", "w") as f:
    json.dump(spec, f, indent=2)

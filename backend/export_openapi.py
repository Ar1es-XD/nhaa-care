import json
from app.main import app

if __name__ == "__main__":
    with open("docs/api/openapi.json", "w", encoding="utf-8") as f:
        json.dump(app.openapi(), f, indent=2)
    print("OpenAPI schema exported to docs/api/openapi.json")

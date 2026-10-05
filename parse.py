import json
import re

with open(r'C:\Users\zero\.gemini\antigravity-ide\brain\b30a3cf6-3efb-42e5-9b6a-a247ea428331\.system_generated\steps\60\content.md', encoding='utf-8') as f:
    text = f.read()

json_str = text[text.find('['):]
repos = json.loads(json_str)
for r in repos:
    print(f"Name: {r.get('name')}")
    print(f"Description: {r.get('description')}")
    print(f"URL: {r.get('html_url')}")
    print(f"Language: {r.get('language')}")
    print("-" * 40)

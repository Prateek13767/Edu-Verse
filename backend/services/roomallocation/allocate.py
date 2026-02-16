import subprocess
import json
import sys
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# =====================================================
# Load environment variables (.env must contain GOOGLE_API_KEY)
# =====================================================
load_dotenv()

# =====================================================
# STEP 1: Run Node.js data exporter
# =====================================================
print("▶ Running exportData.js ...")

result = subprocess.run(
    ["node", "exportData.js"],
    capture_output=True,
    text=True
)

if result.returncode != 0:
    print("❌ JS ERROR (stderr):")
    print(result.stderr)
    sys.exit(1)

stdout = result.stdout.strip()

# =====================================================
# STEP 2: Parse JSON from Node
# =====================================================
try:
    data = json.loads(stdout)
except json.JSONDecodeError as e:
    print("❌ JSON PARSE ERROR")
    print("RAW OUTPUT FROM NODE:\n", stdout)
    raise e

hostel_rooms = data.get("hostelRoomsData", [])
willingness = data.get("willingnessData", [])

if not hostel_rooms or not willingness:
    print("❌ Missing hostel or willingness data")
    sys.exit(1)

print(f"✔ Loaded {len(willingness)} students")
print(f"✔ Loaded {len(hostel_rooms)} hostels")

# =====================================================
# STEP 3: Build STRICT LLM prompt
# =====================================================
policy = """
1. Boys can be allotted only to boys hostels.
2. Girls can be allotted only to girls hostels.
3. Priority order:
   Outside India > Outside Rajasthan > Outside Jaipur > Jaipur students
4. Students of the same branch must be placed in the same block.
5. If a block becomes full, move to another block of the same hostel.
6. A room's capacity must never be exceeded.
"""

prompt = f"""
You are a hostel room allotment engine.

ALLOTMENT POLICY:
{policy}

INPUT DATA:

STUDENTS (WILLINGNESS):
{json.dumps(willingness, indent=2)}

HOSTELS WITH ROOMS:
{json.dumps(hostel_rooms, indent=2)}

OUTPUT RULES (VERY IMPORTANT):
- Return ONLY valid JSON
- No explanation
- No markdown
- No comments
- No extra fields

Return an ARRAY of objects with EXACTLY these fields:
- student (MongoDB ObjectId string)
- hostel (MongoDB ObjectId string)
- room (MongoDB ObjectId string)
- year (number) → must be 2025
- status (string) → must be "Allotted"
- willingness (MongoDB ObjectId string)
"""

# =====================================================
# STEP 4: Invoke Gemini
# =====================================================
print("▶ Invoking Gemini...")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0
)

response = llm.invoke(prompt)

raw_output = response.content.strip()

# =====================================================
# STEP 5: Force JSON validation
# =====================================================
try:
    allotments = json.loads(raw_output)
except json.JSONDecodeError:
    print("❌ LLM DID NOT RETURN VALID JSON")
    print("RAW RESPONSE:\n", raw_output)
    sys.exit(1)

# =====================================================
# STEP 6: Validate schema shape
# =====================================================
REQUIRED_FIELDS = {
    "student",
    "hostel",
    "room",
    "year",
    "status",
    "willingness"
}

for i, entry in enumerate(allotments):
    if not isinstance(entry, dict):
        raise ValueError(f"Invalid entry at index {i}")

    missing = REQUIRED_FIELDS - entry.keys()
    if missing:
        raise ValueError(f"Missing fields {missing} in entry {i}")

    if entry["year"] != 2025:
        raise ValueError("Year must be 2025")

    if entry["status"] != "Allotted":
        raise ValueError("Status must be 'Allotted'")

print("✔ Valid Room Allotment JSON generated")

# =====================================================
# STEP 7: Output FINAL JSON (for Node / Mongo insertion)
# =====================================================
print(json.dumps(allotments, indent=2))

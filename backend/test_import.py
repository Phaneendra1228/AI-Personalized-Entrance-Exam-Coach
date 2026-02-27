import sys
import traceback
sys.path.insert(0, '.')
try:
    from routers import planner
    print("planner OK")
except Exception as e:
    traceback.print_exc()
    print("ERROR:", e)

import asyncio
import time
import sys
from distance_sensor import *

try:
    max_dist = float(sys.argv[1])
except:
    max_dist = 100.0

dSensor = uSonicDistance()
dSensor2 = uSonicDistance(pin_trigger = 9, pin_echo = 25)

dt=0.0001

start_time = time.time()

print(f"Start time = {start_time}")
print(f"Max Distance = {max_dist}")

async def checkSensor(sensor, start_time, max_dist=50.0, sensor_Id = "1"):
    test = sensor.measure()
    await asyncio.sleep(1)
    sloop = True
    while sloop:
         d = sensor.measure()
         if d < max_dist:
             sloop = False
             detect_time = time.time() - start_time
             print(detect_time, d)
         await asyncio.sleep(dt)
    return detect_time


d1 = asyncio.run(checkSensor(dSensor, start_time, max_dist=max_dist, sensor_Id = "1"))
d2 = asyncio.run(checkSensor(dSensor2, start_time, max_dist=max_dist, sensor_Id = "2"))

print(f"dt = {d1-d2}")

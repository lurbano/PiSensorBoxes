
from distance_sensor import *
import time

dSensor = uSonicDistance()
dSensor2 = uSonicDistance(pin_trigger = 9, pin_echo = 25)

start_time = time.time()

end_time = 5 #seconds
dt = 0.0001 #sec

i = 0
while True:

    d = dSensor.measure()
    d2 = dSensor2.measure()
    t = time.time() - start_time
    txt = "{t:5.2f}, {d1:5.2f}, {d2:5.2f}".format(t=t, d1=d, d2=d2)
    if (d < 100 or d2 < 100):
        print(txt )
    time.sleep(dt)
    i+=1


from distance_sensor import *
import time

dSensor = uSonicDistance()
dSensor2 = uSonicDistance(pin_trigger = 9, pin_echo = 25)

start_time = time.time()

end_time = 5 #seconds
dt = 0.1 #sec


for i in range(int(end_time/dt)):
    d = dSensor.measure()
    d2 = dSensor2.measure()
    txt = "{t:5.2f}, {d1:5.2f}, {d2:5.2f}".format(t=i*dt, d1=d, d2=d2)
    print(txt )
    time.sleep(dt)

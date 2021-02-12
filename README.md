# Raspberry Pi Sensor Boxes using Tornado server


 # References:
  RGB: https://github.com/adafruit/Adafruit_CircuitPython_NeoPixel
       https://thepihut.com/blogs/raspberry-pi-tutorials/using-neopixels-with-the-raspberry-pi

 # Install OS
 A: Make the image on the SD card:
 (make image using Raspberry Pi Imager: https://www.raspberrypi.org/software/)

 ## Setup ssh, wifi, and usb connection
 Working on the boot directory of the SD Card
 1) [copy] or create empty file "ssh" from raspberry-pi_setup directory to boot directory
     Filename: ssh

 2) [edit] or create file for wifi connection and copy to boot directory of Pi:
     File name: wpa_supplicant.conf
     Change: networkName and yourPassword

   ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
   update_config=1

   network={
     ssid="networkName"
     psk="yourPassword"
   }

 3) [copy] over or update files on the SD Card for usb connection (https://learn.adafruit.com/turning-your-raspberry-pi-zero-into-a-usb-gadget/ethernet-gadget)
 a) "config.txt": Add 'dtoverlay=dwc2' as the last line.
 b) "cmdline.txt": Add ' modules-load=dwc2,g_ether' after 'rootwait' (e.g. 'rootwait modules-load=dwc2,g_ether').


 # Connect to pi

 B: Plug Pi into Laptop USB then once pi has booted up:
     Login with (putty):
       PuTTY Host/IP: raspberrypi.local
       Port: 22
       Username: pi
       Password: raspberry

     OR (command line):
       > ssh pi@raspberrypi.local

     NOTE: you may have to remove the ~/.ssh/known_hosts file if you find yourself logging in to the wrong pi.

 ## update pi
 > sudo apt-get update

 > sudo apt-get upgrade

 ## REBOOT pi
 > sudo reboot

 ## [For LEDs] Install neopixel and rpi_ws281x

 > sudo pip3 install adafruit-circuitpython-neopixel

 > sudo pip3 install rpi_ws281x


 ## test program (test.py)

    import board
    import neopixel

    npix = 20
    pixels = neopixel.NeoPixel(board.D18, 20)
    pixels[-1] = (0,10,0)


 ## to run the test program
 > sudo python3 test.py


 ## to set the program to run on startup.
 Ref: https://learn.sparkfun.com/tutorials/how-to-run-a-raspberry-pi-program-on-startup/all
 > sudo nano /etc/rc.local

and add the following line (change your filename and path) before the 'exit 0' line to run the 'clear.py' program in your home directory:
> sudo python3 /home/pi/clear.py &


# [FOR SENSORS] enable interfaces (i2c and spi)
Ref: https://learn.adafruit.com/circuitpython-on-raspberrypi-linux/installing-circuitpython-on-raspberry-pi
> sudo pip3 install --upgrade setuptools
> sudo apt-get install -y python-smbus
> sudo apt-get install -y i2c-tools

# activate interfaces
> sudo raspi-config
---- Interfacing Options
------ I2C
-------- Yes
---------- Yes
---- Interfacing Options
------ SPI
-------- Yes
---------- Yes

# REBOOT pi
> sudo reboot

# Test I2C (only shows something if an I2C device is attached)
> sudo i2cdetect -y 1
# Test SPI
> ls -l /dev/spidev*

# For OLED (and other things possibly)
3) install adafruit-blinka
> sudo pip3 install adafruit-blinka

4) install Pi OLED library
> sudo pip3 install adafruit-circuitpython-ssd1306


# For Tornado Server
Setting up the tornado server used for Websockets
> sudo pip3 install tornado

## Starting up on boot
** IMPORTANT **: the directory with the files needs to be in the pi home directory (e.g. /home/pi/GitHub/PiSensorBoxes) with this setup. You can change this but be sure to put the full path to the commands
# set up to start server automatically on startup
# from: https://learn.sparkfun.com/tutorials/how-to-run-a-raspberry-pi-program-on-startup
# Edit /etc/rc.local (the easy way)
> sudo nano /etc/rc.local
ADD THE LINES (before 'exit 0' ):
 /usr/bin/python3 /home/pi/GitHub/PiSensorBoxes/server.py 2> /home/pi/error.log &
 /usr/bin/python3 /home/pi/GitHub/PiSensorBoxes/measure_distance.py  &




# for finding the pi on the network easily
https://thepihut.com/blogs/raspberry-pi-tutorials/19668676-renaming-your-raspberry-pi-the-hostname
Rename Pi: use nano to rename pi. (optional)
* Default name is 'raspberrypi' replace with new hostname.
* Only use regular letters and numbers for new name.
* (e.g. 'SensorPi1')
> sudo nano /etc/hostname
* Also update /etc/hosts
> sudo nano /etc/hosts

6) Restart for everything to take effect
> sudo reboot


#* If you need to kill the server (and it's the only thing running with python3)
* https://unix.stackexchange.com/questions/104821/how-to-terminate-a-background-process
> pgrep python3
* this will give you the process id, a three digit number 'nnn'. To kill use:
> sudo kill nnn


# Refs:
* OLED: http://codelectron.com/setup-oled-display-raspberry-pi-python/
* https://learn.adafruit.com/adafruit-pioled-128x32-mini-oled-for-raspberry-pi/usage

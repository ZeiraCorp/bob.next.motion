# BoB:next:Motion

## Components

- GoPiGo (`git clone https://github.com/DexterInd/GoPiGo.git`)
- NodeJS
- mqtt.js


## Useful tools

- [Angry IP Scanner](http://angryip.org/)
- wifi router
- ssh client
- mc (Midnight Commander)

### Install node

    wget http://node-arm.herokuapp.com/node_0.10.36_armhf.deb
    sudo dpkg -i node_0.10.36_armhf.deb

    #!!! -> node_0.10.36_armhf.deb because of GoPiGo

### Install Wetty (KO with this node version (0.10.36))

Cf. [https://github.com/krishnasrinivas/wetty](https://github.com/krishnasrinivas/wetty)

    git clone https://github.com/krishnasrinivas/wetty
    cd wetty
    npm install

#### Run and use Wetty

    node app.js -p 3000

## Install Samba

    sudo apt-get install samba samba-common-bin
    sudo pico /etc/samba/smb.conf

Search `Authentication` section, and add this entry:

    security = user

Search `[homes]` section, and add/update these entries:

    comment = Home Directories
    browseable = yes
    read only = no

Set password of samba server:

    sudo smbpasswd -a pi

Restart samba server:

    sudo /etc/init.d/samba restart


## Run a programm at startup

First install `screen`

    sudo apt-get install screen

Then create a script: `start`

    node ~bob.next/yo.js

Make the script executable:

    chmod +x ~/start

Edit the root startup script file:

    sudo nano /etc/rc.local

And add the following line before exit 0

    su - pi -c "screen -dm -S pistartup ~/start"

And ...

    sudo reboot

## Set wifi parameters on the RPI

    sudo nano /etc/wpa_supplicant/wpa_supplicant.conf

    network={
        ssid="typeunsafe"
        psk="a_nice_password"
    }

## Set hostName of the RPI

    sudo nano /etc/hosts
    sudo nano /etc/hostname

    sudo reboot


## Remarks (for me)


- hostname of the "motion"/GoPiGo RPI : `bobby.local` => `ssh pi@bobby.local`
- broker: `zeira.corp`
- run motion module: `node bob.next/bobby.js`




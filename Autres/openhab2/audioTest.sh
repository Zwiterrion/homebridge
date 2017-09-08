#!/bin/bash

curl -i -X POST -H 'Content-Type: text/plain' -d '//192.168.86.55/openhab2/myRecording04.mp3' http://localhost:8080/rest/items/sonos_PLAY1_RINCON_949F3E8C3E8001400_playuri

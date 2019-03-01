rm -rf assets/audiosprites
export PATH=$PATH:/c/Applications/ffmpeg/bin
audiosprite audio/*.mp3 -o assets/audiosprites/sounds
sleep 10

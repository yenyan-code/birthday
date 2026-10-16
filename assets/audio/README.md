# Audio Directory

Audio in **Dagan Bai!** is procedurally synthesized via the browser's native **Web Audio API** in `src/js/surprise.js`. This guarantees that:
1. Audio plays reliably without CORS or network latency issues.
2. 8-bit sound effects (jump glide, coin sparkle, collision thud) sound authentic.
3. The "Happy Birthday" melody plays in multi-voice triangle/sine harmony.

### Custom Audio Drop-in Support:
You can drop in audio files (`.mp3` or `.ogg`) if you wish to swap synthesized sound effects with pre-recorded voice lines or music:
* `jump.mp3` — Custom jump SFX
* `coin.mp3` — Custom coin chime
* `crash.mp3` — Custom collision sound
* `birthday.mp3` — Full studio birthday music track

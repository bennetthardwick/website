---
title: Connect to a Projector with xrandr
type: text
---
It almost seems like a rite of passage, connecting to a projector after ditching the floating WM.
While it may seem hard, it's actually quite easy!

1. View connected video outputs
```sh
> xrandr
  eDP1 connected primary 1920x1080+0+0 (normal left inverted right x axis y axis) 310mm x 170mm
  HDMI1 connected (normal left inverted right x axis y axis)
```

2. Select one of the available video outputs, e.g. `HDMI1`
```sh
> xrandr --output HDMI1 --auto
```

3. Profit!
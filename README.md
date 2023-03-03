# Pole Zero Response Plotter using HTML, CSS, JavaScript and ChartJS
You can run the HTML (index.html) directly to reach the app by using one of following browsers:
- Chrome
- Edge
- Firefox
- Safari

Special thanks to https://github.com/chrispahm/chartjs-plugin-dragdata
# Last updates
**Some additions:**
- Now negative symmetric of the response can be avoided by **draw_negative** variable and default is updated as **do not draw** (convertion between **draw** and **do not draw** is only available in the source/code part as a boolean).

**Note:** Since main purpose is to create a filter for real world applications, each point has a conjugate at the opposite part of the chart according to x axis; resultantly, positive and negative parts of the x axis are symmetric to each other in the response chart. By updating default to **do not draw**, I aimed to remove the negative part of the symmetric response chart since it is nonsense to keep it.
- Points created/moved that are too close to x axis (with a threshold of 0.25 by default) counts to be as one point WITH y=0 VALUE (only in calculation part, user still sees them as two points).

**Bug fix:**
- Case of points to be separated from their conjugates when mouse slides from +y to -y or -y to +y without releasing the point is fixed.
- Indexings of response chart are corrected (still limited with 15 for laplace(s) plane, 3.14(pi) for discrete laplace(z) plane).

# Illustration
To obtain ![](https://latex.codecogs.com/svg.latex?y=\frac{(s^2+4)(s+2)}{(s^2+4s+8)(s^2+2s+17)})'s response graph, you must put the poles and the zeros as following:
<p align="center"><img src="https://user-images.githubusercontent.com/77770587/222679656-1e778e08-c335-43b5-ad7a-bc5690ee24f1.png" width="750"></p>
<p align="center"><img src="https://user-images.githubusercontent.com/77770587/222679605-85b4ce5e-df7c-4a48-93ac-6e35befb3530.png" width="750"></p>

# General View & Options
<p align="center">s-plane Magnitude Response</p>
<p align="center"><img src="https://user-images.githubusercontent.com/77770587/222671101-0f0c98a5-7f76-4c83-a0f3-29f4e5fb0365.png" width="900"></p>
<p align="center">s-plane Phase Response</p>
<p align="center"><img src="https://user-images.githubusercontent.com/77770587/222671105-9293a778-f938-4491-89d0-9b7311439473.png" width="900"></p>
<p align="center">z-plane Magnitude Response</p>
<p align="center"><img src="https://user-images.githubusercontent.com/77770587/222671109-1885e35f-947b-43a9-bc88-344f4b3288c6.png" width="900"></p>
<p align="center">z-plane Phase Response</p>
<p align="center"><img src="https://user-images.githubusercontent.com/77770587/222671113-9dd9403a-60e0-4d90-87be-af5eefb60e9c.png" width="900"></p>

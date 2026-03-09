# 🌍 Planet Crafter

### **NASA Space Apps Challenge Project**

**Planet Crafter** is an interactive web application that allows users to design and explore their own planets while learning about planetary science and habitability. 

Built for the **NASA International Space Apps Challenge**, this project was created under the **“Create Your Own Challenge”** category to encourage curiosity about exoplanets, planetary environments, and the conditions required for life.

Users can simulate planetary conditions, visualize them in 3D, and compare their custom planet with real exoplanets discovered by NASA.

---

## 🚀 Inspiration

The **NASA Space Apps Challenge** is the world’s largest global hackathon where participants use NASA’s open data to solve problems related to Earth and space. 

Planet Crafter was designed to answer a fun scientific question:
> *What would happen if you could design your own planet? Could it support life? And does a similar planet already exist somewhere in the universe?*

This project transforms real astronomical data into an interactive learning experience.

---

## 🪐 Features

### 1. Interactive Planet Creation
Users can design their own planet by adjusting environmental parameters using sliders:
* 🌊 **Water Level**
* 🌡 **Temperature**
* ⭐ **Star Type**
* 🌫 **Atmospheric Pressure**
* 🌍 **Gravity**

These values dynamically influence the planet’s appearance and habitability.

### 2. Real-Time Habitability Detection
The program evaluates whether the planet could support life. A planet is considered habitable if it meets conditions such as:
* Suitable temperature range
* Adequate water presence
* Sufficient atmosphere
* Acceptable gravity range

If conditions fail, the system explains why the planet is barren.

### 3. 3D Planet Visualization
A fully interactive 3D planet model renders in real time using **Three.js**. The planet dynamically changes based on the selected parameters:
* **Water levels** change ocean coverage.
* **Temperature** changes terrain colors.
* **Atmosphere thickness** affects the visual glow.
* **Gravity** affects rotational speed.

### 4. NASA Exoplanet Comparison
The system retrieves real planetary data from **NASA's Exoplanet Archive API**. It compares the user’s planet with real exoplanets using a similarity scoring algorithm. The closest match is displayed with:
* Planet name
* Mass
* Radius

### 5. Planet Fact Engine
The system generates contextual observations based on conditions, such as:
* Extreme gravity warnings
* Frozen planet scenarios
* Ocean worlds
* Superheated steam atmospheres

### 6. Planet Export
Users can export their created planet as a **JSON configuration file**, allowing them to save their planet or share it with others.

---

## 🧠 How It Works

### **Frontend**
* **HTML / CSS / JavaScript**
* **Three.js** for 3D rendering
* **Custom GLSL shaders** for procedural planet generation

### **Backend**
* **Python / Flask** server
* The backend retrieves real exoplanet data from NASA and serves it to the frontend to bypass CORS policies.

---

## 📡 Data Source
This project uses real astronomical data from the **NASA Exoplanet Archive**. 
The application queries planetary properties including:
* Planet mass
* Planet radius
* Equilibrium temperature
* Host star temperature

---

## 🏗 Project Structure
```text
Planet-Crafter
│
├── index.html        # Landing page
├── server.py         # Flask backend
│
├── static/
│   ├── build.html    # Planet creation interface
│   ├── style.css     # UI styling
│   ├── script.js     # Core logic and simulation
│   └── Images/       # Asset folder
│
└── README.md
```
▶️ Running the Project
 1. Install Python dependencies

 ```bash
 pip install flask requests
 ```
 2.Start the server

 ```bash
 python server.py
 ```
 3.Open the application
 Navigate to: http://127.0.0.1:5000 or visit the live link [**Here**](https://planet-crafter.vercel.app)

## 🧪 Example Workflow
1. Launch the application and click **Create Planet.**

2. Adjust environmental parameters via sliders.

3. Observe the **3D planet** change in real-time.

4. Check the **Habitability Status.**

5. View the most similar **real exoplanet** discovered by NASA.

6. **Export** your planet configuration.

## 🎯 Educational Goals
Planet Crafter aims to help users understand:

•  Planetary environments and how they interact.

•  Habitability conditions for life as we know it.

•  The vast diversity of exoplanets in our galaxy.

•  The role of stars in planetary systems.

## 👨‍💻 Authors
**Noel & Robert** 
are the creators of Planet Crafter Built for the **NASA Space Apps Challenge.**

## 📜 License
This project is open-source and available under the **MIT License.**

⭐ *If you like this project, consider starring the repository!*

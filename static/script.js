
// --- Global Variable Declarations ---
let planet, plan;            // 'planet' for material/uniforms access; 'plan' for the Mesh
let directionalLight, dl;    // The DirectionalLight object
let atmosphere, atm;         // 'atmosphere' for material/opacity access; 'atm' for the Mesh
let gravity = 1.0;
let scene, camera, renderer; 
var most_similar;
// ----------------------------------------------
// --- UI Helper Functions ---
// ----------------------------------------------

function update3DModel() {
    // Get all current slider values
    const waterValue = parseFloat(document.getElementById('waterLevel').value);
    const tempValue = parseFloat(document.getElementById('temperature').value);
    const starValue = parseFloat(document.getElementById('starType').value);
    const atmValue = parseFloat(document.getElementById('atmosphere').value);
    const gravityValue = parseFloat(document.getElementById('gravity').value);

    // 1. Planet Shader Uniforms
    if (planet && planet.material && planet.material.uniforms) {
        planet.material.uniforms.u_waterLevel.value = waterValue;
        planet.material.uniforms.u_temperature.value = tempValue;
    }
}
function toCelsius(sliderValue) {
    // Converts slider value (0.0 to 1.0) to Celsius (-100°C to +100°C)
    return (sliderValue - 0.5) * 200;
}

function toFahrenheit(sliderValue) {
    const celsius = toCelsius(sliderValue);
    // Conversion: (C * 9/5) + 32
    return (celsius * 9 / 5) + 32;
}

function updateTemperatureDisplay(sliderValue) {
    const celsius = toCelsius(sliderValue);
    const fahrenheit = toFahrenheit(sliderValue);
    const tempDisplay = document.getElementById('temperatureValue');
    if (tempDisplay) {
        tempDisplay.textContent = `${celsius.toFixed(2)}°C / ${fahrenheit.toFixed(2)}°F`;
    }
}


// ----------------------------------------------
// --- Control Setup and Event Handlers ---
// ----------------------------------------------

const starTypeSlider = document.getElementById('starType');
function setupControls() {
    if (!document.getElementById('waterLevel')) return; 

    const waterLevelSlider = document.getElementById('waterLevel');
    const temperatureSlider = document.getElementById('temperature');
    const starTypeSlider = document.getElementById('starType');
    const atmosphereSlider = document.getElementById('atmosphere');
    const gravitySlider = document.getElementById('gravity');

    waterLevelSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        if (planet && planet.material && planet.material.uniforms) {
            planet.material.uniforms.u_waterLevel.value = value;
        }
        updatewa( value * 100, '%');
    });

    temperatureSlider.addEventListener('input', (event) => {
        const tempValue = parseFloat(event.target.value);
        if (planet && planet.material && planet.material.uniforms) {
            planet.material.uniforms.u_temperature.value = tempValue;
        }
        
        if (directionalLight) {
            const starColor = new THREE.Color();
            starColor.setHSL(0.0, 1.0, 0.5 + tempValue * 0.5);
            directionalLight.color.copy(starColor);
        }
        
        updateTemperatureDisplay(tempValue);
    });

    starTypeSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        if (directionalLight) {
            const red = 1.0;
            const green = 0.5 + value * 0.5;
            const blue = 1.0 - value; 
            directionalLight.color.setRGB(red, green, blue);
            directionalLight.intensity = 0.5 + value;
        }
        updateSliderstar( value);
    });

    atmosphereSlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        if (atmosphere && atmosphere.material) {
            atmosphere.material.opacity = value;
        }
        const pressure = value * 101325; 
        updateat( pressure / 1000);
    });

    gravitySlider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        gravity = value;
        updategr( value);
    });

    // Initial Display Setup
    updatewa( parseFloat(waterLevelSlider.value) * 100);
    updateTemperatureDisplay(parseFloat(temperatureSlider.value));
    updateSliderstar(parseFloat(starTypeSlider.value));
    updateat( parseFloat(atmosphereSlider.value) * 101325 / 1000,);
    updategr('gravity', parseFloat(gravitySlider.value), ' g');
}
function updateSliderstar(a){
const Display = document.getElementById('starTypeValue');
Display.textContent = a
}
function updatewa(a){
const Display = document.getElementById('waterLevelValue');
Display.textContent = a+" %"
}
function updateat(a){
const Display = document.getElementById('atmosphereValue');
Display.textContent = a+" Kpa"
}
function updategr(a){
const Display = document.getElementById('gravityValue');
Display.textContent = a+" g"
}
// ----------------------------------------------
// --- Life Possibility Check ---
// ----------------------------------------------

document.addEventListener("DOMContentLoaded", function() {
    var sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(function(slider) {
        slider.addEventListener("input", checkLifePossibility);
    });
    checkLifePossibility();
});
    var waterLevelSlider = document.getElementById('waterLevel');
    const temperatureSlider = document.getElementById('temperature');
    const atmosphereSlider = document.getElementById('atmosphere');
    const gravitySlider = document.getElementById('gravity');
function checkLifePossibility() {
    const indicator = document.getElementById('lifeIndicator');
    const waterLevelSlider = document.getElementById('waterLevel');
    const temperatureSlider = document.getElementById('temperature');
    const atmosphereSlider = document.getElementById('atmosphere');
    const gravitySlider = document.getElementById('gravity');

    if (!indicator || !waterLevelSlider || !temperatureSlider || !atmosphereSlider || !gravitySlider) return;

    const water = parseFloat(waterLevelSlider.value);
    const tempSliderVal = parseFloat(temperatureSlider.value);
    const atmosphereValue = parseFloat(atmosphereSlider.value); 
    const gravityValue = parseFloat(gravitySlider.value); 
    
    // Habitable Zone Rules:
    const minTempSlider = 0.5;
    const maxTempSlider = 0.75;
    const isTemperatureRight = tempSliderVal >= minTempSlider && tempSliderVal <= maxTempSlider;
    const hasWater = water > 0.5 && water < 0.9;
    const hasAtmosphere = atmosphereValue > 0.2;
    const tolerableGravity = gravityValue >= 1 && gravityValue <= 4.0;


    if (isTemperatureRight && hasWater && hasAtmosphere && tolerableGravity) {
        indicator.textContent = 'Life Status: HABITABLE (🟢)';
        indicator.className = 'life-indicator-box habitable';
    } else {
        let reason = '<b>Conditions are BARREN</b> (🔴) : <br>';
        
        if (!isTemperatureRight) {
            const currentC = toCelsius(tempSliderVal);
            reason += `Temp is ${currentC.toFixed(1)}°C. (Habitable: 0°C - 50°C) <br>`;
        } 
        if (!hasWater) {
            const currentWater = (water * 100).toFixed(0);
            reason += `Water level is ${currentWater}%. (Habitable: 50% - 90%) <br>`;
        } 
        if (!hasAtmosphere) {
            const currentPressure = (atmosphereValue * 101.325).toFixed(1);
            reason += `Atmosphere is ${currentPressure} kPa. (Habitable: > 20.26 kPa)<br>`;
        }
          
        if (!tolerableGravity) {
            reason += `Gravity is ${gravityValue.toFixed(1)}g. (Habitable: 1g - 4.0g).<br>`;
        }
        
        indicator.innerHTML = reason;
        indicator.className = 'life-indicator-box barren';
    }
}

// ----------------------------------------------
// --- GLSL Shaders ---
// ----------------------------------------------

const vertexShader = `
    varying vec3 vNormal;
    void main() {
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float u_waterLevel;
    uniform float u_temperature;
    varying vec3 vNormal;

    float random(vec3 v) {
        return fract(sin(dot(v.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    }

    float interpolate(float a, float b, float x) {
        float f = x * x * (3.0 - 2.0 * x);
        return a + f * (b - a);
    }

    float noise(vec3 v) {
        vec3 i = floor(v);
        vec3 f = fract(v);
        
        float v000 = random(i + vec3(0.0, 0.0, 0.0));
        float v100 = random(i + vec3(1.0, 0.0, 0.0));
        float v010 = random(i + vec3(0.0, 1.0, 0.0));
        float v110 = random(i + vec3(1.0, 1.0, 0.0));
        float v001 = random(i + vec3(0.0, 0.0, 1.0));
        float v101 = random(i + vec3(1.0, 0.0, 1.0));
        float v011 = random(i + vec3(0.0, 1.0, 1.0));
        float v111 = random(i + vec3(1.0, 1.0, 1.0));
        
        float x0 = interpolate(v000, v100, f.x);
        float x1 = interpolate(v010, v110, f.x);
        float x2 = interpolate(v001, v101, f.x);
        float x3 = interpolate(v011, v111, f.x);
        
        float y0 = interpolate(x0, x1, f.y);
        float y1 = interpolate(x2, x3, f.y);
        
        return interpolate(y0, y1, f.z);
    }

    void main() {
        float terrainNoise = noise(vNormal * 4.0);
        float detailNoise = noise(vNormal * 10.0) * 0.2;
        float finalNoise = terrainNoise + detailNoise;

        float effectiveWaterLevel = u_waterLevel - (0.5 - u_temperature) * 0.5;

        vec3 finalColor;
        if (finalNoise > effectiveWaterLevel) {
            float altitude = (finalNoise - effectiveWaterLevel) / (1.0 - effectiveWaterLevel);
            
            vec3 coldLand = mix(vec3(0.9, 0.9, 0.95), vec3(0.7, 0.7, 0.75), altitude);
            vec3 temperateLand = mix(vec3(0.0, 0.5, 0.0), vec3(0.5, 0.3, 0.0), altitude);
            vec3 hotLand = mix(vec3(0.8, 0.5, 0.1), vec3(0.5, 0.1, 0.0), altitude);

            if (u_temperature < 0.5) {
                float coldBlend = u_temperature * 2.0;
                finalColor = mix(coldLand, temperateLand, coldBlend);
            } else {
                float hotBlend = (u_temperature - 0.5) * 2.0;
                finalColor = mix(temperateLand, hotLand, hotBlend);
            }

            // Frost effect for sub-zero temperatures (u_temperature < 0.5)
            if (u_temperature < 0.5) {
                float frostAmount = 1.0 - u_temperature * 2.0; // 1.0 at coldest, 0.0 at freezing
                vec3 frostColor = vec3(1.0, 1.0, 1.0);
                finalColor = mix(finalColor, frostColor, frostAmount * (1.0 - altitude));
            }

        } else {
            float depth = (effectiveWaterLevel - finalNoise) / effectiveWaterLevel;

            vec3 coldWater = vec3(0.8, 0.9, 0.95);
            vec3 temperateWater = mix(vec3(0.0, 0.0, 0.5), vec3(0.2, 0.5, 0.8), depth);
            vec3 hotWater = mix(vec3(0.6, 0.2, 0.0), vec3(0.8, 0.5, 0.0), depth);
            
            if (u_temperature < 0.5) {
                float coldBlend = u_temperature * 2.0;
                finalColor = mix(coldWater, temperateWater, coldBlend);
            } else {
                float hotBlend = (u_temperature - 0.5) * 2.0;
                finalColor = mix(temperateWater, hotWater, hotBlend);
            }
        }
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

// ----------------------------------------------
// --- Three.js Setup and Animation ---
// ----------------------------------------------

function init() {
    if (typeof THREE === 'undefined' || !document.body) {
        console.error("THREE.js library not loaded or document not ready.");
        return;
    }

    const vizContainer = document.getElementById('planet-viz');
    if (!vizContainer) {
        console.error("HTML element with ID 'planet-viz' not found. Cannot initialize 3D scene.");
        return;
    }

    const width = vizContainer.clientWidth;
    const height = vizContainer.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 2;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    
    // CRITICAL FIX: Append canvas to the designated container
    vizContainer.appendChild(renderer.domElement); 

    // Initialize directionalLight
    dl = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight = dl; 
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    createPlanet();
    createAtmosphere();
    setupControls(); 
    animate();

    window.addEventListener('resize', onWindowResize, false);
}

function createPlanet() {
    const uniforms = {
        u_waterLevel: { type: 'f', value: 0.5 },
        u_temperature: { type: 'f', value: 0.5 }
    };

    const planetRadius = 1;
    const geometry = new THREE.SphereGeometry(planetRadius, 128, 128);

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    // Initialize global planet (for uniform access) and plan (for mesh access/rotation)
    planet = { material: { uniforms: uniforms } };
    plan = new THREE.Mesh(geometry, material);     
    scene.add(plan);
}

function createAtmosphere() {
    const geometry = new THREE.SphereGeometry(1.02, 64, 64);
    const material = new THREE.MeshStandardMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        side: THREE.BackSide
    });
    
    // Initialize global atmosphere (for opacity access) and atm (for mesh access/rotation)
    atmosphere = { material: material }; // Use the actual material object
    atm = new THREE.Mesh(geometry, material); 
    scene.add(atm); 
}

function animate() {
    requestAnimationFrame(animate);
    
    if (plan) {
        const rotationSpeed = 0.005;
        plan.rotation.y += rotationSpeed / gravity;
    }
    if (atm && plan) {
        atm.rotation.y = plan.rotation.y;
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function onWindowResize() {
    const vizContainer = document.getElementById('planet-viz');
    if (camera && renderer && vizContainer) {
        const width = vizContainer.clientWidth;
        const height = vizContainer.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
}

// Call init to start the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Add this new function to your script.js (e.g., after checkLifePossibility)
function checkAndDisplayFacts() {
    // Determine the right column element
    const rightColumn = document.querySelector('.text-box-msg');
    if (!rightColumn) return;

    const water = parseFloat(document.getElementById('waterLevel').value);
    const temp = parseFloat(document.getElementById('temperature').value); 
    const atmosphere = parseFloat(document.getElementById('atmosphere').value);
    const gravity = parseFloat(document.getElementById('gravity').value);
    const star = parseFloat(document.getElementById('starType').value);

    let factHTML = '<h3>Planet Stats Log</h3><p>System operational. Awaiting new data...</p>';
    
    // --- FUNNY FACT CONDITIONS (Quotes Corrected and Single Sentence Focus) ---

    // 1. Single Extreme: Vacuum Atmosphere (Very low atmosphere)
    if (atmosphere < 0.05) {
        // Escaping the apostrophe in "planet's"
        factHTML = '<h3>Air Shortage 💨</h3><p>Observation: The minimal atmospheric pressure means any exposed liquids instantly sublime, leading to the planet\'s continuous cosmic dehydration.</p>';
    } 
    // 2. Single Extreme: Very High Gravity
    else if (gravity > 5) {
        factHTML = '<h3>Physics Alert ⚠️</h3><p>Observation: The extreme gravitational field suggests that the entire planet\'s mass has compressed into a dense.</p>';
    } 
    // 3. Single Extreme: Extremely Low Temperature
    else if (temp < 0.1) {
        factHTML = '<h3>Deep Freeze 🥶</h3><p>Observation: Global temperatures are so near absolute zero that the entire planet is rendered a "static, giant molecular ice cube."</p>';
    }
    // 4. Single Extreme: Too Much Water
    else if (water > 0.95) {
        factHTML = '<h3>Hydro Survey </h3><p>Observation: With the surface entirely submerged, the planet functions as one massive, deep-sea aquatic sphere where land is only a geological concept.</p>';
    }

    // --- COMBINED CONDITIONS ---
    
    // 5. High Temperature + High Water (Water evaporates)
    else if (temp > 0.9 && water > 0.7) { 
        factHTML = '<h3>Atmospheric Report ♨️</h3><p>Observation: The intense surface heat causes rapid and constant water flash-evaporation, creating a thick, superheated layer of atmospheric steam.</p>';
    } 
    // 6. Low Gravity (Less extreme than #2)
    else if (gravity < 0.5) { 
        factHTML = '<h3>Leisure Report 🤸</h3><p>Observation: Due to the low gravity, any minor shift causes terrain and low-density objects to bounce long distances across the surface.</p>';
    } 
    // 7. Perfect but Boring
    else if (temp > 0.6 && temp < 0.7 && water > 0.6 && water < 0.7 && gravity > 0.9 && gravity < 1.1) {
        factHTML = '<h3>Regulatory Update ✅</h3><p>Observation: Conditions are so perfectly balanced that the planetary science team is struggling to find anything interesting to log.</p>';
    }
    
    // Default message (None of the above funny conditions were met)
    else {
        factHTML = '<h3>Planet Stats Log</h3><p>Observation: Conditions are stable, showing no immediate strange or anomalous phenomena.</p>';
    }
    
    // Update the content of the right column
    rightColumn.innerHTML = factHTML;
}
document.addEventListener("DOMContentLoaded", function() {
    var sliders = document.querySelectorAll('input[type="range"]');
    
    // Attach the Life Check and Fact Check to the 'input' event for all sliders
    sliders.forEach(function(slider) {
        slider.addEventListener("input", checkLifePossibility);
        // FIX: Add the fact checker listener here
        slider.addEventListener("input", checkAndDisplayFacts); 
    });
    
    // Run initial checks (ensure you have also called checkLifePossibility() earlier in your setup)
    checkAndDisplayFacts(); // Initial run to populate the right column
});

















var exo = [];
const MAX_SCORE = 999999; // Used to initialize the best match score

// --- NORMALIZATION CONSTANTS (Based on typical exoplanet data) ---
// Star Temperature (st_teff in Kelvin): User's Star Type Slider (0.0 to 1.0)
const STAR_TEMP_MIN = 2500; // M-dwarf
const STAR_TEMP_MAX = 10000; // A-type

// Planet Equilibrium Temperature (pl_eqt in Kelvin): User's Temperature Slider (0.0 to 1.0)
// This range focuses on planets with moderate temperatures.
const EQT_MIN = 100;
const EQT_MAX = 1500;

// Planet Mass (pl_bmasse in Earth Masses): Used for Gravity calculation
const MASS_MIN = 0.1;
const MASS_MAX = 10.0;

// Planet Radius (pl_rade in Earth Radii): Used for Gravity calculation
const RADIUS_MIN = 0.5;
const RADIUS_MAX = 2.0;

// User's Gravity Slider range (0.1 to 10.0 Earth Gs)
const USER_GRAVITY_MIN = 0.1;
const USER_GRAVITY_MAX = 10.0;

/**
 * Generic helper function to normalize a value within a min/max range to 0.0-1.0.
 * @param {number} value - The raw value.
 * @param {number} min - The minimum expected range boundary.
 * @param {number} max - The maximum expected range boundary.
 * @returns {number} Normalized value between 0.0 and 1.0.
 */
function getNormalizedValue(value, min, max) {
    if (value < min) return 0.0;
    if (value > max) return 1.0;
    return (value - min) / (max - min);
}

/**
 * Helper function to retrieve all current normalized slider values.
 * NOTE: The Gravity slider (0.1 to 10.0) is also normalized to 0.0-1.0 here for comparison.
 */
function getSliderValues() {
    // Get all input elements by their ID
    const starInput = document.getElementById('starType');
    const tempInput = document.getElementById('temperature');
    const gravityInput = document.getElementById('gravity');
    const userGravityRaw = gravityInput ? parseFloat(gravityInput.value) : 1.0;

    return {
        // Values from 0.0 to 1.0
        star: starInput ? parseFloat(starInput.value) : 0.5,
        temp: tempInput ? parseFloat(tempInput.value) : 0.5,
        // Normalize the 0.1-10.0 gravity slider to a 0.0-1.0 comparison scale
        gravity: getNormalizedValue(userGravityRaw, USER_GRAVITY_MIN, USER_GRAVITY_MAX)
    };
}

/**
 * This is the core function for comparison. It reads all current slider settings
 * and calculates a combined similarity score against every planet in the catalog.
 * It returns the planet with the lowest score (most similar).
 */
function findMostSimilarPlanet() {
    if (exo.length === 0) {
        console.warn("Exoplanet catalog is empty. Cannot perform comparison yet.");
        return;
    }
    console.warn("started.");

    // 1. Get current normalized slider values
    const userSettings = getSliderValues();
    let bestMatch = null;
    let lowestScore = MAX_SCORE;

    // 2. Iterate through exo for
    for (const planet of exo) {
        // Extract raw data fields (pl_name, pl_eqt, pl_bmasse, pl_rade, st_teff)
        const teff = planet.st_teff;
        const eqt = planet.pl_eqt;
        const mass = planet.pl_bmasse;
        const radius = planet.pl_rade;

        // Skip planets missing essential data for comparison
        if (!teff || !eqt || !mass || !radius) {
            continue;
        }

        // --- 3. Normalization and Difference Calculation ---
        let totalDifferenceSquared = 0;
        let score;

        // A. STAR TYPE COMPARISON (st_teff)
        const normTeff = getNormalizedValue(teff, STAR_TEMP_MIN, STAR_TEMP_MAX);
        const diffStar = normTeff - userSettings.star;
        totalDifferenceSquared += diffStar * diffStar; // Add squared difference

        // B. TEMPERATURE COMPARISON (pl_eqt)
        const normEqt = getNormalizedValue(eqt, EQT_MIN, EQT_MAX);
        const diffTemp = normEqt - userSettings.temp;
        totalDifferenceSquared += diffTemp * diffTemp;

        // C. GRAVITY COMPARISON (pl_bmasse & pl_rade)
        // We compare the user's desired gravity against the planet's normalized Mass AND Radius.
        const normMass = getNormalizedValue(mass, MASS_MIN, MASS_MAX);
        const diffMass = normMass - userSettings.gravity;
        totalDifferenceSquared += diffMass * diffMass;

        const normRadius = getNormalizedValue(radius, RADIUS_MIN, RADIUS_MAX);
        const diffRadius = normRadius - userSettings.gravity;
        totalDifferenceSquared += diffRadius * diffRadius;

        // The final score is the square root of the sum of squared differences (Euclidean Distance).
        score = Math.sqrt(totalDifferenceSquared);

        // 4. Check if this is the best match so far
        if (score < lowestScore) {
            lowestScore = score;
            bestMatch = planet;
        }
    }

    // 5. Display the best match
    if (bestMatch) {
        console.log(bestMatch)
        var rhtColumn = document.getElementById("right-column");
       rhtColumn.innerHTML= `<h3>Similar Exoplanet</h3><h4>${bestMatch.pl_name}</h4>
       <p>Mass: ${bestMatch.pl_bmasse} Earth mass <br>
       Radius : ${bestMatch.pl_rade} Earth radii </p>`
    } else {
        console.warn("Could not find a valid match in the catalog with complete data.");
        return null;
    }
}

/**
 * Fetches exoplanet data from the local Python/Flask server.
 */
function fetchExoplanetData() {
    // 🎯 Target the Flask endpoint defined in server.py
    const fullUrl = '/exoplanets';
    console.log(`Attempting to fetch data from local endpoint: ${fullUrl}`);

    fetch(fullUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error! Status: ${response.status}. Failed to load exoplanet data.`);
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                exo.push(...data);
                console.log('--- Exoplanet Data Successfully Retrieved and Stored ---');
                console.log(`Catalog size: ${exo.length} planets.`);
                // Run comparison once data is loaded to set the initial match
                // We call the runSimilarityCheck to ensure display is updated and comparison runs
                runSimilarityCheck();
            } else {
                console.error("Fetched data is not an array:", data);
            }
        })
        .catch(error => {
            console.error('Error fetching data from Flask server:', error);
        });
}
fetchExoplanetData();

/**
 * Updates the displayed value next to a specific slider.
 */


/**
 * Updates the display value for all sliders.
 */
function updateAllSliderDisplays() {
    updatewa(parseFloat(waterLevelSlider.value) * 100);
    updateTemperatureDisplay(parseFloat(temperatureSlider.value));
    updateSliderstar( parseFloat(starTypeSlider.value));
    updateat( parseFloat(atmosphereSlider.value) * 101325 / 1000);
    updategr(parseFloat(gravitySlider.value));
}

/**
 * Handles slider input event: updates the display and runs the similarity check.
 */
function runSimilarityCheck() {
    // 1. Update the display for the slider that moved (or all of them)
    updateAllSliderDisplays();

    // 2. Only run comparison if data has been fetched
    if (exo.length > 0) {
        findMostSimilarPlanet();
    }
}

// --- Execution Block (Refactored to meet user's requested structure) ---
document.addEventListener("DOMContentLoaded", function() {
    // Select all range input elements
    var sliders = document.querySelectorAll('input[type="range"]');

    // Attach the similarity check function to the 'input' event for all sliders
    sliders.forEach(function(slider) {
        slider.addEventListener("input", runSimilarityCheck);
        // Note: runSimilarityCheck handles both display update and comparison
    });

    // 1. Run initial display update (before data is even loaded)
    updateAllSliderDisplays();

    fetchExoplanetData();
});
function download(){
    const water = parseFloat(document.getElementById('waterLevel').value);
    const temp = parseFloat(document.getElementById('temperature').value); 
    const atmosphere = parseFloat(document.getElementById('atmosphere').value);
    const gravity = parseFloat(document.getElementById('gravity').value);
    const star = parseFloat(document.getElementById('starType').value);
    let text = {"data":{
        "name":"",
        "waterLevel":"",
        "temperature":"",
        "startype":"",
        "atmosphere":"",
        "gravity":""
    }
};
    text.data.name =  document.getElementById("plant-name-input").value;
    text.data.waterLevel = water;
    text.data.temperature = temp;
    text.data.startype = star;
    text.data.atmosphere = atmosphere;
    text.data.gravity = gravity;
    const jsonString = JSON.stringify(text, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Planet.json'; 
    link.click();
}

// Function is triggered when a file is selected
function loadPlanetConfig(event) {
    const file = event.target.files[0];
    if (!file) return; // Exit if no file was selected

    const reader = new FileReader();

    // This runs once the file has been successfully read into memory
    reader.onload = function(e) {
        try {
            
            var waterLevelSlider = document.getElementById('waterLevel');
            const temperatureSlider = document.getElementById('temperature');
            const atmosphereSlider = document.getElementById('atmosphere');
            const gravitySlider = document.getElementById('gravity');
            const starSlider = document.getElementById('starType');
            const config = JSON.parse(e.target.result);
            document.getElementById("plant-name-input").value = config.data.name
            // Ensure the values are valid numbers before using parseFloat()
            const waValue = parseFloat(config.data.waterLevel);
            if (!isNaN(waValue)) {
                updatewa(waValue * 100);
                waterLevelSlider.value=waValue
            } else {t
                console.warn("Invalid name value:", config.data.name);
            }

            const temperatureValue = parseFloat(config.data.temperature);
            if (!isNaN(temperatureValue)) {
                updateTemperatureDisplay(temperatureValue);
                temperatureSlider.value=temperatureValue
            }else {
                console.warn("Invalid temperature value:", config.data.temperature);
            }

            const starTypeValue = parseFloat(config.data.startype);
            if (!isNaN(starTypeValue)) {
                updateSliderstar(starTypeValue);
                starSlider.value=starTypeValuse;
            } else {
                console.warn("Invalid star type value:", config.data.startype);
            }

            const atmosphereValue = parseFloat(config.data.atmosphere);
            if (!isNaN(atmosphereValue)) {
                updateat(atmosphereValue * 101325 / 1000);
                atmosphereSlider.value=atmosphereValue; // Fixed the comma issue here
            } else {
                console.warn("Invalid atmosphere value:", config.data.atmosphere);
            }

        } catch (error) {
            alert("Failed to load planet config");
            console.error(error); // Log the error for debugging
        }
    };

    // Start reading the file as plain text
    reader.readAsText(file);
}

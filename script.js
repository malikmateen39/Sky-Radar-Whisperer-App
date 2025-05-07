// Set current year in the footer
document.getElementById('current-year').textContent = new Date().getFullYear();
    
// Aircraft class and data structure
class Aircraft {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.type = ['Commercial', 'Military', 'Private', 'Unknown'][Math.floor(Math.random() * 4)];
    this.altitude = Math.floor(Math.random() * 40000);
    this.speed = Math.floor(Math.random() * 600) + 200;
    this.direction = Math.floor(Math.random() * 360);
    this.distance = Math.floor(Math.sqrt(x * x + y * y) * radarRange / 100);
  }
}

// State variables
let aircraft = [];
let selectedAircraft = null;
let radarRange = 100;
let sweepSpeed = 5;

// DOM elements
const aircraftContainer = document.getElementById('aircraft-container');
const aircraftDetails = document.getElementById('aircraft-details');
const rangeSlider = document.getElementById('range-slider');
const rangeValue = document.getElementById('range-value');
const speedSlider = document.getElementById('speed-slider');
const refreshButton = document.getElementById('refresh-button');
const radarSweep = document.querySelector('.radar-sweep');

// Initialize the application
function init() {
  // Generate initial aircraft
  generateRandomAircraft();
  
  // Set up event listeners
  rangeSlider.addEventListener('input', updateRadarRange);
  speedSlider.addEventListener('input', updateSweepSpeed);
  refreshButton.addEventListener('click', generateRandomAircraft);
  
  // Update aircraft positions periodically
  setInterval(updateAircraftPositions, 3000);
}

// Generate random aircraft
function generateRandomAircraft() {
  // Clear current aircraft
  aircraft = [];
  aircraftContainer.innerHTML = '';
  
  const numberOfAircraft = Math.floor(Math.random() * 8) + 3; // 3-10 aircraft
  
  for (let i = 0; i < numberOfAircraft; i++) {
    // Random position within the radar circle
    const distance = Math.random() * 80; // 0-80% from center
    const angle = Math.random() * 360; // 0-360 degrees
    const x = Math.cos(angle * Math.PI / 180) * distance;
    const y = Math.sin(angle * Math.PI / 180) * distance;
    
    const craft = new Aircraft(i + 1, x, y);
    aircraft.push(craft);
    
    // Create aircraft element
    createAircraftElement(craft);
  }
  
  // Clear selected aircraft
  selectedAircraft = null;
  updateAircraftDetails();
}

// Create aircraft DOM element
function createAircraftElement(craft) {
  const element = document.createElement('div');
  element.className = 'aircraft';
  element.dataset.id = craft.id;
  element.style.left = `calc(50% + ${craft.x * 0.5}%)`;
  element.style.top = `calc(50% + ${craft.y * 0.5}%)`;
  element.style.animationDelay = `${craft.id * 0.3}s`;
  
  // Plane SVG icon
  element.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
    </svg>
  `;
  
  // Add click event
  element.addEventListener('click', () => handleAircraftClick(craft));
  
  // Add to container
  aircraftContainer.appendChild(element);
}

// Update aircraft positions
function updateAircraftPositions() {
  aircraft.forEach(craft => {
    // Small random movement
    const angleChange = (Math.random() - 0.5) * 20;
    const newAngle = Math.atan2(craft.y, craft.x) * 180 / Math.PI + angleChange;
    const distance = Math.sqrt(craft.x * craft.x + craft.y * craft.y);
    const distanceChange = (Math.random() - 0.3) * 5;
    const newDistance = Math.max(10, Math.min(80, distance + distanceChange));
    
    craft.x = Math.cos(newAngle * Math.PI / 180) * newDistance;
    craft.y = Math.sin(newAngle * Math.PI / 180) * newDistance;
    craft.direction = Math.floor(Math.random() * 360);
    craft.distance = Math.floor(newDistance * radarRange / 100);
    craft.speed = Math.floor(Math.random() * 600) + 200;
    
    // Update DOM
    const element = document.querySelector(`.aircraft[data-id="${craft.id}"]`);
    if (element) {
      element.style.left = `calc(50% + ${craft.x * 0.5}%)`;
      element.style.top = `calc(50% + ${craft.y * 0.5}%)`;
    }
  });
  
  // Update details panel if an aircraft is selected
  if (selectedAircraft) {
    const updatedAircraft = aircraft.find(c => c.id === selectedAircraft.id);
    if (updatedAircraft) {
      selectedAircraft = updatedAircraft;
      updateAircraftDetails();
    } else {
      selectedAircraft = null;
      updateAircraftDetails();
    }
  }
}

// Handle aircraft click
function handleAircraftClick(craft) {
  // Remove previous selection
  const previousSelected = document.querySelector('.aircraft.selected');
  if (previousSelected) {
    previousSelected.classList.remove('selected');
  }
  
  // Set new selection
  selectedAircraft = craft;
  
  // Update selected class
  const element = document.querySelector(`.aircraft[data-id="${craft.id}"]`);
  if (element) {
    element.classList.add('selected');
  }
  
  // Update details panel
  updateAircraftDetails();
}

// Update aircraft details panel
function updateAircraftDetails() {
  if (selectedAircraft) {
    aircraftDetails.innerHTML = `
      <div class="detail-row">
        <span class="detail-label">ID:</span>
        <span class="detail-value">AC-${selectedAircraft.id.toString().padStart(4, '0')}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Type:</span>
        <span class="detail-value">${selectedAircraft.type}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Altitude:</span>
        <span class="detail-value">${selectedAircraft.altitude} ft</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Speed:</span>
        <span class="detail-value">${selectedAircraft.speed} knots</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Direction:</span>
        <span class="detail-value">${selectedAircraft.direction}°</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Distance:</span>
        <span class="detail-value">${selectedAircraft.distance} km</span>
      </div>
    `;
  } else {
    aircraftDetails.innerHTML = `
      <p style="color: var(--muted-foreground); font-size: 0.875rem;">
        Select an aircraft on the radar to view details
      </p>
    `;
  }
}

// Update radar range
function updateRadarRange(e) {
  radarRange = Number(e.target.value);
  rangeValue.textContent = radarRange;
  
  // Update distance labels
  document.querySelector('.label-25').textContent = `${Math.floor(radarRange * 0.25)}km`;
  document.querySelector('.label-50').textContent = `${Math.floor(radarRange * 0.5)}km`;
  document.querySelector('.label-75').textContent = `${Math.floor(radarRange * 0.75)}km`;
  
  // Update aircraft distances
  aircraft.forEach(craft => {
    const distance = Math.sqrt(craft.x * craft.x + craft.y * craft.y);
    craft.distance = Math.floor(distance * radarRange / 100);
  });
  
  // Update details if needed
  if (selectedAircraft) {
    updateAircraftDetails();
  }
}

// Update sweep speed
function updateSweepSpeed(e) {
  sweepSpeed = Number(e.target.value);
  
  // Update CSS animation duration
  radarSweep.style.animation = `radarSweep ${12 / sweepSpeed}s linear infinite`;
}

// Initialize the app
init();
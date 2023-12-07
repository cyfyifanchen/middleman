// Get the reference to the DOM element with class 'card'
const card = document.querySelector('.card')

// Calculate the height of the browser's address bar
function barHeight() {
  return window.outerHeight - window.innerHeight
}

// Convert client coordinates to screen coordinates
function clientToScreen(x, y) {
  const screenX = x + window.screenX
  const screenY = y + window.screenY + barHeight()
  return [screenX, screenY]
}

// Convert screen coordinates to client coordinates
function screenToClient(x, y) {
  const clientX = x - window.screenX
  const clientY = y - window.screenY - barHeight()
  return [clientX, clientY]
}

// Handle the card movement on mouse down
function moveCard(e) {
  // Calculate the initial position of the mouse relative to the card
  const x = e.pageX - card.offsetLeft
  const y = e.pageY - card.offsetTop

  // Handle the mouse move event
  function handleMouseMove(moveEvent) {
    const cx = moveEvent.pageX - x
    const cy = moveEvent.pageY - y

    // Move the card to the new position
    card.style.left = `${cx}px`
    card.style.top = `${cy}px`

    // Convert client coordinates to screen coordinates and broadcast
    const screenPoints = clientToScreen(cx, cy)
    channel.postMessage(screenPoints)
  }

  // Handle the mouse up event
  function handleMouseUp() {
    // Remove the event listeners when the mouse is released
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  // Add event listeners for mouse move and mouse up
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

// Create a BroadcastChannel named 'card'
const channel = new BroadcastChannel('card')

// Handle messages received on the 'card' channel
channel.onmessage = (e) => {
  // Convert screen coordinates to client coordinates and update the card position
  const [clientX, clientY] = screenToClient(...e.data)
  card.style.left = `${clientX}px`
  card.style.top = `${clientY}px`
}

// Add a mousedown event listener to start card movement
card.addEventListener('mousedown', moveCard)

// Initialize the card with the specified image type from the URL parameter
function init() {
  const url = new URL(location.href)
  const type = url.searchParams.get('type') || 'Q'
  card.src = `./${type}.svg`
}

// Call the initialization function
init()

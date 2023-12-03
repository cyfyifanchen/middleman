const card = document.querySelector('.card')

function barHeight() {
  return window.outerHeight - window.innerHeight
}

function clientToScreen(x, y) {
  const screenX = x + window.screenX
  const screenY = y + window.screenY + barHeight()
  return [screenX, screenY]
}

function screenToClient(x, y) {
  const clientX = x - window.screenX
  const clientY = y - window.screenY - barHeight()
  return [clientX, clientY]
}

function moveCard(e) {
  const x = e.pageX - card.offsetLeft
  const y = e.pageY - card.offsetTop

  function handleMouseMove(moveEvent) {
    const cx = moveEvent.pageX - x
    const cy = moveEvent.pageY - y

    card.style.left = `${cx}px`
    card.style.top = `${cy}px`

    const screenPoints = clientToScreen(cx, cy)
    channel.postMessage(screenPoints)
  }

  function handleMouseUp() {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const channel = new BroadcastChannel('card')
channel.onmessage = (e) => {
  const [clientX, clientY] = screenToClient(...e.data)
  card.style.left = `${clientX}px`
  card.style.top = `${clientY}px`
}

card.addEventListener('mousedown', moveCard)

function init() {
  const url = new URL(location.href)
  const type = url.searchParams.get('type') || 'Q'
  card.src = `./${type}.png`
}

init()

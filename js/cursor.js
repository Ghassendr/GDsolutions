/**
 * Custom cursor module
 * Creates and manages custom cursor animations
 */
export function initCursor(options = {}) {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) {
        console.warn('Cursor elements not found');
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    // Update position immediately on move
    function onMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    }

    document.addEventListener('mousemove', onMove);

    function animate() {
        const distX = mouseX - followerX;
        const distY = mouseY - followerY;
        followerX += distX * 0.14; // smoothing factor
        followerY += distY * 0.14;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animate);
    }

    animate();

    // enlarge cursor when hovering interactive elements
    const interactive = 'a, button, input, textarea, select, [role="button"], .btn, .nav-link';
    function addHoverListeners() {
        document.querySelectorAll(interactive).forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
                follower.style.transform = 'translate(-50%, -50%) scale(1.4)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    addHoverListeners();

    // hide cursor on touch-only devices (not hybrid devices)
    function detectTouch() {
        // Only hide on actual touch-only devices, not hybrid devices
        const isTouchOnly = window.matchMedia('(pointer: coarse)').matches && 
                           !window.matchMedia('(pointer: fine)').matches;
        if (isTouchOnly) {
            cursor.style.display = 'none';
            follower.style.display = 'none';
            document.removeEventListener('mousemove', onMove);
            return true;
        }
        return false;
    }

    // Only hide if it's a touch-only device, otherwise ensure cursor is visible
    if (!detectTouch()) {
        cursor.style.display = 'block';
        follower.style.display = 'block';
    }
}

export default { initCursor };

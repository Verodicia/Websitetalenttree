// This function runs when the entire page (including images, etc.) has loaded
window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');

    // Set a delay (e.g., 2000 milliseconds = 2 seconds) before fading out
    setTimeout(() => {
        splashScreen.classList.add('fade-out');

        // Optional: Remove the splash screen from the DOM entirely after the fade-out completes
        // This prevents it from potentially interfering with interactions later, though
        // `visibility: hidden` usually handles that.
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.remove(); // Removes the element from the HTML
        }, { once: true }); // Ensure this listener only runs once
    }, 10); // Adjust this delay as needed (in milliseconds)
});

// Your existing JavaScript code for nodes, dragging, and connections should be
// wrapped in document.addEventListener('DOMContentLoaded', ...) like this:

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('skill-tree-container');
    const svg = document.getElementById('connections-svg');
    let activeNode = null;
    let initialX, initialY, xOffset = 0, yOffset = 0;
    let isDragging = false; // Flag to differentiate click from drag

    // Store node positions and connections (can be loaded from JSON later)
    const nodes = [
        { id: 'node1', x: 200, y: 50, connections: ['node3', 'node4', 'node5'] },
        { id: 'node2', x: 600, y: 50, connections: ['node5', 'node6', 'node7'] },
        // row 2
        { id: 'node3', x: 100, y: 140, connections: ['node8', 'node9'] },
        { id: 'node4', x: 200, y: 140, connections: ['node9'] },
        { id: 'node5', x: 400, y: 140, connections: ['node9',' node10', 'node11'] },
        { id: 'node6', x: 600, y: 140, connections: ['node11',] },
        { id: 'node7', x: 700, y: 140, connections: ['node11', 'node12'] },
        // row 3
        { id: 'node8', x: 100, y: 230, connections: ['node13'] },
        { id: 'node9', x: 200, y: 230, connections: ['node13', 'node14',] },
        { id: 'node10', x: 400, y: 230, connections: ['node14', 'node15', 'node16'] },
        { id: 'node11', x: 600, y: 230, connections: ['node16','node17','node'] },
        { id: 'node12', x: 700, y: 230, connections: ['node17','node','node'] },
        // row 4
        { id: 'node13', x: 100, y: 320, connections: ['node18','node19','node20'] },
        { id: 'node14', x: 300, y: 320, connections: ['node20','node26','node'] },
        { id: 'node15', x: 400, y: 320, connections: ['node21','node','node'] },
        { id: 'node16', x: 500, y: 320, connections: ['node27', 'node22','node','node'] },
        { id: 'node17', x: 700, y: 320, connections: ['node22','node23','node24'] },
        // row 5
        { id: 'node18', x: 1, y: 410, connections: ['node25','node','node'] },
        { id: 'node19', x: 100, y: 410, connections: ['node25','node','node'] },
        { id: 'node20', x: 200, y: 410, connections: ['node25', 'node29'] },
        { id: 'node21', x: 400, y: 410, connections: ['node31','node','node'] },
        { id: 'node22', x: 600, y: 410, connections: ['node33','node28','node'] },
        { id: 'node23', x: 700, y: 410, connections: ['node28','node','node'] },
        { id: 'node24', x: 800, y: 410, connections: ['node28','node','node'] },
        //row 6
        { id: 'node25', x: 100, y: 500, connections: ['node34','node29','node'] },
        { id: 'node26', x: 300, y: 500, connections: ['node29', 'node30', 'node31'] },
        { id: 'node27', x: 500, y: 500, connections: ['node31','node32','node33'] },
        { id: 'node28', x: 700, y: 500, connections: ['node33','node38','node'] },
        // row 7
        { id: 'node29', x: 200, y: 590, connections: ['node34','node35'] },
        { id: 'node30', x: 300, y: 590, connections: ['node35', 'node'] },
        { id: 'node31', x: 400, y: 590, connections: ['node35','node36','node37'] },
        { id: 'node32', x: 500, y: 590, connections: ['node37'] },
        { id: 'node33', x: 600, y: 590, connections: ['node37','node38'] },
        // row 8
        { id: 'node34', x: 100, y: 680, connections: ['node39'] },
        { id: 'node35', x: 300, y: 680, connections: ['node40'] },
        { id: 'node36', x: 400, y: 680, connections: ['node', 'node'] },
        { id: 'node37', x: 500, y: 680, connections: ['node41'] },
        { id: 'node38', x: 700, y: 680, connections: ['node42'] },
        //row 9
        { id: 'node39', x: 100, y: 770, connections: ['node43'] },
        { id: 'node40', x: 300, y: 770, connections: ['node44', 'node45', 'node'] },
        { id: 'node41', x: 500, y: 770, connections: ['node46', 'node47', 'node'] },
        { id: 'node42', x: 700, y: 770, connections: ['node48', 'node49'] },
        //row 10
        { id: 'node43', x: 100, y: 860, connections: ['node'] },
        { id: 'node44', x: 250, y: 860, connections: ['node'] },
        { id: 'node45', x: 350, y: 860, connections: ['node'] },
        { id: 'node46', x: 450, y: 860, connections: ['node', 'node'] },
        { id: 'node47', x: 550, y: 860, connections: ['node'] },
        { id: 'node48', x: 650, y: 860, connections: ['node'] },
        { id: 'node49', x: 750, y: 860, connections: ['node'] },
        // ... more nodes
    ];

   function setInitialNodePositions() {
        const containerRect = container.getBoundingClientRect(); // Get container dimensions
        const nodeWidth = 80;
        const nodeHeight = 80; // Assuming height is also 80px

        nodes.forEach(nodeData => {
            let nodeElement = document.getElementById(nodeData.id);
            if (!nodeElement) { // If element doesn't exist yet, create it (dynamic nodes)
                nodeElement = document.createElement('div');
                nodeElement.classList.add('skill-node');
                nodeElement.id = nodeData.id;
                nodeElement.innerHTML = `<img src="images.png" alt="${nodeData.id}"><p class="node-title">${nodeData.id.replace('node', 'Skill ')}</p>`;
                container.appendChild(nodeElement);
            }

            // Ensure nodes stay within container boundaries initially
            let newX = Math.max(0, Math.min(nodeData.x, containerRect.width - nodeWidth));
            let newY = Math.max(0, Math.min(nodeData.y, containerRect.height - nodeHeight));

            nodeElement.style.left = `${newX}px`;
            nodeElement.style.top = `${newY}px`;
        });
        drawConnections();
    }


function drawConnections(highlightedNodeId = null) {
    svg.innerHTML = ''; // Clear existing lines
    // You can remove the entire <defs> block if you no longer need any markers at all
    // Or keep it if you plan to use other markers later
    svg.innerHTML += `
        <defs>
            </defs>
    `;

    nodes.forEach(node => {
        const sourceElement = document.getElementById(node.id);
        if (!sourceElement) return;

        const sourceRect = sourceElement.getBoundingClientRect();
        const sourceX = sourceRect.left + sourceRect.width / 2;
        const sourceY = sourceRect.top + sourceRect.height / 2;

        node.connections.forEach(targetId => {
            const targetElement = document.getElementById(targetId);
            if (!targetElement) return;

            const targetRect = targetElement.getBoundingClientRect();
            const targetX = targetRect.left + targetRect.width / 2;
            const targetY = targetRect.top + targetRect.height / 2;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', sourceX);
            line.setAttribute('y1', sourceY);
            line.setAttribute('x2', targetX);
            line.setAttribute('y2', targetY);

            // The only change here is that we no longer set the 'marker-end' attribute
            if (node.id === highlightedNodeId) {
                line.setAttribute('class', 'connection-arrow highlighted');
            } else {
                line.setAttribute('class', 'connection-arrow');
            }

            svg.appendChild(line);
        });
    });
}

    // Function to remove all highlights from nodes and connections
    function clearHighlights() {
        document.querySelectorAll('.skill-node.highlighted').forEach(node => {
            node.classList.remove('highlighted');
        });
        // We don't need to explicitly remove 'highlighted' from arrows,
        // as drawConnections() redraws them fresh with correct classes.
        drawConnections(); // Redraws all connections without highlights
    }


    // New: Handle click on a node
    function handleNodeClick(event) {
        // Prevent click event from firing if it was part of a drag
        if (isDragging) {
            isDragging = false; // Reset flag
            return;
        }

        const clickedNode = event.target.closest('.skill-node');
        if (clickedNode) {
            clearHighlights(); // Clear any existing highlights

            // Highlight the clicked node
            clickedNode.classList.add('highlighted');

            // Find the clicked node's data to get its connections
            const nodeData = nodes.find(n => n.id === clickedNode.id);
            if (nodeData) {
                // Redraw connections, highlighting those from the clicked node
                drawConnections(nodeData.id);
            }
        }
    }


    function dragStart(e) {
        if (e.target.closest('.skill-node')) {
            activeNode = e.target.closest('.skill-node');
            const rect = activeNode.getBoundingClientRect();
            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - rect.left;
                initialY = e.touches[0].clientY - rect.top;
            } else {
                initialX = e.clientX - rect.left;
                initialY = e.clientY - rect.top;
            }
            activeNode.style.cursor = 'grabbing';
            activeNode.style.zIndex = '100';
            isDragging = false; // Assume not dragging yet
            e.preventDefault();
        }
    }

    function drag(e) {
        if (activeNode) {
            // Check if movement exceeds a small threshold to consider it a drag
            const currentX = (e.type === 'touchmove') ? e.touches[0].clientX : e.clientX;
            const currentY = (e.type === 'touchmove') ? e.touches[0].clientY : e.clientY;
            const deltaX = Math.abs(currentX - (initialX + (activeNode.getBoundingClientRect().left)));
            const deltaY = Math.abs(currentY - (initialY + (activeNode.getBoundingClientRect().top)));
            if (deltaX > 5 || deltaY > 5) { // 5px threshold
                isDragging = true;
            }

            e.preventDefault();
            let newX, newY;
            if (e.type === 'touchmove') {
                newX = e.touches[0].clientX - initialX;
                newY = e.touches[0].clientY - initialY;
            } else {
                newX = e.clientX - initialX;
                newY = e.clientY - initialY;
            }

            const containerRect = container.getBoundingClientRect();
            const nodeWidth = activeNode.offsetWidth;
            const nodeHeight = activeNode.offsetHeight;

            let finalX = Math.max(0, Math.min(newX, containerRect.width - nodeWidth));
            let finalY = Math.max(0, Math.min(newY, containerRect.height - nodeHeight));

            activeNode.style.left = `${finalX}px`;
            activeNode.style.top = `${finalY}px`;

            drawConnections(activeNode.id); // Continuously redraw, potentially highlighting dragged node's connections
        }
    }

    function dragEnd() {
        if (activeNode) {
            activeNode.style.cursor = 'grab';
            activeNode.style.zIndex = 'auto';
            activeNode = null;
            // The click handler will deal with highlighting on mouseup/touchend if not a drag
            drawConnections(); // Redraw connections to clear active drag highlight
        }
    }


    // Add event listeners
    // Use 'pointerdown', 'pointermove', 'pointerup' for unified touch/mouse events
    // For simpler usage for now, we'll stick to separate mouse/touch, but add click
    container.addEventListener('mousedown', dragStart);
    container.addEventListener('mouseup', dragEnd);
    container.addEventListener('mousemove', drag);

    container.addEventListener('touchstart', dragStart, { passive: false });
    container.addEventListener('touchend', dragEnd);
    container.addEventListener('touchmove', drag, { passive: false });

    // Add click listener to the container. Event bubbling will catch clicks on nodes.
    container.addEventListener('click', handleNodeClick);

    // Initial setup
    setInitialNodePositions();
    window.addEventListener('resize', setInitialNodePositions);
});
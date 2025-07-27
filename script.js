// This function runs when the entire page (including images, etc.) has loaded
window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.remove();
        }, { once: true });
    }, 100);
});
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('skill-tree-container');
    const svg = document.getElementById('connections-svg');


    // Store node positions and connections (can be loaded from JSON later)
    const nodes = [
        { id: 'node1', x: 200, y: 50, connections: ['node3', 'node4', 'node5'] },
        { id: 'node2', x: 600, y: 50, connections: ['node5', 'node6', 'node7'] },
        // row 2
        { id: 'node3', x: 100, y: 140, connections: ['node8', 'node9'] },
        { id: 'node4', x: 200, y: 140, connections: ['node9'] },
        { id: 'node5', x: 400, y: 140, connections: ['node9','node10', 'node11'] },
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


    // Track highlighted nodes
    const highlightedNodes = new Set();

    // Add a click counter for each node
    const nodeClickCounts = {};
    nodes.forEach(node => {
        nodeClickCounts[node.id] = 0;
    });

    function setInitialNodePositions() {
        const containerRect = container.getBoundingClientRect();
        const nodeWidth = 80;
        const nodeHeight = 80;

        nodes.forEach(nodeData => {
            let nodeElement = document.getElementById(nodeData.id);
            if (!nodeElement) {
                nodeElement = document.createElement('div');
                nodeElement.classList.add('skill-node');
                nodeElement.id = nodeData.id;
                nodeElement.innerHTML = `
                    <img src="images.png" alt="${nodeData.id}">
                    <p class="node-title">${nodeData.id.replace('node', 'Skill ')}</p>
                    <span class="node-counter" style="display:none;">0</span>
                `;
                container.appendChild(nodeElement);
            }

            // Node 1 and 2 are always visible
            let isVisible = (nodeData.id === 'node1' || nodeData.id === 'node2');

            // Otherwise, show if highlighted or connected to a highlighted node
            if (!isVisible) {
                if (highlightedNodes.has(nodeData.id)) {
                    isVisible = true;
                } else {
                    nodes.forEach(n => {
                        if (highlightedNodes.has(n.id) && n.connections.includes(nodeData.id)) {
                            isVisible = true;
                        }
                    });
                }
            }

            nodeElement.style.display = isVisible ? 'flex' : 'none';

            let newX = Math.max(0, Math.min(nodeData.x, containerRect.width - nodeWidth));
            let newY = Math.max(0, Math.min(nodeData.y, containerRect.height - nodeHeight));
            nodeElement.style.left = `${newX}px`;
            nodeElement.style.top = `${newY}px`;
        });
        drawConnections();
    }

    function drawConnections() {
        svg.innerHTML = '<defs></defs>';
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
                // Highlight if source node is highlighted
                line.setAttribute('class', highlightedNodes.has(node.id) ? 'connection-arrow highlighted' : 'connection-arrow');
                svg.appendChild(line);
            });
        });
    }

    function handleNodeClick(event) {
        const clickedNode = event.currentTarget;
        const nodeId = clickedNode.id;
        const counterElem = clickedNode.querySelector('.node-counter');

        // If not highlighted, highlight and start counter at 1
        if (!highlightedNodes.has(nodeId)) {
            clickedNode.classList.add('highlighted');
            highlightedNodes.add(nodeId);
            nodeClickCounts[nodeId] = 1;
            counterElem.textContent = nodeClickCounts[nodeId];
            counterElem.style.display = 'block';
            setInitialNodePositions(); // <-- update visibility
            drawConnections();
        } else {
            // If already highlighted, increment the counter up to 5
            if (nodeClickCounts[nodeId] < 5) {
                nodeClickCounts[nodeId]++;
                counterElem.textContent = nodeClickCounts[nodeId];
            }
        }

        // Add pop animation
        clickedNode.classList.add('pop');
        setTimeout(() => {
            clickedNode.classList.remove('pop');
        }, 300);
    }

    // Initial setup
    setInitialNodePositions();

    // Ensure every node has a counter span and attach click listeners
    nodes.forEach(nodeData => {
        const nodeElement = document.getElementById(nodeData.id);
        if (nodeElement) {
            // Ensure every node has a counter span
            let counterElem = nodeElement.querySelector('.node-counter');
            if (!counterElem) {
                counterElem = document.createElement('span');
                counterElem.className = 'node-counter';
                counterElem.style.display = 'none';
                counterElem.textContent = '0';
                nodeElement.appendChild(counterElem);
            }
            nodeElement.addEventListener('click', handleNodeClick);
        }
    });

    window.addEventListener('resize', setInitialNodePositions);
});
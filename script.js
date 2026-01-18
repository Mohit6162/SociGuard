// INITIAL DATA
let visitorList = [
    { name: "Rahul Sharma", flat: "A-102", time: "10:45 AM", purpose: "Delivery", outTime: "-" },
    { name: "John Doe", flat: "B-201", time: "10:30 AM", purpose: "Guest", outTime: "-" }
];
let alertList = [];
let pendingList = [{ name: "Zomato Delivery", type: "Service" }, { name: "Courier Service", type: "Service" }];

let chartBar = null;
let chartCircle = null;

// NAVIGATION CONTROLLER
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    
    const target = document.getElementById(screenId);
    target.style.display = (screenId === 'login-screen') ? 'flex' : 'block';

    if (screenId === 'visitor-screen') {
        // Reset form and generate ID
        document.getElementById('v-id').value = "SG-" + Math.floor(1000 + Math.random() * 9000);
        document.getElementById('v-name').value = "";
        document.getElementById('v-flat').value = "";
        document.getElementById('v-purpose').value = "";
        document.getElementById('v-phone').value = "";
    }

    if (screenId === 'dashboard-screen') {
        renderTable();
        updateStats();
        setTimeout(initCharts, 50);
    }
}

// UPDATE STATS
function updateStats() {
    document.getElementById('live-visitor-count').innerText = visitorList.length;
    document.getElementById('alert-count').innerText = alertList.length;
}

// TABLE RENDERER
function renderTable(data = visitorList) {
    const body = document.getElementById('log-table-body');
    body.innerHTML = data.map((v, index) => `
        <tr>
            <td style="color: #64748b; font-weight: 500;">${v.time}</td>
            <td style="font-weight: 700;">${v.name}</td>
            <td style="color: var(--teal); font-weight: 700;">${v.flat}</td>
            <td><span class="purpose-badge">${v.purpose}</span></td>
            <td style="color: #ef4444; font-weight: 600;">${v.outTime}</td>
            <td>
                ${v.outTime === "-" 
                    ? `<button class="btn-checkout" onclick="checkoutVisitor(${index})">Logout 🚪</button>` 
                    : `<span class="status-completed">Completed ✅</span>`}
            </td>
        </tr>
    `).join('');
}

// SEARCH LOGIC
function handleSearch(query) {
    const filtered = visitorList.filter(v => 
        v.name.toLowerCase().includes(query.toLowerCase()) || 
        v.flat.toLowerCase().includes(query.toLowerCase())
    );
    renderTable(filtered);
}

// APPROVE ENTRY
function approveEntry() {
    const name = document.getElementById('v-name').value;
    const flat = document.getElementById('v-flat').value;
    const purpose = document.getElementById('v-purpose').value;

    if (!name || !flat || !purpose) return alert("Please fill all details.");

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add to top of list
    visitorList.unshift({ name, flat, time, purpose, outTime: "-" });

    alert(`Entry Authorized for ${name}.`);
    navigateTo('dashboard-screen');
}

// CHECKOUT VISITOR
function checkoutVisitor(index) {
    const logoutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    visitorList[index].outTime = logoutTime;
    renderTable();
}

// CHARTS
function initCharts() {
    const ctx1 = document.getElementById('trafficChart').getContext('2d');
    if (chartBar) chartBar.destroy();
    chartBar = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            datasets: [{ label: 'Visitors', data: [12, 19, 10, 32, 28, 45, 30], backgroundColor: '#6366f1', borderRadius: 4 }]
        }
    });

    const ctx2 = document.getElementById('occupancyChart').getContext('2d');
    if (chartCircle) chartCircle.destroy();
    chartCircle = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Occupied', 'Vacant'],
            datasets: [{ data: [85, 15], backgroundColor: ['#10b981', '#f1f5f9'], borderWidth: 0 }]
        },
        options: { cutout: '75%', plugins: { legend: { display: false } } }
    });
}

// MODAL CONTROLS
function openIncidentModal() { document.getElementById('ai-modal').style.display = 'flex'; }
function closeIncidentModal() { document.getElementById('ai-modal').style.display = 'none'; }
function closeDetails() { document.getElementById('details-modal').style.display = 'none'; }

function generateReport() {
    const vName = document.getElementById('ai-visitor-name').value;
    const notes = document.getElementById('ai-text').value;
    if (!vName || !notes) return alert("Fill information first");

    alertList.unshift({ visitor: vName, issue: notes });
    updateStats();
    closeIncidentModal();
    alert("Security Alert Logged.");
}

// STAT CLICKS
function showVisitorDetails() {
    document.getElementById('details-title').innerText = "Today's Visitors";
    document.getElementById('details-list-container').innerHTML = visitorList.map(v => `
        <div style="padding:10px; border-bottom:1px solid #eee;">
            <b>${v.name}</b> (${v.flat})<br><small>Purpose: ${v.purpose}</small>
        </div>`).join('');
    document.getElementById('details-modal').style.display = 'flex';
}

function showPendingDetails() {
    document.getElementById('details-title').innerText = "Pending Review";
    document.getElementById('details-list-container').innerHTML = pendingList.map(p => `
        <div style="padding:10px; border-bottom:1px solid #eee;">
            <b>${p.name}</b><br><small>Type: ${p.type}</small>
        </div>`).join('');
    document.getElementById('details-modal').style.display = 'flex';
}

function showAlertDetails() {
    document.getElementById('details-title').innerText = "Security Alerts";
    document.getElementById('details-list-container').innerHTML = alertList.length ? alertList.map(a => `
        <div style="background:#fff1f2; padding:10px; margin-bottom:5px; border-left:4px solid red;">
            <b>${a.visitor}</b><br><small>${a.issue}</small>
        </div>`).join('') : "No active alerts.";
    document.getElementById('details-modal').style.display = 'flex';
}
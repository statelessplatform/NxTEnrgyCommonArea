(function() {
'use strict';

// Constants
const GRID_RATE = 10.50;
const COMPETITOR_RATE = 7.50;
const NXT_RATE = 5.40;
const NXT_FIXED_MONTHLY = 200;

// Elements
const slider = document.getElementById('unitSlider');
const manualInput = document.getElementById('manualUnits');
const unitsDisplay = document.getElementById('unitsDisplay');
const viewToggle = document.getElementById('viewToggle');
const toggleContainer = document.querySelector('.view-toggle-container');
const complianceToggle = document.getElementById('complianceToggle');
const complianceContent = document.getElementById('complianceContent');
const scheduleToggle = document.getElementById('scheduleToggle');
const scheduleContent = document.getElementById('scheduleContent');

function formatCurrency(num) {
    return '₹' + Math.round(num).toLocaleString('en-IN');
}

function calculate() {
    let monthlyUnits = parseInt(slider.value);
    let isYearly = viewToggle.checked;

    // UI Updates based on View Mode
    if (isYearly) {
        toggleContainer.classList.add('yearly-active');
        document.getElementById('costTitle').textContent = "Annual";
        document.getElementById('totalSavingsLabel').textContent = "Annual";
        document.getElementById('vsLabel').textContent = "Annual Savings over Competitor:";
        document.getElementById('vsSubtext').textContent = "Extra savings with NxTEnrgy vs Competitor VNM per year";
        document.getElementById('nxtSubtext').textContent = "@ ₹5.40/unit + ₹2,400/year";
    } else {
        toggleContainer.classList.remove('yearly-active');
        document.getElementById('costTitle').textContent = "Monthly";
        document.getElementById('totalSavingsLabel').textContent = "Monthly";
        document.getElementById('vsLabel').textContent = "Monthly Savings over Competitor:";
        document.getElementById('vsSubtext').textContent = "Extra savings with NxTEnrgy vs Competitor VNM per month";
        document.getElementById('nxtSubtext').textContent = "@ ₹5.40/unit + ₹200/mo";
    }

    // Sync Inputs
    manualInput.value = monthlyUnits;
    unitsDisplay.textContent = monthlyUnits.toLocaleString('en-IN');

    // CORRECTED CALCULATION LOGIC
    // Step 1: Calculate monthly costs
    const monthlyGridCost = monthlyUnits * GRID_RATE;
    const monthlyCompetitorCost = monthlyUnits * COMPETITOR_RATE;
    const monthlyNxtCost = (monthlyUnits * NXT_RATE) + NXT_FIXED_MONTHLY;

    // Step 2: If yearly view, multiply monthly costs by 12
    let displayGridCost, displayCompetitorCost, displayNxtCost;
    if (isYearly) {
        displayGridCost = monthlyGridCost * 12;
        displayCompetitorCost = monthlyCompetitorCost * 12;
        displayNxtCost = monthlyNxtCost * 12;
    } else {
        displayGridCost = monthlyGridCost;
        displayCompetitorCost = monthlyCompetitorCost;
        displayNxtCost = monthlyNxtCost;
    }

    // Step 3: Calculate Savings
    const savingsVsGrid = displayGridCost - displayNxtCost;
    const savingsVsCompetitor = displayCompetitorCost - displayNxtCost;
    const savingsPercent = (savingsVsGrid / displayGridCost) * 100;

    // Step 4: Update UI - Costs
    document.getElementById('gridCost').textContent = formatCurrency(displayGridCost);
    document.getElementById('competitorCost').textContent = formatCurrency(displayCompetitorCost);
    document.getElementById('competitorCost2').textContent = formatCurrency(displayCompetitorCost);
    document.getElementById('nxtCost').textContent = formatCurrency(displayNxtCost);
    document.getElementById('nxtCost2').textContent = formatCurrency(displayNxtCost);

    // Step 5: Update UI - Comparison & Savings
    document.getElementById('savingsVsCompetitor').textContent = formatCurrency(savingsVsCompetitor);
    document.getElementById('totalSavings').textContent = formatCurrency(savingsVsGrid);
    document.getElementById('savingsPercent').textContent = Math.round(savingsPercent) + '%';
}

function generateCostSchedule() {
    let monthlyUnits = parseInt(slider.value);
    let current_rate = NXT_RATE;
    const tbody = document.getElementById('scheduleTableBody');
    tbody.innerHTML = '';

    let total20Year = 0;

    for (let year = 1; year <= 20; year++) {
        // Apply 2% discount every 4 years (starting at year 5, 9, 13, 17)
        let discountApplied = '';
        if (year > 1 && (year - 1) % 4 === 0) {
            current_rate = current_rate * 0.98;
            discountApplied = '<span class="discount-badge">2% Discount</span>';
        }

        const monthly_cost = (monthlyUnits * current_rate) + NXT_FIXED_MONTHLY;
        const annual_cost = monthly_cost * 12;
        total20Year += annual_cost;

        const row = document.createElement('tr');
        if (discountApplied) {
            row.classList.add('discount-year');
        }

        row.innerHTML = `
            <td>${year}</td>
            <td>₹${current_rate.toFixed(2)}</td>
            <td>${formatCurrency(monthly_cost)}</td>
            <td>${formatCurrency(annual_cost)}</td>
            <td>${discountApplied || '-'}</td>
        `;

        tbody.appendChild(row);
    }

    // Update summary values
    document.getElementById('finalRate').textContent = `₹${current_rate.toFixed(2)}/unit`;
    document.getElementById('total20Year').textContent = formatCurrency(total20Year);
}

// Event Listeners
slider.addEventListener('input', function() {
    calculate();
    generateCostSchedule();
});

manualInput.addEventListener('input', function() {
    let val = parseInt(this.value);
    if(val >= 5000 && val <= 1000000) {
        slider.value = val;
        calculate();
        generateCostSchedule();
    }
});

viewToggle.addEventListener('change', function() {
    calculate();
});

// Schedule Accordion Toggle
scheduleToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    scheduleContent.classList.toggle('active');
});

// Compliance Accordion Toggle
complianceToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    complianceContent.classList.toggle('active');
});

// Dialog
document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-action]');
    if (target) {
        const action = target.dataset.action;
        if (action === 'guide') {
            document.getElementById('guideModal').showModal();
        } else if (action === 'closeModal') {
            document.getElementById('guideModal').close();
        }
    }
});

// Init
calculate();
generateCostSchedule();
console.log('✅ Society Calculator Initialized - 20-Year Schedule with Accordion');

})();

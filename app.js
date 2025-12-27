(function() {
    'use strict';

    // Constants
    const GRID_RATE = 10.50; 
    const COMPETITOR_RATE = 7.50;
    const NXT_RATE = 5.50;
    const NXT_FIXED_MONTHLY = 200;

    // Elements
    const slider = document.getElementById('unitSlider');
    const manualInput = document.getElementById('manualUnits');
    const unitsDisplay = document.getElementById('unitsDisplay');
    const viewToggle = document.getElementById('viewToggle');
    const toggleContainer = document.querySelector('.view-toggle-container');
    const complianceToggle = document.getElementById('complianceToggle');
    const complianceContent = document.getElementById('complianceContent');

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
            document.getElementById('nxtSubtext').textContent = "@ ₹5.50/unit + ₹2,400/year";
        } else {
            toggleContainer.classList.remove('yearly-active');
            document.getElementById('costTitle').textContent = "Monthly";
            document.getElementById('totalSavingsLabel').textContent = "Monthly";
            document.getElementById('vsLabel').textContent = "Monthly Savings over Competitor:";
            document.getElementById('vsSubtext').textContent = "Extra savings with NxTEnrgy vs Competitor VNM per month";
            document.getElementById('nxtSubtext').textContent = "@ ₹5.50/unit + ₹200/mo";
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
        document.getElementById('nxtCost').textContent = formatCurrency(displayNxtCost);

        // Step 5: Update UI - Comparison & Savings
        document.getElementById('savingsVsCompetitor').textContent = formatCurrency(savingsVsCompetitor);
        document.getElementById('totalSavings').textContent = formatCurrency(savingsVsGrid);
        document.getElementById('savingsPercent').textContent = Math.round(savingsPercent) + '%';
    }

    // Event Listeners
    slider.addEventListener('input', function() {
        calculate();
    });

    manualInput.addEventListener('input', function() {
        let val = parseInt(this.value);
        if(val >= 5000 && val <= 1000000) {
            slider.value = val;
            calculate();
        }
    });

    viewToggle.addEventListener('change', function() {
        calculate();
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
    console.log('✅ Society Calculator Initialized - Logic Corrected');

})();

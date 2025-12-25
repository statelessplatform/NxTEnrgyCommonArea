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

    function formatCurrency(num) {
        return '₹' + Math.round(num).toLocaleString('en-IN');
    }

    function calculate() {
        let monthlyUnits = parseInt(slider.value);
        let isYearly = viewToggle.checked;
        let multiplier = isYearly ? 12 : 1;

        // UI Updates based on View Mode
        if (isYearly) {
            toggleContainer.classList.add('yearly-active');
            document.getElementById('unitsLabel').textContent = "Equivalent Monthly Units";
            document.getElementById('costTitle').textContent = "Annual";
            document.getElementById('totalSavingsLabel').textContent = "Annual";
            document.getElementById('vsSubtext').textContent = "Annual additional savings vs Competitor";
        } else {
            toggleContainer.classList.remove('yearly-active');
            document.getElementById('unitsLabel').textContent = "Units / Month";
            document.getElementById('costTitle').textContent = "Monthly";
            document.getElementById('totalSavingsLabel').textContent = "Monthly";
            document.getElementById('vsSubtext').textContent = "Monthly additional savings vs Competitor";
        }
        
        // Sync Inputs
        manualInput.value = monthlyUnits;
        unitsDisplay.textContent = monthlyUnits.toLocaleString('en-IN');

        // CALCULATION LOGIC
        // Always calculate based on monthly inputs, then multiply final results if yearly view is on.
        // This ensures the slider always represents the input "Monthly Units" which is easier for users to estimate.

        const unitsToCalc = monthlyUnits * multiplier;
        const fixedFeeToCalc = NXT_FIXED_MONTHLY * multiplier;

        // 1. Calculate Costs
        const gridCost = unitsToCalc * GRID_RATE;
        const competitorCost = unitsToCalc * COMPETITOR_RATE;
        const nxtCost = (unitsToCalc * NXT_RATE) + fixedFeeToCalc;

        // 2. Calculate Savings
        const savingsVsGrid = gridCost - nxtCost;
        const savingsVsCompetitor = competitorCost - nxtCost;
        const savingsPercent = (savingsVsGrid / gridCost) * 100;

        // 3. Update UI - Costs
        document.getElementById('gridCost').textContent = formatCurrency(gridCost);
        document.getElementById('competitorCost').textContent = formatCurrency(competitorCost);
        document.getElementById('nxtCost').textContent = formatCurrency(nxtCost);

        // 4. Update UI - Comparison & Savings
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
    console.log('Society Calculator Initialized 🏢');

})();

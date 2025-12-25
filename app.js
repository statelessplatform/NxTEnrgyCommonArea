(function() {
    'use strict';

    // Constants
    const GRID_RATE = 10.50; // Assumed Average Rate for Society/Commercial High Usage
    const COMPETITOR_RATE = 7.50;
    const NXT_RATE = 5.50;
    const NXT_FIXED = 200;

    // Elements
    const slider = document.getElementById('unitSlider');
    const manualInput = document.getElementById('manualUnits');
    const unitsDisplay = document.getElementById('unitsDisplay');

    function formatCurrency(num) {
        return '₹' + Math.round(num).toLocaleString('en-IN');
    }

    function calculate() {
        let units = parseInt(slider.value);
        
        // Sync Inputs
        manualInput.value = units;
        unitsDisplay.textContent = units.toLocaleString('en-IN');

        // 1. Calculate Monthly Costs
        const gridCost = units * GRID_RATE;
        const competitorCost = units * COMPETITOR_RATE;
        const nxtCost = (units * NXT_RATE) + NXT_FIXED;

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

        // 5. Update UI - Annual Projections
        document.getElementById('annualSavings').textContent = formatCurrency(savingsVsGrid * 12);
        document.getElementById('annualAdvantage').textContent = formatCurrency(savingsVsCompetitor * 12);
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

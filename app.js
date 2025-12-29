(function() {
    'use strict';

    // MSEB Slab Structure for LT Residential (FY 2025-26)
    // Based on the Excel sheet breakdown
    const MSEB_SLABS = [
        { min: 0, max: 100, rate: 6.25 },      // Base: 4.28 + FAC: 0.5 + Wheeling: 1.47
        { min: 101, max: 300, rate: 13.07 },   // Base: 11.1 + FAC: 0.5 + Wheeling: 1.47
        { min: 301, max: 500, rate: 17.35 },   // Base: 15.38 + FAC: 0.5 + Wheeling: 1.47
        { min: 501, max: Infinity, rate: 19.65 } // Base: 17.68 + FAC: 0.5 + Wheeling: 1.47
    ];

    const ELECTRICITY_DUTY_RATE = 0.16; // 16% electricity duty
    const FIXED_CHARGE_MONTHLY = 130; // Rs 130/month for residential
    
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

    // Calculate MSEB bill with slab rates + duty (matching Excel logic)
    function calculateMSEBBill(units) {
        let remainingUnits = units;
        let variableBill = 0;

        // Calculate slab-wise charges
        for (const slab of MSEB_SLABS) {
            if (remainingUnits <= 0) break;

            const slabStart = slab.min;
            const slabEnd = slab.max;
            const slabSize = slabEnd - slabStart;
            
            const unitsInSlab = Math.min(remainingUnits, slabSize);
            const slabAmount = unitsInSlab * slab.rate;

            variableBill += slabAmount;
            remainingUnits -= unitsInSlab;
        }

        // Add 16% electricity duty on variable bill
        const electricityDuty = variableBill * ELECTRICITY_DUTY_RATE;
        
        // Total = Fixed Charge + Variable Bill + Electricity Duty
        const totalBill = FIXED_CHARGE_MONTHLY + variableBill + electricityDuty;
        
        return totalBill;
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

        // CALCULATION LOGIC WITH EXACT MSEB SLAB RATES
        // Step 1: Calculate monthly costs
        const monthlyGridCost = calculateMSEBBill(monthlyUnits); // Slab-based with duty
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
    console.log('✅ Society Calculator - MSEB Slab Rates from Excel Applied');

})();

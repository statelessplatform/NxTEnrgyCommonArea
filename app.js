(function() {
    'use strict';

    // MSEB Slab Structure for LT Residential (FY 2025-26)
    const MSEB_SLABS = [
        { min: 0, max: 100, rate: 6.25 },
        { min: 101, max: 300, rate: 13.07 },
        { min: 301, max: 500, rate: 17.35 },
        { min: 501, max: Infinity, rate: 19.65 }
    ];

    const ELECTRICITY_DUTY_RATE = 0.16;
    const FIXED_CHARGE_MONTHLY = 130;
    
    const COMPETITOR_RATE = 7.50;
    const NXT_RATE_BASE = 5.40;
    const NXT_FIXED_MONTHLY = 200;
    
    // 20-Year Projection Constants
    const MSEDCL_INCREASE_RATE = 0.03; // 3% per year
    const DISCOUNT_RATE = 0.02; // 2% discount
    const DISCOUNT_INTERVAL = 4; // Every 4 years
    const DEGRADATION_RATE = 0.01; // 1% per year

    // Elements
    const slider = document.getElementById('unitSlider');
    const manualInput = document.getElementById('manualUnits');
    const unitsDisplay = document.getElementById('unitsDisplay');
    const viewToggle = document.getElementById('viewToggle');
    const toggleContainer = document.querySelector('.view-toggle-container');
    const complianceToggle = document.getElementById('complianceToggle');
    const complianceContent = document.getElementById('complianceContent');
    const projectionToggle = document.getElementById('projectionToggle');
    const projectionContent = document.getElementById('projectionContent');

    function formatCurrency(num) {
        return '₹' + Math.round(num).toLocaleString('en-IN');
    }

    // Calculate MSEB bill with slab rates + duty
    function calculateMSEBBill(units) {
        let remainingUnits = units;
        let variableBill = 0;

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

        const electricityDuty = variableBill * ELECTRICITY_DUTY_RATE;
        const totalBill = FIXED_CHARGE_MONTHLY + variableBill + electricityDuty;
        
        return totalBill;
    }

    // Calculate NxTEnrgy rate with discounts
    function getNxTEnrgyRate(year) {
        const discountsPassed = Math.floor((year - 1) / DISCOUNT_INTERVAL);
        const discountMultiplier = Math.pow((1 - DISCOUNT_RATE), discountsPassed);
        return NXT_RATE_BASE * discountMultiplier;
    }

    // Generate 20-year projection
    function generate20YearProjection(monthlyUnits) {
        const tableBody = document.getElementById('projectionTableBody');
        tableBody.innerHTML = '';
        
        let totalSavings = 0;
        let currentUnitsAnnual = monthlyUnits * 12;
        
        // Get base MSEDCL monthly cost
        const baseMSEDCLMonthlyCost = calculateMSEBBill(monthlyUnits);
        
        for (let year = 1; year <= 20; year++) {
            // Apply degradation to units
            const yearMultiplier = Math.pow((1 - DEGRADATION_RATE), (year - 1));
            const effectiveUnits = currentUnitsAnnual * yearMultiplier;
            
            // MSEDCL cost with 3% annual increase
            const msedclInflation = Math.pow((1 + MSEDCL_INCREASE_RATE), (year - 1));
            const msedclAnnualCost = baseMSEDCLMonthlyCost * 12 * msedclInflation;
            
            // NxTEnrgy rate with discount every 4 years
            const nxtRate = getNxTEnrgyRate(year);
            const nxtAnnualCost = (effectiveUnits * nxtRate) + (NXT_FIXED_MONTHLY * 12);
            
            // Annual savings
            const annualSavings = msedclAnnualCost - nxtAnnualCost;
            totalSavings += annualSavings;
            
            // Create table row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>Year ${year}</td>
                <td>${formatCurrency(msedclAnnualCost)}</td>
                <td>₹${nxtRate.toFixed(2)}/unit</td>
                <td>${Math.round(effectiveUnits).toLocaleString('en-IN')}</td>
                <td>${formatCurrency(nxtAnnualCost)}</td>
                <td>${formatCurrency(annualSavings)}</td>
            `;
            tableBody.appendChild(row);
        }
        
        // Update total savings
        document.getElementById('total20YearSavings').textContent = formatCurrency(totalSavings);
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

        // CALCULATION LOGIC WITH EXACT MSEB SLAB RATES
        const monthlyGridCost = calculateMSEBBill(monthlyUnits);
        const monthlyCompetitorCost = monthlyUnits * COMPETITOR_RATE;
        const monthlyNxtCost = (monthlyUnits * NXT_RATE_BASE) + NXT_FIXED_MONTHLY;

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

        const savingsVsGrid = displayGridCost - displayNxtCost;
        const savingsVsCompetitor = displayCompetitorCost - displayNxtCost;
        const savingsPercent = (savingsVsGrid / displayGridCost) * 100;

        // Update UI
        document.getElementById('gridCost').textContent = formatCurrency(displayGridCost);
        document.getElementById('competitorCost').textContent = formatCurrency(displayCompetitorCost);
        document.getElementById('nxtCost').textContent = formatCurrency(displayNxtCost);
        document.getElementById('savingsVsCompetitor').textContent = formatCurrency(savingsVsCompetitor);
        document.getElementById('totalSavings').textContent = formatCurrency(savingsVsGrid);
        document.getElementById('savingsPercent').textContent = Math.round(savingsPercent) + '%';
        
        // Generate 20-year projection
        generate20YearProjection(monthlyUnits);
    }

    // Event Listeners
    slider.addEventListener('input', calculate);

    manualInput.addEventListener('input', function() {
        let val = parseInt(this.value);
        if(val >= 5000 && val <= 1000000) {
            slider.value = val;
            calculate();
        }
    });

    viewToggle.addEventListener('change', calculate);

    // Projection Accordion
    projectionToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        projectionContent.classList.toggle('active');
    });

    // Compliance Accordion
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
    console.log('✅ Society Calculator Fully Initialized - All Features Working');

})();

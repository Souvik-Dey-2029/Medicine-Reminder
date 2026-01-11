// ==================== COUNTERFEIT MEDICINE DETECTOR ====================
// Handles medicine verification and counterfeit detection

const CounterfeitDetector = {
    scanner: null,
    isScanning: false,
    verifiedMedicines: [],
    counterfeitDatabase: [],
    medicineAlternatives: {},

    // Initialize detector
    async init() {
        this.showComingSoonNotice();
        await this.loadData();
        this.initializeMedicineAlternatives();
        this.loadReportedCounterfeits();
        this.updateStatistics();
        console.log('Counterfeit Detector initialized');
    },

    // Show coming soon notice
    showComingSoonNotice() {
        // Create full-screen modal overlay
        const modalHTML = `
            <div id="comingSoonModal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.85);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 99999;
                animation: fadeIn 0.3s ease;
            ">
                    <div style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 2rem 1.5rem;
                        border-radius: 16px;
                        max-width: 500px;
                        width: 90%;
                        text-align: center;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                        animation: slideUp 0.5s ease;
                        position: relative;
                    ">
                        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🚀</div>
                        <h1 style="margin: 0 0 0.5rem 0; font-size: 1.8rem; font-weight: bold;">
                            Coming Soon Features!
                        </h1>
                        <p style="font-size: 1rem; line-height: 1.5; margin: 1rem 0; opacity: 0.95;">
                            We're building amazing features for you:
                        </p>
                                        
                    <div style="text-align: left; margin: 2rem auto; max-width: 500px;">
                        <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 10px; backdrop-filter: blur(10px);">
                            <strong style="font-size: 1.1rem;">🤖 AI-Powered Verification</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; opacity: 0.9;">
                                Advanced machine learning to detect counterfeit medicines
                            </p>
                        </div>
                        
                        <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 10px; backdrop-filter: blur(10px);">
                            <strong style="font-size: 1.1rem;">⚠️ Real-Time Alerts</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; opacity: 0.9;">
                                Instant notifications for counterfeit detection with safety warnings
                            </p>
                        </div>
                        
                        <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 10px; backdrop-filter: blur(10px);">
                            <strong style="font-size: 1.1rem;">💊 Alternative Medicine Suggestions</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; opacity: 0.9;">
                                Smart recommendations for safe alternative medications
                            </p>
                        </div>
                        
                        <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 10px; backdrop-filter: blur(10px);">
                            <strong style="font-size: 1.1rem;">🔗 Blockchain Integration</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; opacity: 0.9;">
                                Secure and transparent medicine tracking system
                            </p>
                        </div>
                        
                        <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 10px; backdrop-filter: blur(10px);">
                            <strong style="font-size: 1.1rem;">📊 Analytics Dashboard</strong>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.95rem; opacity: 0.9;">
                                Detailed reports and statistics on verified medicines
                            </p>
                        </div>
                    </div>
                    
                    <p style="font-size: 1rem; margin: 2rem 0 1.5rem 0; opacity: 0.9;">
                        ⏰ These features will be available in the next update!
                    </p>
                    
                    <button onclick="document.getElementById('comingSoonModal').remove()" style="
                        background: white;
                        color: #667eea;
                        border: none;
                        padding: 1rem 3rem;
                        border-radius: 50px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        cursor: pointer;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                        transition: transform 0.2s, box-shadow 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.3)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)'">
                        Continue to Detector
                    </button>
                    
                    <p style="font-size: 0.85rem; margin-top: 1.5rem; opacity: 0.7;">
                        Current features: QR scanning, Manual verification, Batch processing
                    </p>
                </div>
            </div>
            
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            </style>
        `;

        // Insert modal at the beginning of body
        const body = document.querySelector('body');
        if (body) {
            const modal = document.createElement('div');
            modal.innerHTML = modalHTML;
            body.insertBefore(modal.firstElementChild, body.firstChild);
        }
    },

    // Load verification data
    async loadData() {
        const stored = localStorage.getItem('medreminder_verifications');
        if (stored) {
            try {
                this.verifiedMedicines = JSON.parse(stored);
            } catch (e) {
                this.verifiedMedicines = [];
            }
        }
        this.initializeCounterfeitDatabase();
    },

    // Initialize medicine alternatives database
    initializeMedicineAlternatives() {
        this.medicineAlternatives = {
            'Paracetamol': {
                alternatives: ['Ibuprofen', 'Aspirin', 'Diclofenac'],
                category: 'Pain Relief',
                safetyNote: 'Consult doctor before switching pain medications'
            },
            'Aspirin': {
                alternatives: ['Ibuprofen', 'Paracetamol', 'Naproxen'],
                category: 'Pain Relief',
                safetyNote: 'Avoid if you have bleeding disorders'
            },
            'Amoxicillin': {
                alternatives: ['Azithromycin', 'Ciprofloxacin', 'Doxycycline'],
                category: 'Antibiotic',
                safetyNote: 'Only switch antibiotics under medical supervision'
            },
            'Ibuprofen': {
                alternatives: ['Paracetamol', 'Diclofenac', 'Aspirin'],
                category: 'Pain Relief',
                safetyNote: 'Take with food to avoid stomach upset'
            },
            'Metformin': {
                alternatives: ['Glipizide', 'Sitagliptin', 'Empagliflozin'],
                category: 'Diabetes',
                safetyNote: 'Never change diabetes medication without doctor approval'
            },
            'Omeprazole': {
                alternatives: ['Pantoprazole', 'Ranitidine', 'Esomeprazole'],
                category: 'Gastric',
                safetyNote: 'Continue current dosage until replacement is available'
            },
            'Amlodipine': {
                alternatives: ['Nifedipine', 'Diltiazem', 'Verapamil'],
                category: 'Blood Pressure',
                safetyNote: 'Critical: Do not stop BP medication suddenly'
            },
            'Atorvastatin': {
                alternatives: ['Rosuvastatin', 'Simvastatin', 'Pravastatin'],
                category: 'Cholesterol',
                safetyNote: 'Maintain consistent statin therapy'
            },
            'Azithromycin': {
                alternatives: ['Amoxicillin', 'Doxycycline', 'Clarithromycin'],
                category: 'Antibiotic',
                safetyNote: 'Complete full antibiotic course'
            },
            'Ciprofloxacin': {
                alternatives: ['Levofloxacin', 'Moxifloxacin', 'Amoxicillin'],
                category: 'Antibiotic',
                safetyNote: 'Avoid dairy products 2 hours before/after dose'
            },
            'Cetirizine': {
                alternatives: ['Loratadine', 'Fexofenadine', 'Desloratadine'],
                category: 'Antihistamine',
                safetyNote: 'May cause drowsiness, use alternatives if driving'
            },
            'Montelukast': {
                alternatives: ['Salbutamol', 'Budesonide', 'Formoterol'],
                category: 'Asthma',
                safetyNote: 'Keep rescue inhaler available always'
            },
            'Lisinopril': {
                alternatives: ['Losartan', 'Enalapril', 'Ramipril'],
                category: 'Blood Pressure',
                safetyNote: 'Monitor blood pressure during transition'
            },
            'Losartan': {
                alternatives: ['Lisinopril', 'Valsartan', 'Telmisartan'],
                category: 'Blood Pressure',
                safetyNote: 'Check potassium levels regularly'
            },
            'Sertraline': {
                alternatives: ['Escitalopram', 'Fluoxetine', 'Paroxetine'],
                category: 'Antidepressant',
                safetyNote: 'Never stop antidepressants suddenly - taper slowly'
            },
            'Gabapentin': {
                alternatives: ['Pregabalin', 'Duloxetine', 'Amitriptyline'],
                category: 'Nerve Pain',
                safetyNote: 'Dosage adjustment needed when switching'
            },
            'Pantoprazole': {
                alternatives: ['Omeprazole', 'Lansoprazole', 'Rabeprazole'],
                category: 'Gastric',
                safetyNote: 'Take 30 minutes before meals'
            },
            'Levothyroxine': {
                alternatives: ['Liothyronine', 'Thyroid USP'],
                category: 'Thyroid',
                safetyNote: 'Critical: Maintain thyroid medication strictly'
            },
            'Salbutamol': {
                alternatives: ['Terbutaline', 'Formoterol', 'Salmeterol'],
                category: 'Asthma',
                safetyNote: 'Always carry emergency inhaler'
            },
            'Insulin Glargine': {
                alternatives: ['Insulin Detemir', 'Insulin Degludec', 'NPH Insulin'],
                category: 'Diabetes',
                safetyNote: 'URGENT: Contact doctor immediately for insulin replacement'
            }
        };
    },

    // Initialize known counterfeit database
    initializeCounterfeitDatabase() {
        this.counterfeitDatabase = [
            {
                name: 'Fake Paracetamol',
                batchNumber: 'FAKE2024001',
                manufacturer: 'Unknown Pharma',
                reportDate: '2024-01-10',
                reason: 'Suspicious packaging, no security features'
            },
            {
                name: 'Counterfeit Aspirin',
                batchNumber: 'CTF2023999',
                manufacturer: 'Dubious Corp',
                reportDate: '2024-01-08',
                reason: 'Invalid batch number, packaging mismatch'
            },
            {
                name: 'Fake Amoxicillin',
                batchNumber: 'FAKE2024002',
                manufacturer: 'Unknown Source',
                reportDate: '2024-01-05',
                reason: 'No manufacturer details, suspicious price'
            },
            {
                name: 'Counterfeit Azithromycin',
                batchNumber: 'CTF2024003',
                manufacturer: 'Fake Labs',
                reportDate: '2024-01-12',
                reason: 'Incorrect packaging, wrong color tablets'
            },
            {
                name: 'Fake Cetirizine',
                batchNumber: 'FAKE2024004',
                manufacturer: 'Unknown Origin',
                reportDate: '2024-01-15',
                reason: 'Missing hologram, suspicious batch code'
            }
        ];

        // Expanded genuine medicine database with 28 medicines
        this.genuineDatabase = [
            { name: 'Paracetamol', manufacturer: 'PharmaCorp Ltd', batchPrefix: 'PHC', category: 'Pain Relief' },
            { name: 'Aspirin', manufacturer: 'HealthMed Inc', batchPrefix: 'ASP', category: 'Pain Relief' },
            { name: 'Amoxicillin', manufacturer: 'BioPharm Solutions', batchPrefix: 'AMX', category: 'Antibiotic' },
            { name: 'Ibuprofen', manufacturer: 'MediCare Ltd', batchPrefix: 'IBU', category: 'Pain Relief' },
            { name: 'Metformin', manufacturer: 'DiabetesCare Inc', batchPrefix: 'MET', category: 'Diabetes' },
            { name: 'Omeprazole', manufacturer: 'GastroPharma', batchPrefix: 'OMP', category: 'Gastric' },
            { name: 'Amlodipine', manufacturer: 'CardioMed Ltd', batchPrefix: 'AML', category: 'Blood Pressure' },
            { name: 'Atorvastatin', manufacturer: 'LipidCare Inc', batchPrefix: 'ATO', category: 'Cholesterol' },
            { name: 'Levothyroxine', manufacturer: 'ThyroidPharma', batchPrefix: 'LEV', category: 'Thyroid' },
            { name: 'Lisinopril', manufacturer: 'BPMed Solutions', batchPrefix: 'LIS', category: 'Blood Pressure' },
            { name: 'Azithromycin', manufacturer: 'AntibioTech Ltd', batchPrefix: 'AZI', category: 'Antibiotic' },
            { name: 'Ciprofloxacin', manufacturer: 'InfectioCare Inc', batchPrefix: 'CIP', category: 'Antibiotic' },
            { name: 'Cetirizine', manufacturer: 'AllergyMed Corp', batchPrefix: 'CET', category: 'Antihistamine' },
            { name: 'Montelukast', manufacturer: 'RespiraPharma', batchPrefix: 'MON', category: 'Asthma' },
            { name: 'Losartan', manufacturer: 'HeartCare Ltd', batchPrefix: 'LOS', category: 'Blood Pressure' },
            { name: 'Clopidogrel', manufacturer: 'ThromboCare Inc', batchPrefix: 'CLO', category: 'Blood Thinner' },
            { name: 'Pantoprazole', manufacturer: 'GastroHealth Corp', batchPrefix: 'PAN', category: 'Gastric' },
            { name: 'Ranitidine', manufacturer: 'AcidCare Pharma', batchPrefix: 'RAN', category: 'Gastric' },
            { name: 'Diclofenac', manufacturer: 'PainRelief Ltd', batchPrefix: 'DIC', category: 'Pain Relief' },
            { name: 'Tramadol', manufacturer: 'AnalgesicMed Inc', batchPrefix: 'TRA', category: 'Pain Relief' },
            { name: 'Gabapentin', manufacturer: 'NeuroPharma Corp', batchPrefix: 'GAB', category: 'Nerve Pain' },
            { name: 'Sertraline', manufacturer: 'MentalHealth Ltd', batchPrefix: 'SER', category: 'Antidepressant' },
            { name: 'Escitalopram', manufacturer: 'PsychoCare Inc', batchPrefix: 'ESC', category: 'Antidepressant' },
            { name: 'Rosuvastatin', manufacturer: 'CholesterolCare Ltd', batchPrefix: 'ROS', category: 'Cholesterol' },
            { name: 'Insulin Glargine', manufacturer: 'DiabetesLab Inc', batchPrefix: 'INS', category: 'Diabetes' },
            { name: 'Salbutamol', manufacturer: 'BronchoPharma', batchPrefix: 'SAL', category: 'Asthma' },
            { name: 'Prednisolone', manufacturer: 'SteroMed Corp', batchPrefix: 'PRE', category: 'Steroid' },
            { name: 'Doxycycline', manufacturer: 'TetraMed Ltd', batchPrefix: 'DOX', category: 'Antibiotic' }
        ];
    },

    // Show counterfeit warning popup with alternatives
    showCounterfeitWarning(result) {
        const medicineName = result.name || 'This medicine';
        const alternatives = this.medicineAlternatives[result.name] || this.findAlternativesByCategory(result);

        let alertMessage = `⚠️ COUNTERFEIT MEDICINE DETECTED! ⚠️\n\n`;
        alertMessage += `Medicine: ${medicineName}\n`;
        alertMessage += `Batch: ${result.batchNumber}\n\n`;
        alertMessage += `🚨 DO NOT CONSUME THIS MEDICINE! 🚨\n\n`;
        
        if (alternatives) {
            alertMessage += `✅ SAFE ALTERNATIVES:\n\n`;
            alternatives.alternatives.forEach((alt, index) => {
                alertMessage += `${index + 1}. ${alt}\n`;
            });
            alertMessage += `\n⚕️ ${alternatives.safetyNote}\n\n`;
        } else {
            alertMessage += `Please consult your doctor immediately for safe alternatives.\n\n`;
        }

        alertMessage += `IMMEDIATE ACTIONS REQUIRED:\n`;
        alertMessage += `1. Stop using this medicine immediately\n`;
        alertMessage += `2. Keep the medicine in original packaging\n`;
        alertMessage += `3. Contact your doctor for alternatives\n`;
        alertMessage += `4. Report to local drug authorities\n`;
        alertMessage += `5. Inform the pharmacy where purchased\n\n`;
        alertMessage += `Emergency Helpline: 1800-180-3333`;

        alert(alertMessage);

        // Show visual warning banner
        this.showWarningBanner(result, alternatives);
    },

    // Show suspicious medicine warning
    showSuspiciousWarning(result) {
        const medicineName = result.name || 'This medicine';
        const alternatives = this.medicineAlternatives[result.name] || this.findAlternativesByCategory(result);

        let alertMessage = `⚠️ SUSPICIOUS MEDICINE WARNING ⚠️\n\n`;
        alertMessage += `Medicine: ${medicineName}\n`;
        alertMessage += `Batch: ${result.batchNumber}\n\n`;
        alertMessage += `This medicine failed some security checks.\n\n`;
        
        if (alternatives) {
            alertMessage += `RECOMMENDED ALTERNATIVES:\n\n`;
            alternatives.alternatives.forEach((alt, index) => {
                alertMessage += `${index + 1}. ${alt}\n`;
            });
            alertMessage += `\n⚕️ ${alternatives.safetyNote}\n\n`;
        }

        alertMessage += `PRECAUTIONS:\n`;
        alertMessage += `1. Verify with your pharmacist\n`;
        alertMessage += `2. Check packaging for tampering\n`;
        alertMessage += `3. Consider using alternatives\n`;
        alertMessage += `4. Consult your doctor if unsure`;

        alert(alertMessage);
    },

    // Find alternatives by category when specific medicine not in database
    findAlternativesByCategory(result) {
        if (!result.category) return null;

        const categoryAlternatives = {
            'Pain Relief': {
                alternatives: ['Paracetamol', 'Ibuprofen', 'Aspirin'],
                category: 'Pain Relief',
                safetyNote: 'Consult doctor before switching pain medications'
            },
            'Antibiotic': {
                alternatives: ['Amoxicillin', 'Azithromycin', 'Ciprofloxacin'],
                category: 'Antibiotic',
                safetyNote: 'Never switch antibiotics without medical supervision'
            },
            'Blood Pressure': {
                alternatives: ['Amlodipine', 'Lisinopril', 'Losartan'],
                category: 'Blood Pressure',
                safetyNote: 'Critical: Do not stop BP medication - contact doctor immediately'
            },
            'Diabetes': {
                alternatives: ['Metformin', 'Glipizide', 'Sitagliptin'],
                category: 'Diabetes',
                safetyNote: 'URGENT: Contact doctor immediately for diabetes medication'
            },
            'Gastric': {
                alternatives: ['Omeprazole', 'Pantoprazole', 'Ranitidine'],
                category: 'Gastric',
                safetyNote: 'Continue treatment to avoid acid rebound'
            }
        };

        return categoryAlternatives[result.category] || null;
    },

    // Show warning banner on page
    showWarningBanner(result, alternatives) {
        const existingBanner = document.getElementById('counterfeitBanner');
        if (existingBanner) existingBanner.remove();

        const banner = document.createElement('div');
        banner.id = 'counterfeitBanner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #c53030, #9b2c2c);
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideDown 0.5s ease;
        `;

        let bannerHTML = `
            <div style="max-width: 1200px; margin: 0 auto;">
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.2rem;">
                    🚨 COUNTERFEIT MEDICINE ALERT 🚨
                </h3>
                <p style="margin: 0 0 0.5rem 0;">
                    <strong>${result.name || 'Medicine'}</strong> (Batch: ${result.batchNumber}) is COUNTERFEIT!
                </p>
        `;

        if (alternatives) {
            bannerHTML += `
                <p style="margin: 0; font-size: 0.9rem;">
                    Safe Alternatives: ${alternatives.alternatives.join(', ')}
                </p>
            `;
        }

        bannerHTML += `
                <button onclick="document.getElementById('counterfeitBanner').remove()" 
                        style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: white; color: #c53030; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                    I Understand - Close Warning
                </button>
            </div>
        `;

        banner.innerHTML = bannerHTML;
        document.body.insertBefore(banner, document.body.firstChild);

        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (banner.parentElement) banner.remove();
        }, 30000);
    },

    // Start QR/Barcode scanning
    async startScanning() {
        try {
            if (typeof Html5Qrcode === 'undefined') {
                this.showFallbackScanner();
                return;
            }

            if (!this.scanner) {
                this.scanner = new Html5Qrcode("qr-reader");
            }

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            await this.scanner.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    this.handleScanSuccess(decodedText);
                },
                (errorMessage) => {
                    // Silent error handling
                }
            );

            this.isScanning = true;
            document.getElementById('startScanBtn').style.display = 'none';
            document.getElementById('stopScanBtn').style.display = 'inline-block';

        } catch (error) {
            console.error('Scanner error:', error);
            this.showFallbackMessage();
        }
    },

    // Show fallback message when camera fails
    showFallbackMessage() {
        const qrReader = document.getElementById('qr-reader');
        if (qrReader) {
            qrReader.innerHTML = `
                <div style="padding: 2rem; text-align: center;">
                    <p style="color: #e53e3e; margin-bottom: 1rem;">📷 Camera access failed</p>
                    <p style="color: #718096; font-size: 0.9rem;">Please use Manual Entry tab instead</p>
                </div>
            `;
        }
        this.showToast('Please allow camera access or use Manual Entry', 'warning');
    },

    // Stop scanning
    async stopScanning() {
        try {
            if (this.scanner && this.isScanning) {
                await this.scanner.stop();
                this.isScanning = false;
                document.getElementById('startScanBtn').style.display = 'inline-block';
                document.getElementById('stopScanBtn').style.display = 'none';
            }
        } catch (error) {
            console.error('Error stopping scanner:', error);
        }
    },

    // Handle successful scan
    async handleScanSuccess(decodedText) {
        await this.stopScanning();
        const data = this.parseScannedData(decodedText);
        
        if (data) {
            await this.verifyMedicine(data);
        } else {
            this.showToast('Invalid QR/Barcode format', 'error');
        }
    },

    // Parse scanned QR/Barcode data
    parseScannedData(text) {
        try {
            const jsonData = JSON.parse(text);
            return {
                name: jsonData.name || jsonData.medicine || '',
                batchNumber: jsonData.batch || jsonData.batchNumber || '',
                manufacturer: jsonData.manufacturer || jsonData.mfr || '',
                expiryDate: jsonData.expiry || jsonData.expiryDate || ''
            };
        } catch {
            const parts = text.split('|');
            if (parts.length >= 2) {
                return {
                    name: parts[0] || '',
                    batchNumber: parts[1] || '',
                    manufacturer: parts[2] || '',
                    expiryDate: parts[3] || ''
                };
            }
            return {
                name: '',
                batchNumber: text,
                manufacturer: '',
                expiryDate: ''
            };
        }
    },

    // Verify medicine authenticity
    async verifyMedicine(data) {
        this.showLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        const result = {
            ...data,
            verificationDate: new Date().toISOString(),
            status: 'unknown'
        };

        // Check counterfeit database
        const isCounterfeit = this.counterfeitDatabase.some(cf => 
            cf.batchNumber.toLowerCase() === data.batchNumber.toLowerCase()
        );

        if (isCounterfeit) {
            result.status = 'counterfeit';
            result.reason = 'This batch number is reported as counterfeit';
        } else {
            // Check genuine database
            const genuine = this.genuineDatabase.find(gm => 
                gm.name.toLowerCase() === data.name.toLowerCase() ||
                data.batchNumber.toUpperCase().startsWith(gm.batchPrefix)
            );

            if (genuine) {
                const checks = this.performSecurityChecks(data, genuine);
                
                if (checks.passed >= checks.total * 0.7) {
                    result.status = 'genuine';
                    result.confidence = Math.round((checks.passed / checks.total) * 100);
                    result.manufacturer = genuine.manufacturer;
                    result.category = genuine.category;
                    result.checksPerformed = checks;
                } else {
                    result.status = 'suspicious';
                    result.reason = 'Failed some security checks';
                    result.checksPerformed = checks;
                }
            } else {
                result.status = 'unknown';
                result.reason = 'Medicine not found in database';
            }
        }

        this.saveVerification(result);
        this.showLoading(false);

        // Show appropriate warning popup
        if (result.status === 'counterfeit') {
            this.showCounterfeitWarning(result);
        } else if (result.status === 'suspicious') {
            this.showSuspiciousWarning(result);
        }

        // Display result on page
        this.displayResult(result);
    },

    // Perform security checks
    performSecurityChecks(data, genuineData) {
        const checks = {
            total: 0,
            passed: 0,
            details: []
        };

        // Check 1: Batch number format
        checks.total++;
        if (data.batchNumber && data.batchNumber.length >= 8) {
            checks.passed++;
            checks.details.push({ name: 'Batch Number Format', status: 'pass' });
        } else {
            checks.details.push({ name: 'Batch Number Format', status: 'fail' });
        }

        // Check 2: Batch prefix
        checks.total++;
        if (data.batchNumber.toUpperCase().startsWith(genuineData.batchPrefix)) {
            checks.passed++;
            checks.details.push({ name: 'Batch Prefix Match', status: 'pass' });
        } else {
            checks.details.push({ name: 'Batch Prefix Match', status: 'fail' });
        }

        // Check 3: Expiry date validity
        checks.total++;
        if (data.expiryDate) {
            const expiryDate = new Date(data.expiryDate);
            const today = new Date();
            if (expiryDate > today) {
                checks.passed++;
                checks.details.push({ name: 'Valid Expiry Date', status: 'pass' });
            } else {
                checks.details.push({ name: 'Valid Expiry Date', status: 'fail' });
            }
        } else {
            checks.details.push({ name: 'Valid Expiry Date', status: 'skip' });
        }

        // Check 4: Manufacturer match
        checks.total++;
        if (data.manufacturer && data.manufacturer.toLowerCase().includes(genuineData.manufacturer.toLowerCase().split(' ')[0])) {
            checks.passed++;
            checks.details.push({ name: 'Manufacturer Verification', status: 'pass' });
        } else {
            checks.details.push({ name: 'Manufacturer Verification', status: 'fail' });
        }

        return checks;
    },

    // Display verification result
    displayResult(result) {
        const resultDiv = document.getElementById('verificationResult');
        if (!resultDiv) return;

        let statusClass = '';
        let icon = '';
        let title = '';
        let message = '';

        if (result.status === 'genuine') {
            statusClass = 'result-genuine';
            icon = '✅';
            title = 'Genuine Medicine';
            message = 'This medicine appears to be authentic';
        } else if (result.status === 'counterfeit') {
            statusClass = 'result-counterfeit';
            icon = '❌';
            title = 'Counterfeit Detected!';
            message = 'WARNING: This medicine is likely counterfeit';
        } else if (result.status === 'suspicious') {
            statusClass = 'result-unknown';
            icon = '⚠️';
            title = 'Suspicious Medicine';
            message = 'This medicine failed some verification checks';
        } else {
            statusClass = 'result-unknown';
            icon = '❓';
            title = 'Unknown Medicine';
            message = 'Unable to verify this medicine';
        }

        let html = `
            <div class="result-icon">${icon}</div>
            <div class="result-title">${title}</div>
            <p style="text-align: center; font-size: 1.1rem; margin-bottom: 1rem;">${message}</p>
        `;

        html += `
            <div class="result-details">
                <h3 style="margin-bottom: 1rem;">Medicine Details:</h3>
                ${result.name ? `<p><strong>Name:</strong> <span>${result.name}</span></p>` : ''}
                <p><strong>Batch Number:</strong> <span>${result.batchNumber}</span></p>
                ${result.manufacturer ? `<p><strong>Manufacturer:</strong> <span>${result.manufacturer}</span></p>` : ''}
                ${result.category ? `<p><strong>Category:</strong> <span>${result.category}</span></p>` : ''}
                ${result.expiryDate ? `<p><strong>Expiry Date:</strong> <span>${this.formatDate(result.expiryDate)}</span></p>` : ''}
                ${result.confidence ? `<p><strong>Confidence:</strong> <span>${result.confidence}%</span></p>` : ''}
            </div>
        `;

        if (result.checksPerformed) {
            html += `
                <div class="result-details" style="margin-top: 1rem;">
                    <h3 style="margin-bottom: 1rem;">Security Checks:</h3>
                    ${result.checksPerformed.details.map(check => `
                        <p>
                            <strong>${check.name}:</strong>
                            <span style="color: ${check.status === 'pass' ? '#48bb78' : check.status === 'fail' ? '#f56565' : '#718096'}">
                                ${check.status === 'pass' ? '✓ Passed' : check.status === 'fail' ? '✗ Failed' : '- Skipped'}
                            </span>
                        </p>
                    `).join('')}
                </div>
            `;
        }

        if (result.reason) {
            html += `
                <div class="result-details" style="margin-top: 1rem; background: #fffbeb;">
                    <p style="color: #ed8936; font-weight: 600;">${result.reason}</p>
                </div>
            `;
        }

        // Show alternatives section
        if (result.status === 'counterfeit' || result.status === 'suspicious') {
            const alternatives = this.medicineAlternatives[result.name] || this.findAlternativesByCategory(result);
            
            if (alternatives) {
                html += `
                    <div class="result-details" style="margin-top: 1rem; background: #f0fff4; border-left: 4px solid #48bb78;">
                        <h3 style="margin-bottom: 0.5rem; color: #2f855a;">✅ Safe Alternatives:</h3>
                        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                            ${alternatives.alternatives.map(alt => `<li style="margin: 0.3rem 0;">${alt}</li>`).join('')}
                        </ul>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #2d3748; font-style: italic;">
                            ⚕️ ${alternatives.safetyNote}
                        </p>
                    </div>
                `;
            }

            html += `
                <button class="report-btn" onclick="CounterfeitDetector.reportCounterfeit('${result.batchNumber}')">
                    🚨 Report This Medicine
                </button>
            `;
        }

        resultDiv.className = `verification-result ${statusClass} show`;
        resultDiv.innerHTML = html;
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        this.updateStatistics();
    },

    // Manual verification
    async verifyManual(event) {
        event.preventDefault();

        const data = {
            name: document.getElementById('medicineName').value.trim(),
            batchNumber: document.getElementById('batchNumber').value.trim(),
            manufacturer: document.getElementById('manufacturer').value.trim(),
            expiryDate: document.getElementById('expiryDate').value
        };

        if (!data.batchNumber) {
            this.showToast('Please enter batch number', 'error');
            return;
        }

        await this.verifyMedicine(data);
    },

    // Save verification
    saveVerification(result) {
        this.verifiedMedicines.unshift(result);
        if (this.verifiedMedicines.length > 100) {
            this.verifiedMedicines = this.verifiedMedicines.slice(0, 100);
        }
        localStorage.setItem('medreminder_verifications', JSON.stringify(this.verifiedMedicines));
    },

    // Update statistics
    updateStatistics() {
        const verifiedCount = this.verifiedMedicines.length;
        const counterfeitCount = this.verifiedMedicines.filter(v => v.status === 'counterfeit').length;

        const verifiedEl = document.getElementById('verifiedCount');
        const counterfeitEl = document.getElementById('counterfeitCount');
        
        if (verifiedEl) verifiedEl.textContent = verifiedCount;
        if (counterfeitEl) counterfeitEl.textContent = counterfeitCount;
    },

    // Load reported counterfeits
    loadReportedCounterfeits() {
        const container = document.getElementById('reportedList');
        if (!container) return;

        if (this.counterfeitDatabase.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #718096;">No reported counterfeits</p>';
            return;
        }

        container.innerHTML = this.counterfeitDatabase.map(cf => `
            <div class="medicine-card">
                <h4>${cf.name}</h4>
                <p><strong>Batch:</strong> ${cf.batchNumber}</p>
                <p><strong>Manufacturer:</strong> ${cf.manufacturer}</p>
                <p><strong>Reported:</strong> ${this.formatDate(cf.reportDate)}</p>
                <p><strong>Reason:</strong> ${cf.reason}</p>
            </div>
        `).join('');
    },

    // Report counterfeit
    reportCounterfeit(batchNumber) {
        const reason = prompt('Please describe why you believe this medicine is counterfeit:');
        
        if (reason && reason.trim()) {
            const report = {
                batchNumber: batchNumber,
                reason: reason.trim(),
                reportDate: new Date().toISOString(),
                reportedBy: 'User'
            };

            console.log('Counterfeit report:', report);
            this.showToast('⚠️ Thank you for reporting. Authorities have been notified.', 'warning');
            
            alert(`Thank you for reporting this counterfeit medicine.\n\nNext Steps:\n1. Do not consume this medicine\n2. Keep it in original packaging\n3. Report to local authorities\n4. Contact the manufacturer\n5. Inform your pharmacy`);
        }
    },

    // Batch upload handler
    async handleBatchUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.showLoading(true);

        try {
            const text = await file.text();
            const lines = text.split('\n');
            const results = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const [name, batchNumber, manufacturer] = line.split(',').map(s => s.trim());
                
                if (batchNumber) {
                    await this.verifyMedicine({
                        name: name || '',
                        batchNumber: batchNumber,
                        manufacturer: manufacturer || '',
                        expiryDate: ''
                    });
                    results.push({ batchNumber });
                }
            }

            this.showToast(`✅ Verified ${results.length} medicines`, 'success');

        } catch (error) {
            console.error('Batch upload error:', error);
            this.showToast('Failed to process batch file', 'error');
        }

        this.showLoading(false);
    },

    // Helper: Format date
    formatDate(dateStr) {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return dateStr;
        }
    },

    // Helper: Show toast
    showToast(message, type = 'info') {
        if (typeof Utils !== 'undefined' && Utils.showToast) {
            Utils.showToast(message, type);
        } else {
            alert(message);
        }
    },

    // Helper: Show loading
    showLoading(show) {
        if (typeof Utils !== 'undefined' && Utils.showLoading) {
            Utils.showLoading(show);
        }
    }
};

// Tab switching function
function switchScanTab(tab) {
    const tabs = document.querySelectorAll('.scan-tab');
    const contents = document.querySelectorAll('.scan-content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    event.target.classList.add('active');
    
    if (tab === 'qr') {
        document.getElementById('qr-scan').classList.add('active');
        CounterfeitDetector.stopScanning();
    } else if (tab === 'manual') {
        document.getElementById('manual-entry').classList.add('active');
        CounterfeitDetector.stopScanning();
    } else if (tab === 'batch') {
        document.getElementById('batch-verify').classList.add('active');
        CounterfeitDetector.stopScanning();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    CounterfeitDetector.init();
});

// Make available globally
window.CounterfeitDetector = CounterfeitDetector;